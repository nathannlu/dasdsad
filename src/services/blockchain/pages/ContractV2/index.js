import React, { useState, useEffect } from 'react';
import { Stack, Box, Container } from 'ds/components';
import { useWeb3 } from 'libs/web3';

import { useParams } from 'react-router-dom';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import ContractDetailTabs from './ContractDetailTabs';
import Newv2 from '../NewV2';
import { CircularProgress } from '@mui/material';

import { useContractv2 } from './hooks/useContractv2';

const ContractV2 = () => {
	const { walletController } = useWeb3();
	const { contracts } = useContract();
	const { id } = useParams();

	const {
		setContractState,
		setIsModalOpen,
		contract,
		contractState,
		contractController,
		isModalOpen,
		isLoading,
		unRevealedtNftImage,
		revealedNftImage,
		nftPrice
	} = useContractv2(contracts);

	const isSetupComplete = contract?.address;

	const ipfsModal = (
		<IPFSModal
			id={id}
			contract={contract}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			renderUploadUnRevealedImage={true}
		/>
	);

	if (isLoading) {
		return (
			<Stack>
				<Container>
					<Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
						<CircularProgress />
					</Stack>
				</Container>
			</Stack>
		);
	}

	return (
		<Stack>
			<Container>
				<Box
					sx={{
						background: 'white',
						zIndex: 10,
						top: '58px',
						width: '100%'
					}}>

					{!isSetupComplete ? (
						<React.Fragment>
							<Newv2 contract={contract} />
							{contract?.id && ipfsModal}
						</React.Fragment>
					) : (
						<React.Fragment>
							<ContractDetailTabs
								id={id}
								contract={contract}
								contractState={contractState}
								setContractState={setContractState}
								contractController={contractController}
								walletController={walletController}
								unRevealedtNftImage={unRevealedtNftImage}
								revealedNftImage={revealedNftImage}
								nftPrice={nftPrice}
								setIsModalOpen={setIsModalOpen}
							/>
							{contract?.id && ipfsModal}
						</React.Fragment>
					)}
				</Box>
			</Container>
		</Stack>
	);
};

export default ContractV2;
