import bs58 from 'bs58';
import { createCandyMachineV2, loadCandyProgramV2, getProgramAccounts } from './helpers/accounts';
import { withdrawV2 } from './helpers/withdraw';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { BN, Program, web3 } from '@project-serum/anchor';
// const BN = require('bn.js');

import {
	CANDY_MACHINE_PROGRAM_V2_ID
  } from './helpers/constants';

export const generateSolanaKeypair = () => {
	return Keypair.generate();	
};

export function parsePrice(price, mantissa = LAMPORTS_PER_SOL) {
	return Math.ceil(parseFloat(price) * mantissa);
}

export function parseDate(date) {
	if (date === 'now') {
	  return Date.now() / 1000;
	}
	return Date.parse(date) / 1000;
  }

export const createSolanaContract = async () => {
	const env = 'devnet';
	const totalNFTs = 100

	// const payerWallet = Keypair.fromSecretKey(Uint8Array.from([250,198,88,219,95,186,86,42,141,139,158,202,48,60,49,34,120,169,71,222,72,218,184,243,52,128,63,244,245,30,61,29,0,73,114,112,87,75,67,11,212,182,193,17,29,222,23,63,5,89,155,72,191,85,51,105,87,89,155,55,11,21,29,75]))
	const payerWallet = Keypair.fromSecretKey(Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]));


	console.log('payer wallet:', payerWallet)


	const price = '1';
	console.log(typeof price);
	console.log(price);
	console.log(BN.isBN(price));

	let parsedPrice = new BN(parsePrice(price));

	console.log(BN.isBN(parsedPrice));

	
	const goLiveDate = '25 Dec 2021 00:00:00 GMT';
	const anchorProgram = await loadCandyProgramV2(payerWallet, env);
	const res = await createCandyMachineV2(
		anchorProgram,
		payerWallet,		// Need this -- payer wallet
		payerWallet.publicKey,		// treasuryWallet
		null,		// splToken
		{
			itemsAvailable: new BN(totalNFTs),
			uuid: null,
			symbol: '',
			sellerFeeBasisPoints: null,
			isMutable: false,
			maxSupply: new BN(0),
			retainAuthority: false,
			gatekeeper: null,
			goLiveDate: new BN(parseDate(goLiveDate)),
			price:parsedPrice,
			endSettings: null,
			whitelistMintSettings: null,
			hiddenSettings: {
				name: "test10",
				uri: "https://ems5fiescduxnaamoeo3wc6pv67jyjlmwxfv5ion2zgtwmplcm6q.arweave.net/IyXSoJIQ6XaADHEduwvPr76cJWy1y16hzdZNOzHrEz0/",
				hash: new TextEncoder().encode("d2fed82ee0ea129d0575f5977be00c53d87ac6bf2c87d6ddb47477d99733d70d")

			  },
			// creators:[{address: "127xW67HTbXXzYvwzU4aZaz6vkY7cyPyycmsrLz5Q4cz", verified: true, share: 100}],
			creators:[{address: "FrF7aE45tLUjTcJ7aCvTSJqN9NBG9FGZWWhuHK7Hm8z5", verified: true, share: 100}],

		  },
		// );
// 		{
// 			itemsAvailable: new BN(totalNFTs),
// 			uuid: null,
// 			retainAuthority: true,
// //			symbol,
// //			sellerFeeBasisPoints, //: firstAssetManifest.seller_fee_basis_points,
// //			isMutable: mutable,
// 			maxSupply: new BN(0),
// //			gatekeeper,
// 			// goLiveDate:  "25 Dec 2021 00:00:00 GMT",
// //			price,
// //			endSettings,
// //			whitelistMintSettings,
// //			hiddenSettings,
// 			creators:[{address: "FrF7aE45tLUjTcJ7aCvTSJqN9NBG9FGZWWhuHK7Hm8z5", verified: true, share: 100}]
			
// 		},
);

	console.log(res)
}


export const withDraw = async () => {
	const env = 'devnet';
	const totalNFTs = 100

	// const payerWallet = Keypair.fromSecretKey(Uint8Array.from([250,198,88,219,95,186,86,42,141,139,158,202,48,60,49,34,120,169,71,222,72,218,184,243,52,128,63,244,245,30,61,29,0,73,114,112,87,75,67,11,212,182,193,17,29,222,23,63,5,89,155,72,191,85,51,105,87,89,155,55,11,21,29,75]))
	const payerWallet = Keypair.fromSecretKey(Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]));
	const candyMachineId = 'Afdz8SsPd57ZstmmLJNCYjNw2fvqUrYZcGJ9UYJ9HaWL';
	const charityPercent = 0;
	const charity = '';

	console.log('payer wallet:', payerWallet);

	const anchorProgram = await loadCandyProgramV2(payerWallet, env);
	const configOrCommitment = {
		commitment: 'confirmed',
		filters: [
		  {
			memcmp: {
			  offset: 8,
			  bytes: payerWallet.publicKey.toBase58(),
			},
		  },
		],
	};

	const machines = await getProgramAccounts(
	anchorProgram.provider.connection,
	CANDY_MACHINE_PROGRAM_V2_ID.toBase58(),
	configOrCommitment,
	);

	const currentMachine = machines?.find(machine => {
	return machine.pubkey === candyMachineId;
	});

	if (!currentMachine) {
	console.log(`Candy Machine ${candyMachineId} not found`);
	return;
	} else {
		console.log(`found candy machine ${candyMachineId}` );
	}

	const refundAmount = currentMachine.account.lamports / LAMPORTS_PER_SOL;
    const cpf = parseFloat(charityPercent);
    let charityPub;
    console.log(`Amount to be drained from ${candyMachineId}: ${refundAmount}`);
    if (!!charity && charityPercent > 0) {
      const donation = refundAmount * (100 / charityPercent);
      charityPub = new PublicKey(charity);
      console.log(
        `Of that ${refundAmount}, ${donation} will be donated to ${charity}. Thank you!`,
      );
    }

	
	const errors = [];
	console.log(
		`WARNING: This command will drain the SOL from Candy Machine ${candyMachineId}. This will break your Candy Machine if its still in use`,
	);
	try {
		if (currentMachine.account.lamports > 0) {
		const tx = await withdrawV2(
			anchorProgram,
			payerWallet,
			env,
			new PublicKey(candyMachineId),
			currentMachine.account.lamports,
			charityPub,
			cpf,
		);
		console.log(
			`${candyMachineId} has been withdrawn. \nTransaction Signature: ${tx}`,
		);
		}
	} catch (e) {
		console.log(`Withdraw has failed for ${candyMachineId}`, e.message);
		errors.push(e);
		return;
	}
	console.log(
		`Congratulations, ${candyMachineId} has been successfuly drained! Please consider support Open Source developers`,
	);
}
