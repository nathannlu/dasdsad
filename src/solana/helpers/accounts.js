import {
  Keypair,
  PublicKey,
  SystemProgram,
  AccountInfo,
	Transaction,
	sendAndConfirmTransaction,
	sendAndConfirmRawTransaction,
} from '@solana/web3.js';
const nacl = require('tweetnacl');
import {
  CANDY_MACHINE,
  CANDY_MACHINE_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  FAIR_LAUNCH_PROGRAM_ID,
  AUCTION_HOUSE_PROGRAM_ID,
  AUCTION_HOUSE,
  FEE_PAYER,
  TREASURY,
  WRAPPED_SOL_MINT,
  TOKEN_ENTANGLEMENT_PROGRAM_ID,
  TOKEN_ENTANGLER,
  ESCROW,
  B,
  A,
  CANDY_MACHINE_PROGRAM_V2_ID,
} from './constants';
import { CLUSTERS, DEFAULT_CLUSTER } from './constants';
import * as anchor from '@project-serum/anchor';
//import fs from 'fs';
import {
  createCandyMachineV2Account,
  createConfigAccount,
} from './instructions';
import { web3 } from '@project-serum/anchor';
import log from 'loglevel';
import { AccountLayout, u64 } from '@solana/spl-token';
import Wallet from '../externals/nodewallet';
import bs58 from 'bs58';
import { throws } from 'assert';

import { BN, Program } from '@project-serum/anchor';

import { sendTransactionWithRetryWithKeypair } from './transactions';
/*
export type AccountAndPubkey = {
  pubkey: string;
  account: AccountInfo<Buffer>;
};

//export type StringPublicKey = string;

*/

// global prototype function
Object.prototype.toBuffer = function(fn) {
  
	if (typeof this == 'string') {
		console.log(this)

//    const payerWallet = Keypair.fromSecretKey(Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]));



    const decoded = bs58.decode(this);
//    const decoded = payerWallet.publicKey.toBuffer();
    console.log(decoded);


    // uint8Array = Uint8Array.from(decoded)

		return decoded
	}
};

// toBuffer for address
Object.prototype.addressToBuffer = function(fn) {

  const decoded = bs58.decode(this);
  return decoded;

};


export function getCluster(name) {
  for (const cluster of CLUSTERS) {
    if (cluster.name === name) {
      return cluster.url;
    }
  }
  return DEFAULT_CLUSTER.url;
}





// TODO: expose in spl package
export const deserializeAccount = (data) => {
  const accountInfo = AccountLayout.decode(data);
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
};

/*
export enum WhitelistMintMode {
  BurnEveryTime,
  NeverBurn,
}
export interface CandyMachineData {
  itemsAvailable: anchor.BN;
  uuid: null | string;
  symbol: string;
  sellerFeeBasisPoints: number;
  isMutable: boolean;
  maxSupply: anchor.BN;
  price: anchor.BN;
  retainAuthority: boolean;
  gatekeeper: null | {
    expireOnUse: boolean;
    gatekeeperNetwork: web3.PublicKey;
  };
  goLiveDate: null | anchor.BN;
  endSettings: null | [number, anchor.BN];
  whitelistMintSettings: null | {
    mode: WhitelistMintMode;
    mint: anchor.web3.PublicKey;
    presale: boolean;
    discountPrice: null | anchor.BN;
  };
  hiddenSettings: null | {
    name: string;
    uri: string;
    hash: Uint8Array;
  };
  creators: {
    address: PublicKey;
    verified: boolean;
    share: number;
  }[];
}

*/

