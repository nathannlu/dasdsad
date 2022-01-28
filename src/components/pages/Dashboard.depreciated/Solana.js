import React, { useState } from 'react';
import { createSolanaContract, generateSolanaKeypair } from 'solana';

const Solana = () => {
	const [secretKey, setSecretKey] = useState('');
	const keypair =''


	return (
		<div>
			<button onClick={() => createSolanaContract()}>
				Solana
			</button>
			<button onClick={() => setSecretKey('['+generateSolanaKeypair().secretKey.toString()) + ']'}>
				Generate
			</button>
			
			{secretKey}

		</div>
	)
};

export default Solana;
