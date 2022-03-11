import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
import { serialize } from 'borsh';

import log from 'loglevel';
import { sleep } from '../helpers/various';
import { delay, getAccountsByCreatorAddress } from './signAll';
import { createUpdateMetadataInstruction } from '../helpers/instructions';
import {
  Creator,
  Data,
  METADATA_SCHEMA,
  UpdateMetadataArgs,
} from '../helpers/schema';
import {
  getCandyMachineCreator,
  deriveCandyMachineV2ProgramAddress,
} from '../helpers/accounts';


export async function updateMetadataFromCache(
  candyMachineAddress,
  connection,
  wallet,
  batchSize,
  cacheContent,
  newCacheContent,
) {
  const [candyMachineAddr] = await deriveCandyMachineV2ProgramAddress(
    new PublicKey(candyMachineAddress),
  );
  candyMachineAddress = candyMachineAddr.toBase58();
  const metadataByCandyMachine = await getAccountsByCreatorAddress(
    (
      await getCandyMachineCreator(new PublicKey(candyMachineAddress))
    )[0].toBase58(),
    connection,
  );

  const differences = {};
  for (let i = 0; i < Object.keys(cacheContent.items).length; i++) {
      differences[cacheContent.items[i.toString()].link] = newCacheContent.items[i.toString()].link;
		/*
    if (
      cacheContent.items[i.toString()].link !=
      newCacheContent.items[i.toString()].link
    ) {
    }
		*/
  }

  const toUpdate = metadataByCandyMachine.filter(
    m => !!differences[m[0].data.uri],
  );

  console.log('Found', toUpdate.length, 'uris to update');
  let total = 0;

  while (toUpdate.length > 0) {
    log.debug('Signing metadata ');
    let sliceAmount = batchSize;
    if (toUpdate.length < batchSize) {
      sliceAmount = toUpdate.length;
    }
    const removed = toUpdate.splice(0, sliceAmount);
    total += sliceAmount;
    await delay(500);

		// This function here
    await updateMetadataBatch(removed, connection, differences);

    console.log(`Processed ${total} nfts`);
  }
  console.log(`Finished signing metadata for ${total} NFTs`);
}


async function updateMetadataBatch(
  metadataList,
  connection,
  differences,
) {
	const sol = await window.solana.connect();
	const payerPublicAddress = new PublicKey(sol.publicKey.toString().toBuffer());

  const instructions = metadataList.map(meta => {
    const newData = new Data({
      ...meta[0].data,
      creators: meta[0].data.creators.map(
        c =>
          new Creator({ ...c, address: new PublicKey(c.address).toBase58() }),
      ),
      uri: differences[meta[0].data.uri],
    });

    const value = new UpdateMetadataArgs({
      data: newData,
      updateAuthority: payerPublicAddress.toBase58(),
      primarySaleHappened: null,
    });
    const txnData = Buffer.from(serialize(METADATA_SCHEMA, value));
    return createUpdateMetadataInstruction(
      new PublicKey(meta[1]),
      payerPublicAddress,
      txnData,
    );
  });


	
	let recentBlockhash = await anchorProgram.provider.connection.getRecentBlockhash();
	const transaction = new Transaction({
		recentBlockhash: recentBlockhash.blockhash,
		feePayer: payerPublicAddress
	});

	for (let i = 0; i < instructions.length; i++) {
		transaction.add(instructions[i]);
	}

	let transactionBuffer = transaction.serializeMessage();

	// Payer signature
	const payerSignature = await window.solana.request({
		method: 'signTransaction',
		params: {
			message: bs58.encode(transactionBuffer)
		}
	})
	transaction.addSignature(userKeyPair.publicKey, bs58.decode(payerSignature.signature));


	// Verify signature
	let isVerifiedSignature = transaction.verifySignatures();
	console.log(`The signatures were verifed: ${isVerifiedSignature}`)

	let rawTransaction = transaction.serialize();
	const asd = await sendAndConfirmRawTransaction(anchorProgram.provider.connection, rawTransaction);
	console.log(asd)
}