export const createCandyMachineV2 = async function (
  anchorProgram,
  payerWallet,
  treasuryWallet,
  splToken,
	candyData,
) {
  const candyAccount = Keypair.generate();
  candyData.uuid = uuidFromConfigPubkey(candyAccount.publicKey);
	const sol = await window.solana.connect();
	const payerPublicAddress = new PublicKey(sol.publicKey.toString().toBuffer())

  if (!candyData.creators || candyData.creators.length === 0) {
    throw new Error(`Invalid config, there must be at least one creator.`);
  }

  const totalShare = (candyData.creators || []).reduce(
    (acc, curr) => acc + curr.share,
    0,
  );

  if (totalShare !== 100) {
    throw new Error(`Invalid config, creators shares must add up to 100`);
  }

  const remainingAccounts = [];
  if (splToken) {
    remainingAccounts.push({
      pubkey: splToken,
      isSigner: false,
      isWritable: false,
    });
  }

	const r = {
		candyMachine: candyAccount.publicKey,
    uuid: candyData.uuid,
    txId: await anchorProgram.instruction.initializeCandyMachine(candyData, {
      accounts: {
        candyMachine: candyAccount.publicKey,
        wallet:   payerPublicAddress,
        authority:  payerPublicAddress,
        payer:   payerPublicAddress,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    }),
	}

	const instructions = [
		await createCandyMachineV2Account(
			anchorProgram,
			candyData,
			payerPublicAddress,
			candyAccount.publicKey,
		),
		r.txId
	]

	let recentBlockhash = await anchorProgram.provider.connection.getRecentBlockhash();
	const transaction = new Transaction({
		recentBlockhash: recentBlockhash.blockhash,
    feePayer: payerWallet.publicKey
	})
	transaction.add(instructions[0]);
	transaction.add(instructions[1]);


	let transactionBuffer = transaction.serializeMessage();
	console.log(transactionBuffer)

//	let signature1 = nacl.sign.detached(transactionBuffer, payerWallet.secretKey);


	const signature1 = await window.solana.request({
		method: 'signTransaction',
		params: {
			message: bs58.encode(transactionBuffer)
		}
	})


	console.log(bs58.decode(signature1.signature))
  // console.log

	let signature2 = nacl.sign.detached(transactionBuffer, candyAccount.secretKey);

	transaction.addSignature(payerWallet.publicKey, bs58.decode(signature1.signature));
	transaction.addSignature(candyAccount.publicKey, (signature2));

	let isVerifiedSignature = transaction.verifySignatures();
	console.log(`The signatures were verifed: ${isVerifiedSignature}`)



// The signatures were verified: true

	let rawTransaction = transaction.serialize();

	const asd = await sendAndConfirmRawTransaction(anchorProgram.provider.connection, rawTransaction);
	console.log(asd)




	/*
	// Sign transaction, broadcast, and confirm
	const signature = await sendAndConfirmTransaction(
		anchorProgram.provider.connection,
		transaction,
		[payerWallet, candyAccount],
	);
	*/

//	let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);


//	console.log('SIGNATURE', signature);

//	console.log('the txn', finished)



  return r
};

export const createConfig = async function (
  anchorProgram,
  payerWallet,
  configData,
) {
  const configAccount = Keypair.generate();
  const uuid = uuidFromConfigPubkey(configAccount.publicKey);

  if (!configData.creators || configData.creators.length === 0) {
    throw new Error(`Invalid config, there must be at least one creator.`);
  }

  const totalShare = (configData.creators || []).reduce(
    (acc, curr) => acc + curr.share,
    0,
  );

  if (totalShare !== 100) {
    throw new Error(`Invalid config, creators shares must add up to 100`);
  }

  return {
    config: configAccount.publicKey,
    uuid,
    txId: await anchorProgram.rpc.initializeConfig(
      {
        uuid,
        ...configData,
      },
      {
        accounts: {
          config: configAccount.publicKey,
          authority: payerWallet.publicKey,
          payer: payerWallet.publicKey,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [payerWallet, configAccount],
        instructions: [
          await createConfigAccount(
            anchorProgram,
            configData,
            payerWallet.publicKey,
            configAccount.publicKey,
          ),
        ],
      },
    ),
  };
};

export function uuidFromConfigPubkey(configAccount) {
  return configAccount.toBase58().slice(0, 6);
}

export const getTokenWallet = async function (
  wallet,
  mint,
) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];
};

export const getCandyMachineAddress = async (
  config,
  uuid,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), config.toBuffer(), Buffer.from(uuid)],
    CANDY_MACHINE_PROGRAM_ID,
  );
};

export const deriveCandyMachineV2ProgramAddress = async (
  candyMachineId,
) => {
  return await PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), candyMachineId.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID,
  );
};

export const getConfig = async (
  authority,
  uuid,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(CANDY_MACHINE), authority.toBuffer(), Buffer.from(uuid)],
    CANDY_MACHINE_PROGRAM_ID,
  );
};

export const getTokenMint = async (
  authority,
  uuid,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('fair_launch'),
      authority.toBuffer(),
      Buffer.from('mint'),
      Buffer.from(uuid),
    ],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getFairLaunch = async (
  tokenMint,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fair_launch'), tokenMint.toBuffer()],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getCandyMachineCreator = async (
  candyMachine,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('candy_machine'), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID,
  );
};

export const getFairLaunchTicket = async (
  tokenMint,
  buyer,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fair_launch'), tokenMint.toBuffer(), buyer.toBuffer()],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getFairLaunchLotteryBitmap = async (
  tokenMint,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fair_launch'), tokenMint.toBuffer(), Buffer.from('lottery')],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getFairLaunchTicketSeqLookup = async (
  tokenMint,
  seq,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fair_launch'), tokenMint.toBuffer(), seq.toBuffer('le', 8)],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getAtaForMint = async (
  mint,
  buyer,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  );
};

