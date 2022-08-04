import React from 'react';
import { useParams } from 'react-router-dom';

import { Box, CircularProgress, Container, Fade, Stack } from 'ds/components';

import IPFSModal from '../Contract/IPFSModal';

import { useContractDetailsV2 } from './hooks/useContractDetailsV2';

import Actions from './widgets/Actions';
import ContractDetails from './widgets/ContractDetails';
import Header from './widgets/Header';
import Integrations from './widgets/Integrations';
import NotComplete from './NotComplete';

const ContractV2 = () => {
	const { id } = useParams();

	const {
		setIsIPFSModalOpen,
		isIPFSModalOpen,
		contract,
		isLoading,
		contractState,
		nftPrice,
		unRevealedtNftImage,
		revealedNftImage,
	} = useContractDetailsV2();

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

	const commonProps = {
		id,
		contract,
		contractState,
		unRevealedtNftImage,
		revealedNftImage,
		nftPrice,
		setIsIPFSModalOpen
	};

	const hasMetadataUploaded = !!contract?.nftCollection?.baseUri;
	const isContractDeployed = !!contract?.address;

	if (!isContractDeployed || !hasMetadataUploaded) {
		return (
			<Fade in={true}>
				<Container>
					<Box sx={{ minHeight: '100vh' }}>
						<NotComplete contract={contract} />
					</Box>
				</Container>
			</Fade>
		);
	}

	return (
		<Fade in={true}>
			<Container>
				<Box sx={{ minHeight: '100vh' }}>

					<Header {...commonProps} />
					<ContractDetails {...commonProps} />
					<Actions {...commonProps} />
					<Integrations {...commonProps} />

					<Stack gap={1} mt={4}></Stack>
				</Box>

				<IPFSModal
					id={id}
					contract={contract}
					isModalOpen={isIPFSModalOpen}
					setIsModalOpen={(isModalOpen) => setIsIPFSModalOpen(isModalOpen)}
					renderUploadUnRevealedImage={true}
				/>
			</Container>
		</Fade>
	);
};

export default ContractV2;
