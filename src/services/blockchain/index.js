import React from 'react';
import BlockchainProvider from './provider';

const BlockchainService = () => {

	return (
		<>
		<Helmet>
			<title>Create your NFT collection with no-code - NFT Art Generator</title>
			<link rel="canonical" href="https://app.nftdatagen.com" />
			<meta name="description" content="Generate thousands of digital arts online - The simplest way." />
		</Helmet>

		<BlockchainProvider>
			<Router 
				getUserConfirmation={(message, callback) => {
					const allowTransition = window.confirm(message);
					console.log(message)
					callback(allowTransition);	
				}}
				history={history}
			>
				<Routes />
			</Router>
		</BlockchainProvider>
		</>
	);
};


export default BlockchainService;
