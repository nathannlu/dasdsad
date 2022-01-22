import React, { useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useWebsite } from 'libs/website';

const Button = ({isMint, text, link}) => {
	const { loadWeb3, loadBlockchainData, account, mint } = useWeb3();
	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])

	const {website} = useWebsite();
	console.log(website)

	return isMint ? (
		<button onClick={() => mint(website.settings.connectedContractAddress)} class="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">{text}</button>
	) : (
		<button onClick={() => window.location.href = link} class="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">{text}</button>
	)
};

export default Button;
