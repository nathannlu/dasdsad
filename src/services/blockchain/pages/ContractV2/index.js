import React, { useState, useEffect } from 'react';
import { Stack, Box, Container } from 'ds/components';
import { ContractController, WalletController, getIpfsUrl, getResolvedImageUrl, getWalletType } from '@ambition-blockchain/controllers';

import { useParams } from 'react-router-dom';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import ContractDetailTabs from './ContractDetailTabs';
import Newv2 from '../NewV2';
import { CircularProgress } from '@mui/material';

const ContractV2 = () => {
	const [contract, setContract] = useState(null);
	const [contractState, setContractState] = useState(null);
	const [contractController, setContractController] = useState(null);
	const [walletController, setWalletController] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // default
	const [unRevealedtNftImage, setUnRevealedtNftImage] = useState({ src: null, isLoading: false });
	const [revealedNftImage, setRevealedNftImage] = useState({ src: null, isLoading: false });
	const [nftPrice, setNftPrice] = useState({ currency: null, price: null });

	const { contracts } = useContract();
	const { id } = useParams();

	const isSetupComplete = contract?.address;

	const fetchRevealedNftImage = async (metadataUrl) => {
		try {
			setRevealedNftImage(prevState => ({ ...prevState, isLoading: true }));
			const imageSrc = await getResolvedImageUrl(metadataUrl);
			setRevealedNftImage(prevState => ({ ...prevState, src: imageSrc, isLoading: false }));
		} catch (e) {
			console.log('Error fetchImageSrc:', e);
			setRevealedNftImage(prevState => ({ ...prevState, src: null, isLoading: false }));
		}
	}

	const init = async () => {
		const contract = contracts.find((c) => c.id === id);

		if (contract) {

			if (contract?.nftCollection?.unRevealedBaseUri) {
				setUnRevealedtNftImage(prevState => ({ ...prevState, src: contract?.nftCollection?.unRevealedBaseUri, isLoading: false }));
			}

			if (contract?.nftCollection?.baseUri) {
				const ipfsUrl = getIpfsUrl(undefined, true);
				const baseUri = contract?.nftCollection?.baseUri.indexOf('ipfs://') !== -1 ? contract?.nftCollection?.baseUri.split('ipfs://') : null;
				const metadataUrl = baseUri && ipfsUrl && `${ipfsUrl}${baseUri[1]}` || contract?.nftCollection?.baseUri;

				fetchRevealedNftImage(metadataUrl);
				setContract({ ...contract, nftCollection: { ...contract.nftCollection, metadataUrl } });
			} else {
				setContract(contract);
			}

			const walletController = new WalletController();
			walletController.loadWalletProvider(getWalletType(contract.blockchain));

			setWalletController(walletController);

			setNftPrice(prevState => ({ ...prevState, currency: contract?.nftCollection?.currency, price: contract?.nftCollection?.price }));
			setIsLoading(false);

			console.log(contract, 'contract');

			if (contract.address) {
				const contractController = new ContractController(contract.address, contract.blockchain, contract.type);
				setContractController(contractController);

				console.log(contractController, 'contractController');

				const contractState = await contractController.populateContractInfo();
				console.log(contractState, 'contractState');

				setContractState(contractState);
			}

		}
	}

	useEffect(() => {
		if (contracts.length) { init(); }
	}, [contracts]);

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
						<Newv2 contract={contract} />
					) : (
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
					)}
				</Box>

				{contract?.id && <IPFSModal
					id={id}
					contract={contract}
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
					renderUploadUnRevealedImage={true}
				/>}

			</Container>

		</Stack>
	);
};

export default ContractV2;
