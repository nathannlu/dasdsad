import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useDeploy } from 'libs/deploy';
import { useGetContracts } from 'gql/hooks/contract.hook';

const Upload = (props) => {
	const [balance, setBalance] = useState(null)
	const [soldCount, setSoldCount] = useState(null)
	const [contract, setContract] = useState({});
	const { id } = useParams();


	const { contracts } = useDeploy();
	const { 
		retrieveContract,
		loadWeb3,
		loadBlockchainData,
		withdraw,
		getBalance,
	} = useWeb3()

	useGetContracts()
	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])
	useEffect(() => {
		if(contracts.length > 0) {
			(async () => {
				const c = contracts.find(c => c.id == id)
				setContract(c)
				console.log(c)

				const b = await getBalance(c.address)
				setBalance(b);

				const nftsSold = c.nftCollection.price / b

				if(b == 0) {
					setSoldCount(0)
				} else {
					setSoldCount(nftsSold)
				}

			})()
		}
	},[contracts])


	return (
		<div>
			<div>
				Balance:
				{balance}
			</div>
			<div>
				NFTs sold:
				{soldCount}
			</div>
			<div>
				Contract address:
				{contract.address ? contract.address : null}
			</div>
			<div>
				Collection size:
				{contract?.nftCollection ? contract?.nftCollection?.size : null}
			</div>

			<button onClick={() => withdraw(contract.address)}>
				Withdraw
			</button>
		</div>
	)
};

export default Upload;