export const getParticipationMint = async (
  authority,
  uuid,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('fair_launch'),
      authority.toBuffer(),
      Buffer.from('mint'),
      Buffer.from(uuid),
      Buffer.from('participation'),
    ],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getParticipationToken = async (
  authority,
  uuid,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('fair_launch'),
      authority.toBuffer(),
      Buffer.from('mint'),
      Buffer.from(uuid),
      Buffer.from('participation'),
      Buffer.from('account'),
    ],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getTreasury = async (
  tokenMint,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fair_launch'), tokenMint.toBuffer(), Buffer.from('treasury')],
    FAIR_LAUNCH_PROGRAM_ID,
  );
};

export const getMetadata = async (
  mint,
) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getMasterEdition = async (
  mint,
) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getEditionMarkPda = async (
  mint,
  edition,
) => {
  const editionNumber = Math.floor(edition / 248);
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition'),
        Buffer.from(editionNumber.toString()),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    )
  )[0];
};

export const getAuctionHouse = async (
  creator,
  treasuryMint,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_HOUSE), creator.toBuffer(), treasuryMint.toBuffer()],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getAuctionHouseProgramAsSigner = async () => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_HOUSE), Buffer.from('signer')],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getAuctionHouseFeeAcct = async (
  auctionHouse,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_HOUSE),
      auctionHouse.toBuffer(),
      Buffer.from(FEE_PAYER),
    ],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getAuctionHouseTreasuryAcct = async (
  auctionHouse,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_HOUSE),
      auctionHouse.toBuffer(),
      Buffer.from(TREASURY),
    ],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getAuctionHouseBuyerEscrow = async (
  auctionHouse,
  wallet,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(AUCTION_HOUSE), auctionHouse.toBuffer(), wallet.toBuffer()],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getAuctionHouseTradeState = async (
  auctionHouse,
  wallet,
  tokenAccount,
  treasuryMint,
  tokenMint,
  tokenSize,
  buyPrice,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(AUCTION_HOUSE),
      wallet.toBuffer(),
      auctionHouse.toBuffer(),
      tokenAccount.toBuffer(),
      treasuryMint.toBuffer(),
      tokenMint.toBuffer(),
      buyPrice.toBuffer('le', 8),
      tokenSize.toBuffer('le', 8),
    ],
    AUCTION_HOUSE_PROGRAM_ID,
  );
};

export const getTokenEntanglement = async (
  mintA,
  mintB,
) => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(TOKEN_ENTANGLER), mintA.toBuffer(), mintB.toBuffer()],
    TOKEN_ENTANGLEMENT_PROGRAM_ID,
  );
};

export const getTokenEntanglementEscrows = async (
  mintA,
  mintB,
) => {
  return [
    ...(await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(TOKEN_ENTANGLER),
        mintA.toBuffer(),
        mintB.toBuffer(),
        Buffer.from(ESCROW),
        Buffer.from(A),
      ],
      TOKEN_ENTANGLEMENT_PROGRAM_ID,
    )),
    ...(await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(TOKEN_ENTANGLER),
        mintA.toBuffer(),
        mintB.toBuffer(),
        Buffer.from(ESCROW),
        Buffer.from(B),
      ],
      TOKEN_ENTANGLEMENT_PROGRAM_ID,
    )),
  ];
};

export function loadWalletKey(keypair) {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!');
  }
  const loaded = Keypair.fromSecretKey(
//    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),

		new Uint8Array(keypair),
  );
  console.log(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}


export async function loadCandyProgramV2(
  walletKeyPair,
  env,
  customRpcUrl,
) {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env),
  );

  const walletWrapper = new Wallet(walletKeyPair);
	console.log('wallet wrapper', walletWrapper)

  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });

	console.log(provider)
//	const solProvider = window.solana;
//	console.log(solProvider)

  const idl = await anchor.Program.fetchIdl(
    CANDY_MACHINE_PROGRAM_V2_ID,
    provider,
  );


  const program = new anchor.Program(
    idl,
    CANDY_MACHINE_PROGRAM_V2_ID,
    provider,
  );
  console.log('program id from anchor', program.programId.toBase58());
  return program;
}

export async function loadFairLaunchProgram(
  walletKeyPair,
  env,
  customRpcUrl,
) {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env),
  );
  const walletWrapper = {} // new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(FAIR_LAUNCH_PROGRAM_ID, provider);

  return new anchor.Program(idl, FAIR_LAUNCH_PROGRAM_ID, provider);
}

