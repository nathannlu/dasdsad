import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { Chip } from '@mui/material';
import { WarningAmber as WarningAmberIcon, SwapVert as SwapVertIcon, Payment as PaymentIcon, Upload as UploadIcon } from '@mui/icons-material';

import IPFSModal from './IPFSModal';
import NotComplete from './NotComplete';
//import Complete from './Action';
import Header from './Header';
import Tabs from './Tabs';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

import { useToast } from 'ds/hooks/useToast';

const Upload = (props) => {
	const [contract, setContract] = useState({});
	const { id } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { addToast } = useToast();

	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address ? true : false

	const { contracts } = useContract();
	const {
		loadWeb3,
		loadBlockchainData,
	} = useWeb3()

	useEffect(() => {
		(async () => {
			await loadWeb3();
			await loadBlockchainData();
		})()
	}, [])

	useEffect(() => {
		if(contracts.length > 0) {
			(async () => {
				const c = contracts.find(c => c.id == id)
				setContract(c)

				/*
                let chainId;
                if (c.blockchain === 'ethereum') chainId = '0x1'
                else if (c.blockchain === 'rinkeby') chainId = '0x4'
                else if (c.blockchain === 'polygon') chainId = '0x89'
                else if (c.blockchain === 'mumbai') chainId = '0x13881'
                setEmbedChainId(chainId);

                setEmbedCode(`<iframe
                src="https://${window.location.hostname.indexOf('localhost') === -1 ? window.location.hostname : `${window.location.hostname}:3000`}/smart-contracts/embed?contract=${c.address}&chainId=${chainId}"
                width="350px"
                height="100px"
                frameborder="0"
                scrolling="no"
            />`);

				setPrice(c.nftCollection.price);


				let list = [];
				for (let i = 0; i < nftsSold; i++) {
					const o = await checkOwner(i, c.address)
					setOwners(prevState => {
						prevState.push(o)
						return [...prevState]
					})
				}
				*/

			})()
		}
	},[contracts])

	return (
		<Fade in>
			<Stack>
				<Box>
					<img style={{height: '250px', width: '100%', objectFit: 'cover'}} src="https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/9019e/hero.webp" />
				</Box>
				<Container>
					<Stack sx={{minHeight: '100vh'}} py={2} gap={5}>
						<Header contract={contract} />

						{!isSetupComplete ? (
							<NotComplete 
								id={id}
								contract={contract} 
								setIsModalOpen={setIsModalOpen} 
							/>
						) : (
							<Tabs id={id} contract={contract} />
						)}
					</Stack>

					<IPFSModal id={id} contract={contract} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
				</Container>
			</Stack>
		</Fade>
	)
};

export default Upload;
