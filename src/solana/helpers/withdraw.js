import { PublicKey, Keypair } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
import { Program } from '@project-serum/anchor';


export async function withdrawV2(
  anchorProgram,
  keypair,
  env,
  candyAddress,
  lamports,
  charityAddress,
  charityPercent = 0,
) {
  // const signers = [keypair];
  const instructions = [
    anchorProgram.instruction.withdrawFunds({
      accounts: {
        candyMachine: candyAddress,
        authority: keypair.publicKey,
      },
    }),
  ];
  // if (!!charityAddress && charityPercent > 0) {
  //   const cpf = 100 / charityPercent;
  //   instructions.push(
  //     anchor.web3.SystemProgram.transfer({
  //       fromPubkey: keypair.publicKey,
  //       toPubkey: new PublicKey(charityAddress),
  //       lamports: Math.floor(lamports * cpf),
  //     }),
  //   );
  // }
  // return (
  //   await sendTransactionWithRetryWithKeypair(
  //     anchorProgram.provider.connection,
  //     keypair,
  //     instructions,
  //     signers,
  //   )
  // ).txid;

  let recentBlockhash = await anchorProgram.provider.connection.getRecentBlockhash();
	const transaction = new Transaction({
		recentBlockhash: recentBlockhash.blockhash,
    feePayer: payerPublicAddress
	})

  for (let i = 0; i < instructions.length; i++) {
    transaction.add(instructions[i]);
  }

  let transactionBuffer = transaction.serializeMessage();
	console.log(transactionBuffer);

  const withDrawSignature = await window.solana.request({
		method: 'signTransaction',
		params: {
			message: bs58.encode(transactionBuffer)
		}
	})

  transaction.addSignature(keypair.publicKey, withDrawSignature);

  let isVerifiedSignature = transaction.verifySignatures();
  console.log(`The signatures were verifed: ${isVerifiedSignature}`);


  let rawTransaction = transaction.serialize();

	const asd = await sendAndConfirmRawTransaction(anchorProgram.provider.connection, rawTransaction);
	console.log(asd)
}