export async function loadAuctionHouseProgram(
  walletKeyPair,
  env,
  customRpcUrl,
) {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env),
  );
  const walletWrapper = {} // new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(AUCTION_HOUSE_PROGRAM_ID, provider);

  return new anchor.Program(idl, AUCTION_HOUSE_PROGRAM_ID, provider);
}

export async function loadTokenEntanglementProgream(
  walletKeyPair,
  env,
  customRpcUrl,
) {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);

  // @ts-ignore
  const solConnection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env),
  );
  const walletWrapper = {} // new anchor.Wallet(walletKeyPair);
  const provider = new anchor.Provider(solConnection, walletWrapper, {
    preflightCommitment: 'recent',
  });
  const idl = await anchor.Program.fetchIdl(
    TOKEN_ENTANGLEMENT_PROGRAM_ID,
    provider,
  );

  return new anchor.Program(idl, TOKEN_ENTANGLEMENT_PROGRAM_ID, provider);
}

export async function getTokenAmount(
  anchorProgram,
  account,
  mint,
) {
  let amount = 0;
  if (!mint.equals(WRAPPED_SOL_MINT)) {
    try {
      const token =
        await anchorProgram.provider.connection.getTokenAccountBalance(account);
      amount = token.value.uiAmount * Math.pow(10, token.value.decimals);
    } catch (e) {
      log.error(e);
      log.info(
        'Account ',
        account.toBase58(),
        'didnt return value. Assuming 0 tokens.',
      );
    }
  } else {
    amount = await anchorProgram.provider.connection.getBalance(account);
  }
  return amount;
}

export const getBalance = async (
  account,
  env,
  customRpcUrl,
) => {
  if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);
  const connection = new anchor.web3.Connection(
    //@ts-ignore
    customRpcUrl || getCluster(env),
  );
  return await connection.getBalance(account);
};

export async function getProgramAccounts(
  connection,
  programId,
  configOrCommitment,
) {
  const extra = {};
  let commitment;
  //let encoding;

  if (configOrCommitment) {
    if (typeof configOrCommitment === 'string') {
      commitment = configOrCommitment;
    } else {
      commitment = configOrCommitment.commitment;
      //encoding = configOrCommitment.encoding;

      if (configOrCommitment.dataSlice) {
        extra.dataSlice = configOrCommitment.dataSlice;
      }

      if (configOrCommitment.filters) {
        extra.filters = configOrCommitment.filters;
      }
    }
  }

  const args = connection._buildArgs([programId], commitment, 'base64', extra);
  const unsafeRes = await connection._rpcRequest(
    'getProgramAccounts',
    args,
  );

  return unsafeResAccounts(unsafeRes.result);
}

function unsafeAccount(account) {
  return {
    // TODO: possible delay parsing could be added here
    data: Buffer.from(account.data[0], 'base64'),
    executable: account.executable,
    lamports: account.lamports,
    // TODO: maybe we can do it in lazy way? or just use string
    owner: account.owner,
  };
}

function unsafeResAccounts(
  data,
) {
  return data.map(item => ({
    account: unsafeAccount(item.account),
    pubkey: item.pubkey,
  }));
}


// export const mintOneToken = async (
//   candyMachine: CandyMachineAccount,
//   payer: anchor.web3.PublicKey,
// ): Promise<(string | undefined)[]> => {
//   const mint = anchor.web3.Keypair.generate();

//   const userTokenAccountAddress = (
//     await getAtaForMint(mint.publicKey, payer)
//   )[0];

//   const userPayingAccountAddress = candyMachine.state.tokenMint
//     ? (await getAtaForMint(candyMachine.state.tokenMint, payer))[0]
//     : payer;

//   const candyMachineAddress = candyMachine.id;
//   const remainingAccounts = [];
//   const signers: anchor.web3.Keypair[] = [mint];
//   const cleanupInstructions = [];
//   const instructions = [
//     anchor.web3.SystemProgram.createAccount({
//       fromPubkey: payer,
//       newAccountPubkey: mint.publicKey,
//       space: MintLayout.span,
//       lamports:
//         await candyMachine.program.provider.connection.getMinimumBalanceForRentExemption(
//           MintLayout.span,
//         ),
//       programId: TOKEN_PROGRAM_ID,
//     }),
//     Token.createInitMintInstruction(
//       TOKEN_PROGRAM_ID,
//       mint.publicKey,
//       0,
//       payer,
//       payer,
//     ),
//     createAssociatedTokenAccountInstruction(
//       userTokenAccountAddress,
//       payer,
//       payer,
//       mint.publicKey,
//     ),
//     Token.createMintToInstruction(
//       TOKEN_PROGRAM_ID,
//       mint.publicKey,
//       userTokenAccountAddress,
//       payer,
//       [],
//       1,
//     ),
//   ];

