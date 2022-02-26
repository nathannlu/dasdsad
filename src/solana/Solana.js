import React, { useState } from 'react';
import { Button } from 'ds/components';
import { createSolanaContract, generateSolanaKeypair, withDraw } from 'solana';
import { mintV2 } from 'solana/helpers/mint.js';


const Solana = () => {
	const [secretKey, setSecretKey] = useState('');
	const [publicKey, setPublicKey] = useState('');
	const keypair =''


	return (
		<div>
			<Button onClick={() => createSolanaContract()}>
				Solana
			</Button>
			<Button onClick={() => setSecretKey('['+generateSolanaKeypair().secretKey.toString() + ']')}>
				secret key
			</Button>
			<Button onClick={() => console.log(generateSolanaKeypair())}>
				public key
			</Button>

			<Button onClick={() => mintV2()}>
				mint
			</Button>
			
			<Button onClick={() => withDraw()}>
				withdraw
			</Button>

			<div>
			secret key:
			{secretKey}
			</div>

			<div>
			publick key: 
			{publicKey}
			</div>

		</div>
	)
};

export default Solana;
