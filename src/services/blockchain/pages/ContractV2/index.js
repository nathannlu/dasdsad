import React from 'react';
import {
	Fade,
	Container,
	Button,
	Divider,
	Typography,
	Stack,
	Grid,
	Box,
	Link,
} from 'ds/components';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useParams } from 'react-router-dom';
import StepWizard from "react-step-wizard";
import UploadToIPFS from '../Contract/IPFSModal/Raw';
import { useContract } from 'services/blockchain/provider';
import ContractDetailTabs from './ContractDetailTabs';
import CSVWidget from '../../widgets/CSVWidget';
import Embed from '../Contract/Embed';
import Verify from './Verify';

import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import SmartButtonIcon from '@mui/icons-material/SmartButton';



import { useModal } from 'ds/hooks/useModal';

const ContractV2 = () => {
	const { id } = useParams();
	const { contract } = useContract();

	const hasBaseUri = true; // contract?.nftCollection?.baseUri ? true : false

	return (
		<Fade in>
			<Container>
				{!hasBaseUri ? (
					<UploadToIPFS
						id={id}
						contract={contract}
						isModalOpen={true}
						setIsModalOpen={() => {}}
						renderUploadUnRevealedImage={true}
					/>
				) : (
					<Dashboard contract={contract} />
				)}
			</Container>
		</Fade>
	);
};

const AdvancedSettings = <div>asd</div>;

const DeployToMainnetModal = (
	<div>
			<StepWizard>
			<TestTest />
				{/*
			<DeployToMainnetPreview />
			<TransactionModal />
			*/}
		</StepWizard>
		asd
	</div>
);

const TestTest = () =>  {
	<div>
		asd
	</div>
};

const DeployToMainnetPreview = () => {
	return (
		<Stack>
		<Grid container>
			<Grid xs={5} item>
				<Stack p={4} gap={2}>
					<Box>
						<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
							Deploy to Ethereum mainnet
						</Typography>
						<Typography variant="body">
							Here is a quick recap. You can change the name, symbol, and collection size later only by re-creating the contract.
						</Typography>
					</Box>

					<Grid container>
						<Grid xs={4} item>
							<Stack gap={0.5} sx={{ color: '#6a7383' }}>
								<Typography>Name</Typography>
								<Typography>Symbol:</Typography>
								<Typography>Collection size:</Typography>

								<Typography>Cost:</Typography>
								<Typography>Max per mint:</Typography>
								<Typography>Max per wallet:</Typography>
								<Typography>Deployer address:</Typography>
							</Stack>
						</Grid>

						<Grid xs={6} item>
							<Stack gap={0.5} sx={{ color: '#404452' }}>
								<Typography>Headspace Hunters</Typography>
								<Typography>HEAD</Typography>
								<Typography>100</Typography>
								<Typography>0.05ETH</Typography>
								<Typography>5</Typography>
								<Typography>5</Typography>
							</Stack>
						</Grid>
					</Grid>

					<Box>
						<Button variant="contained" size="small">
							Deploy
						</Button>
					</Box>
				</Stack>
			</Grid>
			<Grid
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
				xs={7}
				item>
				<Stack gap={2} direction="row">
					<Box
						sx={{
							boxShadow:
								'0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%), 0 3px 12px rgb(0 0 0 / 8%)',
							height: '250px',
							width: '250px',
							borderRadius: '5px',
						}}>
						Unrevealed
					</Box>
					<Box
						sx={{
							boxShadow:
								'0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%), 0 3px 12px rgb(0 0 0 / 8%)',
							height: '250px',
							width: '250px',
							borderRadius: '5px',
						}}>
						Revealed
					</Box>
				</Stack>
			</Grid>
		</Grid>
	</Stack>
)
};

const Details = () => {
	const { createModal } = useModal();
	const [, setIsSettingsModalOpen] = createModal(AdvancedSettings);

	return (
		<Grid mt={4} container>
			<Grid xs={7} item>
				<Stack gap={1}>
					<Typography variant="h6">Details</Typography>
					<Divider />
					<Grid container>
						<Grid xs={4} item>
							<Stack gap={0.5} sx={{ color: '#6a7383' }}>
								<Typography>Blockchain</Typography>
								<Typography>Sales status:</Typography>
								<Typography>Collection size:</Typography>
								<Typography>NFTs sold:</Typography>
								<Typography>Earnings:</Typography>
							</Stack>
						</Grid>

						<Grid xs={4} item>
							<Stack gap={0.5} sx={{ color: '#404452' }}>
								<Typography>Testnet (Rinkeby)</Typography>
								<Typography>Whitelist only</Typography>
								<Typography>100</Typography>
								<Typography>100</Typography>
								<Typography>0.05ETH</Typography>
							</Stack>
						</Grid>
					</Grid>
					<Stack mt={2} gap={0.5}>
						<Link onClick={() => setIsSettingsModalOpen(true)}>
							View advanced settings
						</Link>
					</Stack>
				</Stack>
			</Grid>

			<Grid xs={4} sx={{ ml: 'auto' }} item>
				<Stack gap={4}>
					<Stack direction="row">
						<Typography variant="h6">Preview</Typography>

						<Box sx={{ ml: 'auto' }}>
							<Button size="small" variant="outlined">
								Reveal NFT
							</Button>
						</Box>
					</Stack>

					<NFTRender />
				</Stack>
			</Grid>
		</Grid>
	);
};

