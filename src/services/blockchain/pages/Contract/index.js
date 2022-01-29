import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useDeploy } from 'libs/deploy';
import { useGetContracts } from 'gql/hooks/contract.hook';
import { Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';

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
			<Stack gap={4}>

				<Stack direction="column" gap={2}>
					<Box>
						<img 
							style={{height: '40px'}}
							src="https://uploads-ssl.webflow.com/61a5732dd539a17ad13b60fb/61d2aac6943de77b8cf95ef1_deploy-to-blockchain-icon.png" 
						/>
					</Box>
					<Box>
						<Typography variant="h4">
							Dashboard for contract
						</Typography>
					</Box>
					<Box>
						<Typography variant="body">
							Your deployed smart-contract's address on the blockchain
						</Typography>

						<Box sx={{
							px:1,
							py:.5,
							bgcolor: 'grey.100', 
							fontWeight:'bold', 
							border: '0.5px solid rgba(0,0,0,.1)',
							borderRadius: 2,
						}}>
							{contract.address ? contract.address : 'asd'}
						</Box>
					</Box>
					<Box>
						<Link to="https://opensea.io/get-listed/step-two" target="_blank">
							Connect with OpenSea
						</Link>
					</Box>
				</Stack>
				<Divider />
				<Stack>
					<Typography variant="h6" sx={{fontWeight:'bold'}}>
						Details
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
				<Divider />
				<Stack gap={2}>
					<Typography variant="h6" sx={{fontWeight:'bold'}}>
						Interact
					</Typography>
					<Stack direction="row" gap={2}>
						<Button size="small" variant="contained" onClick={() => withdraw(contract.address)}>
							Pay out to bank
						</Button>
						<Button size="small" variant="contained" onClick={() => mintNow()}>
							Mint
						</Button>


					</Stack>
						<Stack direction="row">
							<TextField 
								size="small"
								placeholder="New metadata URL" 
								onChange={e => setNewMetadataUrl(e.target.value)}
							/>
							<Button size="small" variant="contained" onClick={() => {
								updateBaseUri(newMetadataUrl, contract.address)
							}}>
								Update Base URI
							</Button>
						</Stack>
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
