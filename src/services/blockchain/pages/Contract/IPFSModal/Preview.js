import React from 'react';
import {
	Box,
	Grid,
	Stack,
	Typography,
	Button,
	CircularProgress,
} from 'ds/components';
import { Chip } from '@mui/material';
import posthog from 'posthog-js';
import { getNftStorageTypeLabel } from 'ambition-constants';
import { useSetNftStorageType } from 'services/blockchain/gql/hooks/contract.hook';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddLinkIcon from '@mui/icons-material/AddLink';

const Preview = (props) => {
	const [setNftStorageType, { loading }] = useSetNftStorageType({
		onCompleted: (data) => {
			posthog.capture('User selected nftStorageType as S3');
			props.setNftStorageType('s3');
			props.goToStep(4);
		},
		onError: (err) => {
			addToast({
				severity: 'error',
				message: `Error! selecting Ambition S3 Server for saving Nft's. Please create ticket on discord.`,
			});
		},
	});

	const onClickUpload = () => {
		posthog.capture('User selected upload to IPFS');
		props.setNftStorageType('ipfs');
		props.goToStep(3);
	};

	const onClickConnect = () => {
		posthog.capture('User selected upload to personal storage');
		props.goToStep(2);
	};

	return (
		<>
			<Box mb={2}>
				<Typography gutterBottom variant="h5">
					Connect NFT images & metadata
				</Typography>
				<Typography variant="body">
					You just finished configuring the collection details, now it
					is time to add in your images!
				</Typography>
			</Box>

			<Stack direction="row" gap={2}>
				<Box
					onClick={onClickUpload}
					sx={{
						p: 3,
						width: '100%',
						cursor: 'pointer',
						boxShadow: 'inset 0 0 0 1px #ddd',
						transition: '.2s all',
						'&:hover': {
							background: '#f5f5f5',
							boxShadow: 'none',
						},
						pointerEvents: loading ? 'none' : undefined,
					}}>
					<CloudUploadIcon />
					<Typography gutterBottom variant="h6">
						Upload your images now
					</Typography>
					<Typography variant="body2">
						Don't have an IPFS cid? Upload to our decentralized
						storage today!
					</Typography>
					<Stack direction="row" mt={2}>
						<Typography variant="h4">$19.99</Typography>
						<Typography variant="body">/mo</Typography>
					</Stack>
				</Box>
				{/*
				<Box
					onClick={onClickConnect}
					sx={{
						p: 3,
						width: '100%',
						cursor: 'pointer',
						boxShadow: 'inset 0 0 0 1px #ddd',
						transition: '.2s all',
						'&:hover': {
							background: '#f5f5f5',
							boxShadow: 'none',
						},
						pointerEvents: loading ? 'none' : undefined,
					}}>
					<AddLinkIcon />
					<Typography gutterBottom variant="h6">
						Connect to uploaded images
					</Typography>
					<Typography variant="body2">
						Already have your collection images and metadata
						uploaded? Just input your IPFS cid to connect your
						images.
					</Typography>
				</Box>
				*/}
			</Stack>

			{/*

        <Grid gap={2} container sx={{ minHeight: '500px' }}>
            <Grid
                sx={{
                    p: 3,
                    flex: 1,
                    cursor: 'pointer',
                    boxShadow: 'inset 0 0 0 1px #ddd',
                    transition: '.2s all',
                    '&:hover': {
                        background: '#f5f5f5',
                        boxShadow: 'none',
                    },
                    pointerEvents: loading ? 'none' : undefined
                }}
                item
                onClick={() => {
                    posthog.capture('User selected upload to IPFS');
                    props.setNftStorageType('ipfs');
                    props.goToStep(3);
                }}>
                <Stack justifyContent="space-between" sx={{ height: '100%' }}>
                    <Box>
                        <Stack gap={1} direction="row" alignItems="center">
                            <Chip color="success" label="Suggested solution" />

                            <Box>5 - 20 mins</Box>
                        </Stack>
                        <Typography gutterBottom variant="h5">
                            Upload your images on our IPFS node
                        </Typography>
                        <Typography variant="body">
                            Pin your images on our premium decentralized network
                            for high availability, reliable displays. Built for
                            NFTs.
                        </Typography>
                    </Box>
                    <Stack direction="row">
                        <Typography variant="h4">$19.99</Typography>
                        <Typography variant="body">/mo</Typography>
                    </Stack>
                    <Box>
                        <Button variant="contained" fullWidth disabled={loading}>
                            Next
                        </Button>
                    </Box>
                </Stack>
            </Grid>

            <Grid
                item
                onClick={() => {
                    posthog.capture('User selected upload to personal storage');
                    props.goToStep(2);
                }}
                sx={{
                    p: 3,
                    flex: 1,
                    cursor: 'pointer',
                    boxShadow: 'inset 0 0 0 1px #ddd',
                    transition: '.2s all',
                    color: 'rgba(0,0,0,.8)',
                    '&:hover': {
                        background: '#f5f5f5',
                        boxShadow: 'none',
                        color: 'rgba(0,0,0,1)',
                    },
                }}>
                <Stack justifyContent="space-between" sx={{ height: '100%' }}>
                    <Box>
                        <Box>30 mins - 1 hour</Box>
                        <Typography gutterBottom variant="h5">
                            Host your own images
                        </Typography>
                        <Typography variant="body">
                            Find a storage provider, upload your images, then
                            update metadata with images URL.
                        </Typography>
                    </Box>
                    <Box>
                        <Button fullWidth>Next</Button>
                    </Box>
                </Stack>
            </Grid>

        </Grid >
						*/}
		</>
	);
};

export default Preview;
