import React, { useState, useEffect } from 'react';
import { Stack, Box, Container } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';

import { ContractController, getWalletType } from '@ambition-blockchain/controllers';

import { useParams } from 'react-router-dom';
import { useContract } from 'services/blockchain/provider';

import IPFSModal from '../Contract/IPFSModal';

import ContractDetailTabs from './ContractDetailTabs';
import Newv2 from '../NewV2';
import { CircularProgress } from '@mui/material';
import { useIPFS } from 'services/blockchain/blockchains/hooks/useIPFS';
import { useS3 } from 'services/blockchain/blockchains/hooks/useS3';

const ContractV2 = () => {
	const { getResolvedImageUrlFromIpfsUri } = useIPFS();
	const { getResolvedImageUrlFromS3Uri } = useS3();
	const { walletController } = useWeb3();
	const { addToast } = useToast();

	const [contract, setContract] = useState(null);
	const [contractState, setContractState] = useState(null);
	const [contractController, setContractController] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // default

	const [unRevealedtNftImage, setUnRevealedtNftImage] = useState({ src: null, isLoading: true });
	const [revealedNftImage, setRevealedNftImage] = useState({ src: null, isLoading: true });

	const [nftPrice, setNftPrice] = useState({ currency: null, price: null });

	const { contracts } = useContract();
	const { id } = useParams();

	const isSetupComplete = contract?.address;

	/**
	 * @param {*} uri baseuri of revealed or unrevealed images
	 * @param {*} type revealed or unrevealed
	 */
	const fetchNftImageFromUri = async (uri, type) => {
		try {
			if (!uri) {
				throw new Error(`fetchNftImageFromUri: ipfs uri undefined for ${type} collection.`);
			}
			type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, isLoading: true })) : setUnRevealedtNftImage(prevState => ({ ...prevState, isLoading: true }));
			const src = contract?.nftStorageType === 's3' ? await getResolvedImageUrlFromS3Uri(uri) : await getResolvedImageUrlFromIpfsUri(uri);
			type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, src, isLoading: false })) : setUnRevealedtNftImage(prevState => ({ ...prevState, src, isLoading: false }));
		} catch (e) {
			console.log('Error fetchUnrevealedImageSrc:', e);
			type === 'revealed' ? setRevealedNftImage(prevState => ({ ...prevState, src: null, isLoading: false })) : setUnRevealedtNftImage(prevState => ({ ...prevState, src: null, isLoading: false }));
		}
	}

	const init = async () => {
		const contract = contracts.find((c) => c.id === id);
		if (!contract) {
			return;
		}

		setContract(contract);

		// fetch revealed image
		fetchNftImageFromUri(contract?.nftCollection?.baseUri, 'revealed');

		// fetch unrevealed image
		fetchNftImageFromUri(contract?.nftCollection?.unRevealedBaseUri, 'unrevealed');

		await walletController?.loadWalletProvider(getWalletType(contract.blockchain));
		await walletController?.compareNetwork(contract?.blockchain, async (error) => {
			if (error) {
				addToast({ severity: 'error', message: error.message });
				return;
			}
		});

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

	useEffect(() => {
		if (contracts.length) { init(); }
	}, [contracts]);

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
