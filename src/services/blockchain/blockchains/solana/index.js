import bs58 from 'bs58';
import { createCandyMachineV2, loadCandyProgramV2 } from './helpers/accounts';
import { Keypair } from '@solana/web3.js'
import { BN, Program, web3 } from '@project-serum/anchor';


export const useSolana = () => {

	// Testing purpose only
	const payerWallet = Keypair.fromSecretKey(Uint8Array.from([250,198,88,219,95,186,86,42,141,139,158,202,48,60,49,34,120,169,71,222,72,218,184,243,52,128,63,244,245,30,61,29,0,73,114,112,87,75,67,11,212,182,193,17,29,222,23,63,5,89,155,72,191,85,51,105,87,89,155,55,11,21,29,75]))


  const generateSolanaKeypair = () => {
		return Keypair.generate();
	};


  const deploySolanaContract = async (payerWallet, creators) => {
		console.log('payer wallet:', payerWallet)
		const env = 'devnet';
		const totalNFTs = 100


		const anchorProgram = await loadCandyProgramV2(payerWallet, env);
		const res = await createCandyMachineV2(
			anchorProgram,
			payerWallet,		// Need this -- payer wallet
			payerWallet.publicKey,		// treasuryWallet
			null,		// splToken
			{
				itemsAvailable: new BN(totalNFTs),
				uuid: null,
				retainAuthority: true,
	//			symbol,
	//			sellerFeeBasisPoints, //: firstAssetManifest.seller_fee_basis_points,
	//			isMutable: mutable,
				maxSupply: new BN(0),
	//			gatekeeper,
	//			goLiveDate,
	//			price,
	//			endSettings,
	//			whitelistMintSettings,
	//			hiddenSettings,
				creators:[{address: "127xW67HTbXXzYvwzU4aZaz6vkY7cyPyycmsrLz5Q4cz", verified: true, share: 100}]
			},
		);
	}


	return {
		generateSolanaKeypair
	}
};