const NFTRender = () => {
	return (
		<Box
			sx={{
				boxShadow:
					'0 20px 44px rgb(50 50 93 / 12%), 0 -1px 32px rgb(50 50 93 / 6%), 0 3px 12px rgb(0 0 0 / 8%)',
				height: '400px',
				width: '400px',
				borderRadius: '5px',
			}}></Box>
	);
};

const Dashboard = (contract) => {
	return (
		<Box sx={{ minHeight: '100vh' }}>
			<Header />
			<Details />
			<Actions />
			<Integrations />

			<Stack gap={1} mt={4}></Stack>
		</Box>
	);
};

const Header = () => {
	const { createModal } = useModal();
	const [, setIsDeployModalOpen] = createModal(DeployToMainnetModal);
	return (
		<Stack direction="row" mt={4}>
			<Stack gap={1}>
				<Typography variant="body" sx={{ fontWeight: 'bold' }}>
					Contract dashboard
				</Typography>
				<Typography variant="h4">Headspace Hunters</Typography>
				<Typography variant="body">
					Copy and share to start accepting payments with this link.
				</Typography>

				<Stack gap={1} mt={2} direction="row">
					<Box
						sx={{
							background: '#f6f8fa',
							boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
							borderRadius: '5px',
							px: 1,
							fontWeight: 'bold',
						}}>
						0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166
					</Box>
					<Box>
						<Button variant="outlined" size="small">
							Copy
						</Button>
					</Box>
				</Stack>
			</Stack>
			<Box sx={{ ml: 'auto' }}>
				<Button
					size="small"
					onClick={() => setIsDeployModalOpen(true)}
					variant="contained">
					Deploy to mainnet
				</Button>
			</Box>
		</Stack>
	);
};



const AirdropModal = () => {
	const airdropAddresses = [];

	return (
		<CSVWidget
			addresses={airdropAddresses}
			onSave={addresses => {
				setAirdropAddresses(addresses.map(({ address, count }) => ({ address, count })));
				toggleAirdropDialog(false);
			}}
		/>
	)
};

const WhitelistModal = () => {
	const whitelistAddresses = [];


	return (
		<CSVWidget
			count={1}
			addresses={whitelistAddresses.map(a => ({ address: a }))}
			onSave={addresses => {
				console.log(addresses);
//				setWhitelistAddresses(addresses.map(({ address }) => address));
//				toggleWhitelistAddressDialog(false);
			}}
		/>
	)
};


const MintData = () => {
	const whitelistAddresses = [];
	
	
	return (
		<Box>
			asd
		</Box>
	)
};

const TransactionModal = () => {
	const transactions = [1,1,1,1]

	return ( 
		<Box>
			<Typography variant="h6">
				Deploying to Rinkeby
			</Typography>
			<Stepper orientation="vertical" activeStep={1}>
				{transactions.map(txn => (
					<Step>
						<StepLabel
              optional={
                  <Typography variant="caption">Open MetaMask and sign the transaction.</Typography>
              }
            >
							Awaiting signature
            </StepLabel>
					</Step>
				))}
			</Stepper>
		</Box>
	)
};

