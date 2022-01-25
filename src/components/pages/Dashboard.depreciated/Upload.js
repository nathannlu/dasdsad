import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useDeploy } from 'libs/deploy';
import { useGetContracts } from 'gql/hooks/contract.hook';
import { Container, TextField, Stack, Box, Grid, Typography, Button } from 'ds/components';

const Upload = (props) => {
	const [balance, setBalance] = useState(null)
	const [owners, setOwners] = useState([]);
	const [soldCount, setSoldCount] = useState(null)
	const [contract, setContract] = useState({});
	const [price, setPrice] = useState();
	const { id } = useParams();

	const [newMetadataUrl, setNewMetadataUrl] = useState('');

	const { contracts } = useDeploy();
	const { 
		retrieveContract,
		loadWeb3,
		loadBlockchainData,
		withdraw,
		getBalance,
		mint,
		checkOwner,
		getTotalMinted,
		updateBaseUri,
		getBaseUri
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

				setPrice(c.nftCollection.price);

				
				const nftsSold = b / c.nftCollection.price

				if(b == 0) {
					setSoldCount(0)
				} else {
					setSoldCount(nftsSold)
				}

				let list = [];
				for (let i = 0; i < nftsSold; i++) {
					const o = await checkOwner(i, c.address)
					setOwners(prevState => {
						prevState.push(o)
						return [...prevState]
					})
				}
			})()
		}
	},[contracts])

	const mintNow = async () => {
		await mint(contract.nftCollection.price.toString(), contract.address)
	}

	return (
		<Container>
			<Stack gap={2}>
				<Stack>
					<Typography variant="h3">
						Dashboard for contract
					</Typography>
					<div>
						Contract address:
						{contract.address ? contract.address : null}
					</div>
				</Stack>

				<Stack>
					<Typography variant="h6">
						General information
					</Typography>
					<div>
						Balance:
						{balance}
					</div>
					<div>
						NFTs sold:
						{soldCount}
					</div>
					<div>
						Price per NFT:
						{price}ETH
					</div>

					<div>
						Collection size:
						{contract?.nftCollection ? contract?.nftCollection?.size : null}
					</div>
				</Stack>

				<Stack direction="row" gap={2}>
					<Button variant="contained" onClick={() => withdraw(contract.address)}>
						Withdraw
					</Button>
					<Button variant="contained" onClick={() => mintNow()}>
						Mint
					</Button>

				</Stack>
					
					<Stack>
						Set new metadata url
						<TextField onChange={e => setNewMetadataUrl(e.target.value)} />
						<Button variant="contained" onClick={() => {
							updateBaseUri(newMetadataUrl, contract.address)
						}}>
							Update Base URI
						</Button>
					</Stack>

				<Stack sx={{background: '#eee', borderRadius: 2, p:2}}>
					<Typography variant="h6">
						Addresses who own your NFT
					</Typography>
					<Box>
						{owners.map(addr => (
							<div key={addr}>
								{addr}
							</div>
						))}
					</Box>
				</Stack>
			</Stack>
		</Container>
	)
};

export default Upload;
