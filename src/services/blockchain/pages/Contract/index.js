import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { Fade, Container, Link, TextField, Stack, Box, Grid, Typography, Button, Divider } from 'ds/components';
import { useContractDetails } from './hooks/useContractDetails';
import IPFSModal from './IPFSModal';
import NotComplete from './NotComplete';
import Header from './Header';
import Tabs from './Tabs';

const Upload = (props) => {
	const [contract, setContract] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { id } = useParams();
	const { contracts } = useContract();
	const {
		compareNetwork,
        wallet,
        loadWalletProvider
	} = useWeb3();
	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address ? true : false;

	useEffect(() => {
        if (!contracts || !contracts.length) return;
        const getContract = async () => {
            try {
                const c = contracts.find(c => c.id == id);
                setContract(c);

                await loadWalletProvider(wallet);

                let chainId;
				if (c.blockchain === "ethereum") chainId = "0x1";
				else if (c.blockchain === "rinkeby") chainId = "0x4";
				else if (c.blockchain === "polygon") chainId = "0x89";
				else if (c.blockchain === "mumbai") chainId = "0x13881";

                if (wallet === 'metamask') {
                    await compareNetwork(chainId);
                }
            }
            catch (err) {
                console.error(err);
                addToast({
                    severity: 'error',
                    message: err.message
                })
                location.href = '/smart-contracts';
            }
        }
        getContract();
    }, [contracts])

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
