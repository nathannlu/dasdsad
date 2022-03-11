import { PublicKey, Keypair, createAccount, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js';
import { sendTransactionWithRetryWithKeypair } from './transactions';
import { loadWalletKey, loadCandyProgramV2, getTokenWallet, getMetadata, getMasterEdition, getCandyMachineCreator } from './accounts';
import { MintLayout, Token } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';
import bs58 from 'bs58';
import { createAssociatedTokenAccountInstruction } from './instructions';
// import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';
const nacl = require('tweetnacl');

export async function mintV2(
    keypair,
    env,
    candyMachineAddress,
    rpcUrl,
  ) {
    keypair = Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]);
    console.log(keypair);
    candyMachineAddress = new PublicKey('5e9iDfrSMXuYJ5XdSgH9gUu56wNUrKupWwfgR7E27LAW');
    env = "devnet";
    const mint = Keypair.generate();
  
    const userKeyPair = loadWalletKey(keypair, env);
    const anchorProgram = await loadCandyProgramV2(userKeyPair, env, rpcUrl);
    const userTokenAccountAddress = await getTokenWallet(
      userKeyPair.publicKey,
      mint.publicKey,
    );

    const sol = await window.solana.connect();
    const payerPublicAddress = new PublicKey(sol.publicKey.toString().toBuffer());
  
    const candyMachine = await anchorProgram.account.candyMachine.fetch(
      candyMachineAddress,
    );
  
    let transferAuthority;
    let whitelistBurnAuthority;
    const remainingAccounts = [];
    const signers = [mint];
    const cleanupInstructions = [];
    const instructions = [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: userKeyPair.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports:
          await anchorProgram.provider.connection.getMinimumBalanceForRentExemption(
            MintLayout.span,
          ),
        programId: TOKEN_PROGRAM_ID,
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0,
        userKeyPair.publicKey,
        userKeyPair.publicKey,
      ),
      createAssociatedTokenAccountInstruction(
        userTokenAccountAddress,
        userKeyPair.publicKey,
        userKeyPair.publicKey,
        mint.publicKey,
      ),
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        userTokenAccountAddress,
        userKeyPair.publicKey,
        [],
        1,
      ),
    ];
  
    if (candyMachine.data.whitelistMintSettings) {
      const mint = new anchor.web3.PublicKey(
        candyMachine.data.whitelistMintSettings.mint,
      );
  
      const whitelistToken = (
        await getAtaForMint(mint, userKeyPair.publicKey)
      )[0];
      remainingAccounts.push({
        pubkey: whitelistToken,
        isWritable: true,
        isSigner: false,
      });
  
      if (candyMachine.data.whitelistMintSettings.mode.burnEveryTime) {
        whitelistBurnAuthority = anchor.web3.Keypair.generate();
  
        remainingAccounts.push({
          pubkey: mint,
          isWritable: true,
          isSigner: false,
        });
        remainingAccounts.push({
          pubkey: whitelistBurnAuthority.publicKey,
          isWritable: false,
          isSigner: true,
        });
        signers.push(whitelistBurnAuthority);
        const exists = await anchorProgram.provider.connection.getAccountInfo(
          whitelistToken,
        );
        if (exists) {
          instructions.push(
            Token.createApproveInstruction(
              TOKEN_PROGRAM_ID,
              whitelistToken,
              whitelistBurnAuthority.publicKey,
              userKeyPair.publicKey,
              [],
              1,
            ),
          );
          cleanupInstructions.push(
            Token.createRevokeInstruction(
              TOKEN_PROGRAM_ID,
              whitelistToken,
              userKeyPair.publicKey,
              [],
            ),
          );
        }
      }
    }
  
    let tokenAccount;
    if (candyMachine.tokenMint) {
      transferAuthority = anchor.web3.Keypair.generate();
  
      tokenAccount = await getTokenWallet(
        userKeyPair.publicKey,
        candyMachine.tokenMint,
      );
  
      remainingAccounts.push({
        pubkey: tokenAccount,
        isWritable: true,
        isSigner: false,
      });
      remainingAccounts.push({
        pubkey: transferAuthority.publicKey,
        isWritable: false,
        isSigner: true,
      });
  
      instructions.push(
        Token.createApproveInstruction(
          TOKEN_PROGRAM_ID,
          tokenAccount,
          transferAuthority.publicKey,
          userKeyPair.publicKey,
          [],
          candyMachine.data.price.toNumber(),
        ),
      );
      signers.push(transferAuthority);
      cleanupInstructions.push(
        Token.createRevokeInstruction(
          TOKEN_PROGRAM_ID,
          tokenAccount,
          userKeyPair.publicKey,
          [],
        ),
      );
    }
    const metadataAddress = await getMetadata(mint.publicKey);
    const masterEdition = await getMasterEdition(mint.publicKey);
  
    console.log(metadataAddress);
    console.log(masterEdition);
    
    const [candyMachineCreator, creatorBump] = await getCandyMachineCreator(
      candyMachineAddress,
    );
  
    instructions.push(
      await anchorProgram.instruction.mintNft(creatorBump, {
        accounts: {
          candyMachine: candyMachineAddress,
          candyMachineCreator,
          payer: userKeyPair.publicKey,
          //@ts-ignore
          wallet: candyMachine.wallet,
          mint: mint.publicKey,
          metadata: metadataAddress,
          masterEdition,
          mintAuthority: userKeyPair.publicKey,
          updateAuthority: userKeyPair.publicKey,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          recentBlockhashes: anchor.web3.SYSVAR_SLOT_HASHES_PUBKEY,
          instructionSysvarAccount: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        },
        remainingAccounts:
          remainingAccounts.length > 0 ? remainingAccounts : undefined,
      }),
    );
  
    // const finished = (
    //   await sendTransactionWithRetryWithKeypair(
    //     anchorProgram.provider.connection,
    //     userKeyPair,
    //     instructions,
    //     signers,
    //   )
    // ).txid;
  
    // await sendTransactionWithRetryWithKeypair(
    //   anchorProgram.provider.connection,
    //   userKeyPair,
    //   cleanupInstructions,
    //   [],
    // );

    console.log("minting");
    let recentBlockhash = await anchorProgram.provider.connection.getRecentBlockhash();
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: payerPublicAddress
    });

    for (let i = 0; i < instructions.length; i++) {
      transaction.add(instructions[i]);
    }

    let transactionBuffer = transaction.serializeMessage();

    const payerSignature = await window.solana.request({
      method: 'signTransaction',
      params: {
        message: bs58.encode(transactionBuffer)
      }
    })

    let mintSignature = nacl.sign.detached(transactionBuffer, mint.secretKey);

    transaction.addSignature(userKeyPair.publicKey, bs58.decode(payerSignature.signature));

    console.log(mintSignature, mint.publicKey);
    transaction.addSignature(mint.publicKey, mintSignature);


    console.log(userKeyPair.publicKey.toString());
    // if(transferAuthority){
      // const transferSignature = nacl.sign.detached(transactionBuffer, transferAuthority.secretKey);
      // transaction.addSignature(transferAuthority.publicKey, (transferSignature));
    // }

    // if(whitelistBurnAuthority){
      // const whiteListSignature = nacl.sign.detached(transactionBuffer, whitelistBurnAuthority.secretKey);
      // transaction.addSignature(whitelistBurnAuthority.publicKey, (whiteListSignature));
    // }
    

    let isVerifiedSignature = transaction.verifySignatures();
	  console.log(`The signatures were verifed: ${isVerifiedSignature}`)

    let rawTransaction = transaction.serialize();

    const asd = await sendAndConfirmRawTransaction(anchorProgram.provider.connection, rawTransaction);
	  console.log(asd)

    return 0;
  }