//   if (candyMachine.state.gatekeeper) {
//     remainingAccounts.push({
//       pubkey: (
//         await getNetworkToken(
//           payer,
//           candyMachine.state.gatekeeper.gatekeeperNetwork,
//         )
//       )[0],
//       isWritable: true,
//       isSigner: false,
//     });
//     if (candyMachine.state.gatekeeper.expireOnUse) {
//       remainingAccounts.push({
//         pubkey: CIVIC,
//         isWritable: false,
//         isSigner: false,
//       });
//       remainingAccounts.push({
//         pubkey: (
//           await getNetworkExpire(
//             candyMachine.state.gatekeeper.gatekeeperNetwork,
//           )
//         )[0],
//         isWritable: false,
//         isSigner: false,
//       });
//     }
//   }
//   if (candyMachine.state.whitelistMintSettings) {
//     const mint = new anchor.web3.PublicKey(
//       candyMachine.state.whitelistMintSettings.mint,
//     );

//     const whitelistToken = (await getAtaForMint(mint, payer))[0];
//     remainingAccounts.push({
//       pubkey: whitelistToken,
//       isWritable: true,
//       isSigner: false,
//     });

//     if (candyMachine.state.whitelistMintSettings.mode.burnEveryTime) {
//       const whitelistBurnAuthority = anchor.web3.Keypair.generate();

//       remainingAccounts.push({
//         pubkey: mint,
//         isWritable: true,
//         isSigner: false,
//       });
//       remainingAccounts.push({
//         pubkey: whitelistBurnAuthority.publicKey,
//         isWritable: false,
//         isSigner: true,
//       });
//       signers.push(whitelistBurnAuthority);
//       const exists =
//         await candyMachine.program.provider.connection.getAccountInfo(
//           whitelistToken,
//         );
//       if (exists) {
//         instructions.push(
//           Token.createApproveInstruction(
//             TOKEN_PROGRAM_ID,
//             whitelistToken,
//             whitelistBurnAuthority.publicKey,
//             payer,
//             [],
//             1,
//           ),
//         );
//         cleanupInstructions.push(
//           Token.createRevokeInstruction(
//             TOKEN_PROGRAM_ID,
//             whitelistToken,
//             payer,
//             [],
//           ),
//         );
//       }
//     }
//   }

//   if (candyMachine.state.tokenMint) {
//     const transferAuthority = anchor.web3.Keypair.generate();

//     signers.push(transferAuthority);
//     remainingAccounts.push({
//       pubkey: userPayingAccountAddress,
//       isWritable: true,
//       isSigner: false,
//     });
//     remainingAccounts.push({
//       pubkey: transferAuthority.publicKey,
//       isWritable: false,
//       isSigner: true,
//     });

//     instructions.push(
//       Token.createApproveInstruction(
//         TOKEN_PROGRAM_ID,
//         userPayingAccountAddress,
//         transferAuthority.publicKey,
//         payer,
//         [],
//         candyMachine.state.price.toNumber(),
//       ),
//     );
//     cleanupInstructions.push(
//       Token.createRevokeInstruction(
//         TOKEN_PROGRAM_ID,
//         userPayingAccountAddress,
//         payer,
//         [],
//       ),
//     );
//   }
//   const metadataAddress = await getMetadata(mint.publicKey);
//   const masterEdition = await getMasterEdition(mint.publicKey);

//   const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
//     candyMachineAddress,
//   );

//   instructions.push(
//     await candyMachine.program.instruction.mintNft(creatorBump, {
//       accounts: {
//         candyMachine: candyMachineAddress,
//         candyMachineCreator,
//         payer: payer,
//         wallet: candyMachine.state.treasury,
//         mint: mint.publicKey,
//         metadata: metadataAddress,
//         masterEdition,
//         mintAuthority: payer,
//         updateAuthority: payer,
//         tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//         clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//         recentBlockhashes: anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY,
//         instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
//       },
//       remainingAccounts:
//         remainingAccounts.length > 0 ? remainingAccounts : undefined,
//     }),
//   );

//   try {
//     return (
//       await sendTransactions(
//         candyMachine.program.provider.connection,
//         candyMachine.program.provider.wallet,
//         [instructions, cleanupInstructions],
//         [signers, []],
//       )
//     ).txs.map(t => t.txid);
//   } catch (e) {
//     console.log(e);
//   }

//   return [];
// };
