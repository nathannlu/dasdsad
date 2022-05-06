import {
    Connection,
    Keypair,
    PublicKey,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    sendAndConfirmRawTransaction,
} from '@solana/web3.js';
import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
import { serialize } from 'borsh';
import jason from './devnet-testSpeed.json';
import { loadCandyProgramV2 } from './accounts';
import { getAccountsByCreatorAddress } from './signAll';
import bs58 from 'bs58';

import log from 'loglevel';
// import { sleep } from '../helpers/various';
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

export const updateCandyMachine = async (contractAddress, env = 'devnet', newSettings) => {
    const sol = await window.solana.connect();
    const payerPublicAddress = new PublicKey(
        sol.publicKey.toString().toBuffer()
    );

    // needs to be dynamic
    const anchorProgram = await loadCandyProgramV2(null, env);
    const candyMachineAddress = contractAddress;
    const candyMachine = new PublicKey(candyMachineAddress.toBuffer());
    const connection = anchorProgram.provider.connection;
    const candyMachineObj = await anchorProgram.account.candyMachine.fetch(
      candyMachineAddress,
    );



    // let ipfsHash = 'QmUBSH1Acnu2EMbx5NzUmHRmqKVEijVj3AZc4BGdFZWDZs';
    let remainingAccounts = [];
    // const payerWallet = new PublicKey(window.solana.publicKey.toString().toBuffer());

      console.log(candyMachineAddress, payerPublicAddress);

      console.log(newSettings);

    // const tx = await anchorProgram.rpc.updateCandyMachine(newSettings, {
    //   accounts: {
    //     candyMachine,
    //     authority: payerPublicAddress,
    //     wallet: payerPublicAddress,
    //   },
    //   remainingAccounts:
    //     remainingAccounts.length > 0 ? remainingAccounts : undefined,
    // });

    const r = 
    
        {
            txId : await anchorProgram.instruction.updateCandyMachine(
              newSettings, {
                accounts: {
                  candyMachine,
                  authority: payerPublicAddress,
                  wallet: payerPublicAddress,
                },
              remainingAccounts:
                remainingAccounts.length > 0 ? remainingAccounts : undefined,
            }
          )
        };

    

    console.log(r);

    let instructions = [
      // await createUpdateMetadataInstruction(
      //     candyMachine,
      //     payerPublicAddress,
      //     r.txId,
      // ),
      r.txId,
    ];

    // Sign transaction
    let recentBlockhash =
        await anchorProgram.provider.connection.getRecentBlockhash();
    const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: payerPublicAddress,
    });
    transaction.add(instructions[0]);


    console.log(transaction)
    // transaction.add(instructions[1]);

    let transactionBuffer = transaction.serializeMessage();

    const signature1 = await window.solana.request({
        method: 'signTransaction',
        params: {
            message: bs58.encode(transactionBuffer),
        },
    });

    transaction.addSignature(
        payerPublicAddress,
        bs58.decode(signature1.signature)
    );

    let isVerifiedSignature = transaction.verifySignatures();
    console.log(`The signatures were verifed: ${isVerifiedSignature}`);
    let rawTransaction = transaction.serialize();

    const asd = await sendAndConfirmRawTransaction(
        anchorProgram.provider.connection,
        rawTransaction
    );
    console.log(asd);

    //   const openSales = async (status = true) => {
    //     contract.methods
    //         .setOpen(status)
    //         .send(
    //             {
    //                 from: account,
    //                 value: 0,
    //             },
    //             (err) => (err ? onTxnError(err) : onTxnInfo())
    //         )
    //         .once('error', (err) => onTxnError(err))
    //         .once('confirmation', () => onTxnSuccess());
    // };


    /*
  const metadataByCandyMachine = await getAccountsByCreatorAddress(
    (await getCandyMachineCreator(new PublicKey(candyMachineAddress)))[0].toBase58(),
    connection,
  );

	console.log(metadataByCandyMachine);
	*/

    
};

   