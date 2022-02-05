import React, { useState } from 'react';
import { Button } from 'ds/components';
import { createSolanaContract, generateSolanaKeypair } from 'solana';

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
