import React, { useState, useEffect } from 'react';
import { Stack, Box, Container } from 'ds/components';
import { ContractController, getIpfsUrl, getResolvedImageUrl } from '@ambition-blockchain/controllers';

import { useParams } from 'react-router-dom';
// import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import ContractDetailTabs from './ContractDetailTabs';
import NotComplete from './NotComplete';
import { CircularProgress } from '@mui/material';

const ContractV2 = () => {
	const [contract, setContract] = useState(null);
	const [contractState, setContractState] = useState(null);
	const [contractController, setContractController] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // default
	const [nftImage, setNftImage] = useState({ src: null, isLoading: true }); // default
	const [nftPrice, setNftPrice] = useState({ currency: null, price: null });

	const { contracts } = useContract();
	const { id } = useParams();

	const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address;

	const fetchImageSrc = async (metadataUrl) => {
		try {
			const imageSrc = getResolvedImageUrl(metadataUrl);
			setNftImage(prevState => ({ ...prevState, src: imageSrc, isLoading: false }));
		} catch (e) {
			console.log('Error fetchImageSrc:', e);
			setNftImage(prevState => ({ ...prevState, src: null, isLoading: false }));
		}
	}

	const init = async () => {
		const contract = contracts.find((c) => c.id === id);
		if (contract) {

			if (contract?.nftCollection?.baseUri) {
				const ipfsUrl = getIpfsUrl(undefined, true);
				const baseUri = contract?.nftCollection?.baseUri.indexOf('ipfs://') !== -1 ? contract?.nftCollection?.baseUri.split('ipfs://') : null;
				const metadataUrl = baseUri && ipfsUrl && `${ipfsUrl}${baseUri[1]}` || contract?.nftCollection?.baseUri;

				fetchImageSrc(metadataUrl);
				setContract({ ...contract, nftCollection: { ...contract.nftCollection, metadataUrl } });
			} else {
				setContract(contract);
			}

			// Set single contract
			setNftPrice(prevState => ({ ...prevState, currency: contract?.nftCollection?.currency, price: contract?.nftCollection?.price }));
			setIsLoading(false);

			console.log(contract, 'contract');

			const contractController = new ContractController(contract.address, contract.blockchain, contract.type);
			setContractController(contractController);

			console.log(contractController, 'contractController');

			const contractState = await contractController.populateContractInfo();
			console.log(contractState, 'contractState');

			setContractState(contractState);
		}
	}

	useEffect(() => {
		if (contracts.length) { init(); }
	}, [contracts]);

	return (
		<Stack>
			<Container>

				{isLoading && <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
					<CircularProgress />
				</Stack>}

				{!isLoading && <Box
					sx={{
						background: 'white',
						zIndex: 10,
						top: '58px',
						width: '100%'
					}}>

					{!isSetupComplete ? (
						<NotComplete
							id={id}
							contractState={contractState}
							contract={contract}
							setIsModalOpen={setIsModalOpen}
						/>
					) : (
						<ContractDetailTabs
							id={id}
							contract={contract}
							contractState={contractState}
							setContractState={setContractState}
							contractController={contractController}
							nftImage={nftImage}
							nftPrice={nftPrice}
							setIsModalOpen={setIsModalOpen}
						/>
					)}
				</Box>}

				<IPFSModal
					id={id}
					contract={contract}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			</Container>

		</Stack>
	);
};

export default ContractV2;