const Actions = () => {
	const { createModal } = useModal();
//	const [, setIsMintModalOpen] = createModal(MintData);

	const listOfActions = [
		{
			icon: <CreditScoreIcon />,
			title: 'Mint an NFT',
			description: 'Mint an NFT from your collection',
			modal: TransactionModal,
		},
		{
			icon: <AccountBalanceWalletIcon />,
			title: 'Withdraw your funds',
			description: 'Send the funds from your sale to your wallet.',
			modal: MintData,
		},
		{
			icon: <FormatListNumberedIcon />,
			title: 'Create a new presale list',
			description:
				'Upload list of wallets to set up early minting via merkle proofs',
			modal: WhitelistModal,
		},
		{
			icon: <SystemUpdateAltIcon />,
			title: 'Airdrop your NFT',
			description:
				'Used to reward users with a free NFT. Use this function to send NFTs to your community.',
			modal: AirdropModal,
		},
	];

	return (
		<Stack gap={1} mt={4}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h6">Actions</Typography>
			</Stack>
			<Divider />

			<Grid container>
				{listOfActions.map((action, i) => {
					const [, setIsModalOpen] = createModal(action.modal, { width: '500px' });

					return (
					<Grid key={i} item xs={4}>
						<Stack
							onClick={() => setIsModalOpen(true)}
							gap={1}
							p={2.5}
							mr={1}
							mb={1}
							sx={{
								height: '160px',
								border: '1px solid rgba(0,0,0,.15)',
								borderRadius: '5px',
								transition: 'all .2s',
								cursor: 'pointer',
								'&:hover': {
									boxShadow: '0 0 8px rgba(0,0,0,.15)',
								},
							}}>
							<Stack alignItems="center" gap={1} direction="row">
								{action.icon}
								<Typography
									variant="body"
									sx={{
										color: '#404452',
										fontSize: '18px',
									}}>
									{action.title}
								</Typography>
							</Stack>
							<Typography
								variant="body"
								sx={{ color: '#6a7383', fontSize: '14px' }}>
								{action.description}
							</Typography>
						</Stack>
					</Grid>
				)})}
			</Grid>
		</Stack>
	);
};

const EmbedModal = () => {
	const contract = {
		blockchain: 'ethereum'
	}
	return (
		<Embed id={""} contract={contract} />
	)
};

const VerifyModal = () => {
	const contract = {
		blockchain: 'ethereum'
	}
	return (
		<Verify contract={contract} />
	)
};

const Integrations  = () => {
	const { createModal } = useModal();

	const listOfIntegrations = [
		{
			icon: <SmartButtonIcon />,
			title: 'Embed a mint button',
			description: 'Add a mint button to your website on Webflow, Squarespace, or WordPress',
			modal: EmbedModal,
		},
		{
			icon: <img style={{height: '25px'}} src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png" />,
			title: 'Verify on Etherscan',
			description:
				'Set a list of users that can mint your NFT during pre-sale phase.',
			modal: VerifyModal,
		},
	];

	return (
		<Stack gap={1} mt={4}>
			<Stack direction="row" justifyContent="space-between">
				<Typography variant="h6">Integrations</Typography>
			</Stack>
			<Divider />

			<Grid container>
				{listOfIntegrations.map((action, i) => {
					const [, setIsModalOpen] = createModal(action.modal);

						return (
					<Grid key={i} item xs={4}>
						<Stack
							onClick={() => setIsModalOpen(true)}
							gap={1}
							p={2.5}
							mr={1}
							mb={1}
							sx={{
								height: '160px',
								border: '1px solid rgba(0,0,0,.15)',
								borderRadius: '5px',
								transition: 'all .2s',
								cursor: 'pointer',
								'&:hover': {
									boxShadow: '0 0 8px rgba(0,0,0,.15)',
								},
							}}>
							<Stack alignItems="center" gap={1} direction="row">
								{action.icon}
								<Typography
									variant="body"
									sx={{
										color: '#404452',
										fontSize: '18px',
									}}>
									{action.title}
								</Typography>
							</Stack>
							<Typography
								variant="body"
								sx={{ color: '#6a7383', fontSize: '14px' }}>
								{action.description}
							</Typography>
						</Stack>
					</Grid>
				)})}
					<Grid item xs={4}>
						<Stack
							onClick={() => window.open("https://opensea.io/get-listed/step-two", '_blank').focus()}
							gap={1}
							p={2.5}
							mr={1}
							mb={1}
							sx={{
								height: '160px',
								border: '1px solid rgba(0,0,0,.15)',
								borderRadius: '5px',
								transition: 'all .2s',
								cursor: 'pointer',
								'&:hover': {
									boxShadow: '0 0 8px rgba(0,0,0,.15)',
								},
							}}>
							<Stack alignItems="center" gap={1} direction="row">
								<img style={{height: '25px'}} src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png" />
								<Typography
									variant="body"
									sx={{
										color: '#404452',
										fontSize: '18px',
									}}>
									Connect with OpenSea
								</Typography>
							</Stack>
							<Typography
								variant="body"
								sx={{ color: '#6a7383', fontSize: '14px' }}>
								Import your collection onto Opensea. You must have at least one NFT minted before you can integrate.
							</Typography>
						</Stack>
					</Grid>
			</Grid>
		</Stack>
	);
};


export default ContractV2;
