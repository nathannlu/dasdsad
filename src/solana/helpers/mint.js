import { PublicKey, Keypair, createAccount, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { sendTransactionWithRetryWithKeypair } from './transactions';
import { loadWalletKey, loadCandyProgramV2, getTokenWallet, getMetadata, getMasterEdition, getCandyMachineCreator } from './accounts';
import { MintLayout, Token } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';

import { createAssociatedTokenAccountInstruction } from './instructions';
// import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';

export async function mintV2(
    keypair,
    env,
    candyMachineAddress,
    rpcUrl,
  ) {
    keypair = Uint8Array.from([88,82,242,103,248,198,203,230,4,231,160,48,61,3,22,255,61,53,1,91,193,27,97,182,168,226,189,49,39,68,251,10,220,161,8,219,156,30,136,176,146,208,149,125,20,165,119,103,60,196,135,60,112,223,65,171,175,123,182,7,57,56,147,10]);
    console.log(keypair);
    candyMachineAddress = new PublicKey('5YCUZV8eTHoxgDDmwekGrdUyRPQd13zv9ALucEVjd2He');
    env = "devnet";
    const mint = Keypair.generate();
  
    const userKeyPair = loadWalletKey(keypair, env);
    const anchorProgram = await loadCandyProgramV2(userKeyPair, env, rpcUrl);
    const userTokenAccountAddress = await getTokenWallet(
      userKeyPair.publicKey,
      mint.publicKey,
    );
  
    const candyMachine = await anchorProgram.account.candyMachine.fetch(
      candyMachineAddress,
    );
  
    const remainingAccounts = [];
    const signers = [mint, userKeyPair];
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
        const whitelistBurnAuthority = anchor.web3.Keypair.generate();
  
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
      const transferAuthority = anchor.web3.Keypair.generate();
  
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
  
    const finished = (
      await sendTransactionWithRetryWithKeypair(
        anchorProgram.provider.connection,
        userKeyPair,
        instructions,
        signers,
      )
    ).txid;
  
    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      userKeyPair,
      cleanupInstructions,
      [],
    );
  
    return 0;
  }