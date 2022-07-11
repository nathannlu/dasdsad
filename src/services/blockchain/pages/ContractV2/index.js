import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box, CircularProgress, Container, Fade, Stack } from 'ds/components';

import IPFSModal from '../Contract/IPFSModal';

import { useToast } from 'ds/hooks/useToast';
import { useContractDetailsV2 } from './hooks/useContractDetailsV2';

import Actions from './widgets/Actions';
import ContractDetails from './widgets/ContractDetails';
import Header from './widgets/Header';
import Integrations from './widgets/Integrations';
import NotComplete from './NotComplete';

const ContractV2 = () => {
	const history = useHistory();
	const { id } = useParams();
	const { addToast } = useToast();

	const {
		setIsIPFSModalOpen,
		isIPFSModalOpen,
		contract,
		isLoading,
		hasBaseUri,
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
		contract,
		contractState,
		unRevealedtNftImage,
		revealedNftImage,
		nftPrice,
		setIsIPFSModalOpen
	};

	const isContractDeployed = !!contract?.address;
	if (!isContractDeployed) {
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
					setIsModalOpen={(isModalOpen, onSuccess) => {

						if (onSuccess) {
							setIsIPFSModalOpen(false);
							return;
						}

						if (!hasBaseUri) {
							history.push('/smart-contracts/');
							addToast({ severity: 'info', message: 'Please upload NFT collection to proceed!' });
							return;
						}
						setIsIPFSModalOpen(isModalOpen);
					}}
					renderUploadUnRevealedImage={true}
				/>
			</Container>
		</Fade>
	);
};

export default ContractV2;
