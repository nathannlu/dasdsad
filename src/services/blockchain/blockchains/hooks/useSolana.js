import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, Connection, sendAndConfirmTransaction } from '@solana/web3.js';
import { createCandyMachineV2, loadCandyProgramV2 } from '../solana/helpers/accounts';
import {
  CANDY_MACHINE_PROGRAM_ID,
  CONFIG_ARRAY_START,
  CONFIG_LINE_SIZE,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  CONFIG_ARRAY_START_V2,
  CANDY_MACHINE_PROGRAM_V2_ID,
  CONFIG_LINE_SIZE_V2,
} from '../solana/helpers/constants';
import { BN, Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';

export function parsePrice(price, mantissa = LAMPORTS_PER_SOL) {
	return Math.ceil(parseFloat(price) * mantissa);
}

export function parseDate(date) {
	if (date === 'now') {
	  return Date.now() / 1000;
	}
	return Date.parse(date) / 1000;
  }




export const useSolana = () => {
//	const { connection } = useConnection();
//	const { publicKey, sendTransaction } = useWallet();


	const deploySolanaContract = async () => {
		const connection = new Connection(
			"https://api.devnet.solana.com",
			'confirmed',
		);

		// constants 
		const from = Keypair.fromSecretKey(Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]))
		

		const candyAccount = Keypair.generate();
		const goLiveDate = '25 Dec 2021 00:00:00 GMT';
		const env = 'devnet';
		const totalNFTs = 100;
		const anchorProgram = await loadCandyProgramV2(from, 'devnet');
		const remainingAccounts = [];
		const splToken = null;
		if (splToken) {
			remainingAccounts.push({
				pubkey: splToken,
				isSigner: false,
				isWritable: false,
			});
		}
		const price = '1';
		let parsedPrice = new BN(parsePrice(price));

		/*
		// airdrop
		const airdropSignature = await connection.requestAirdrop(
			from.publicKey,
			LAMPORTS_PER_SOL, // 10000000 Lamports in 1 SOL
		);
		await connection.confirmTransaction(airdropSignature);
		*/


		const candyData =	{
			itemsAvailable: new BN(totalNFTs),
			uuid: null,
			symbol: '',
			sellerFeeBasisPoints: null,
			isMutable: false,
			maxSupply: new BN(0),
			retainAuthority: false,
			gatekeeper: null,
			goLiveDate: new BN(parseDate(goLiveDate)),
			price: parsedPrice,
			endSettings: null,
			whitelistMintSettings: null,
			hiddenSettings: null,
			// creators:[{address: "127xW67HTbXXzYvwzU4aZaz6vkY7cyPyycmsrLz5Q4cz", verified: true, share: 100}],
			creators:[{address: "FrF7aE45tLUjTcJ7aCvTSJqN9NBG9FGZWWhuHK7Hm8z5", verified: true, share: 100}],
		}
		const size =
			CONFIG_ARRAY_START_V2 +
			4 +
			candyData.itemsAvailable.toNumber() * CONFIG_LINE_SIZE_V2 +
			8 +
			2 * (Math.floor(candyData.itemsAvailable.toNumber() / 8) + 1);


		const instructions = [
			SystemProgram.createAccount({
				fromPubkey: from.publicKey,
				newAccountPubkey: candyAccount.publicKey,
				space: size,
				lamports:
					await connection.getMinimumBalanceForRentExemption(size),
				programId: CANDY_MACHINE_PROGRAM_V2_ID,
			}),

			await anchorProgram.instruction.initializeCandyMachine(candyData, {
				accounts: {
					candyMachine: candyAccount.publicKey,
					wallet: from.publicKey,
					authority: from.publicKey,
					payer: from.publicKey,
					systemProgram: SystemProgram.programId,
					rent: anchor.web3.SYSVAR_RENT_PUBKEY,
				},
				remainingAccounts: remainingAccounts.length > 0 ? remainingAccounts : undefined,
			})
		]



		const transaction = new Transaction().add(instructions[0]);
		transaction.add(instructions[1])

		console.log('tx',transaction)

		// Sign transaction, broadcast, and confirm
		const signature = await sendAndConfirmTransaction(
			connection,
			transaction,
			[from, candyAccount],
		);

		console.log('SIGNATURE', signature);
//		console.log(publicKey);
	}

	return { 
		deploySolanaContract
	}
}
