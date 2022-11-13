import React, { useState, useEffect } from 'react';
import {
    Container,
    Divider,
    Button,
    IconButton,
    Stack,
    Card,
    Typography,
    FormLabel,
    TextField,
    Box,
    Grid,
    Fade,
    MenuItem,
    LoadingButton,
} from 'ds/components';
import { AppBar, Toolbar } from '@mui/material';
import { useCreateWebsite } from 'services/website/gql/hooks/website.hook';
import { useContract } from 'services/blockchain/provider';
import { useWebsite } from 'services/website/provider';
import { useGetContracts } from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useAnalytics } from 'libs/analytics';

const templates = [
	{ title: 'Blank', value: 'BLANK' },
	{ title: 'BAYC', value: 'BAYC' },
];

const Website = (props) => {
	const { trackUserCreatedWebsite } = useAnalytics();
    const [contracts, setContracts] = useState([]);
    const [websiteTitle, setWebsiteTitle] = useState('');
	const { websites, setWebsites } = useWebsite();
    const [selectInput, setSelectInput] = useState('Select your contract');
    const { addToast } = useToast();
    const history = useHistory();
	const [selectedTemplate, setSelectedTemplate] = useState(templates[0].value);

    const [createWebsite] = useCreateWebsite({
        title: websiteTitle.toLowerCase(),
        contractAddress: selectInput,
				template: selectedTemplate == templates[1].value ? 'BAYC' : null,
        onCompleted: (data) => {
            addToast({
                severity: 'success',
                message: 'Website created',
            });
					const template = selectedTemplate == templates[1].value ? 'BAYC' : 'Blank'
					trackUserCreatedWebsite(template)

						setWebsites([...websites, data?.createWebsite])
            history.push('/websites');
        },
        onError: (e) => {
            addToast({
                severity: 'error',
                message: e.message,
            });
        }
    });

    useGetContracts({
        onCompleted: (data) => {
					console.log(data)
            const availableContracts = data.getContracts.filter((contract) => {
                return contract.address;
            });
					console.log(availableContracts)
            if (!availableContracts.length) return;
            setContracts(availableContracts);
            setSelectInput(availableContracts[0].address);
        },
    });

    const onSubmit = () => {
        try {
            if (!websiteTitle.length)
                throw new Error('Website subdomain must be filled');

					/*
            if (!selectInput.length || selectInput === 'Select your contract')
                throw new Error('You must choose a contract');
					*/

            createWebsite();
        } catch (e) {
            addToast({
                severity: 'error',
                message: e.message,
            });
        }
    };

    return (
        <Fade in>
            <Grid
                container
                sx={{
                    minHeight: '100vh',
                    overflow: 'hidden',
                    bgcolor: 'white',
                    position: 'absolute',
                    zIndex: 1100,
                    top: 0,
                    paddingTop: '67px',
                }}>
                <AppBar
                    position="fixed"
                    sx={{
                        bgcolor: 'grey.100',
                        py: 2,
                        boxShadow: 'none',
                        borderBottom: '1px solid rgba(0,0,0,.2)',
                        color: '#000',
                    }}>
                    <Stack direction="row" px={2} gap={2} alignItems="center">
                        <IconButton onClick={() => history.push('/websites')}>
                            <CloseIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                        <Divider
                            sx={{ height: '20px', borderWidth: 0.5 }}
                            orientation="vertical"
                        />
                        <Box>
                            <Typography variant="body">
                                Create a website
                            </Typography>
                        </Box>
                    </Stack>
                </AppBar>

                <Container>
                    <Stack pt={3} gap={3}>
                        <Stack>
                            <Typography variant="h4">
                                Create new website
                            </Typography>
                            <Typography gutterBottom variant="body">
                                Fill in and configure your smart contracts
                            </Typography>
                        </Stack>

                        <Stack gap={2} direction="row">
                            <Stack sx={{ flex: 1 }}>
                                <FormLabel sx={{ fontWeight: 'bold' }}>
                                    Website subdomain
                                </FormLabel>
                                <Typography gutterBottom variant="body2">
                                    Set a name for your website
                                </Typography>
                                <Stack direction="row" alignItems="center">
                                    <TextField
                                        size="small"
                                        placeholder="bayc-nft"
                                        onChange={(e) =>
                                            setWebsiteTitle(e.target.value)
                                        }
                                    />
                                    <Box>.ambition.so</Box>
                                </Stack>
                            </Stack>
                        </Stack>

												{contracts.length > 0 && (
									        <Stack>
                            <FormLabel sx={{ fontWeight: 'bold' }}>
                                Select your smart contract
                            </FormLabel>
                            <TextField
                                select
                                onChange={(e) => setSelectInput(e.target.value)}
                                value={selectInput}>
                                {contracts.map((c, idx) => (
                                    <MenuItem key={idx} value={c.address}>
                                        {c.address}
                                    </MenuItem>
                                ))}
                            </TextField>
													</Stack>
												)}


												<Stack>
                            <FormLabel sx={{ fontWeight: 'bold' }}>
															Choose a starting template
                            </FormLabel>
													<Grid container>
														{templates.map(template => (
															<Grid p={1} item xs={3}>
																<Card 
																	onClick={() => setSelectedTemplate(template.value)}
																	sx={{
																		height: '250px', 
																		border: selectedTemplate == template.value ? '1px solid blue' : null,
																		transition: 'all .2s',
																		alignItems:"center",
																		justifyContent:"center",
																		display: 'flex'
																	}}
																>
																	<Typography sx={{fontWeight: 'bold'}}>
																		{template.title}
																	</Typography>
																</Card>
															</Grid>
														))}

													</Grid>
                        </Stack>

                        <Stack justifyContent="space-between" direction="row">
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={onSubmit}>
                                Create
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Grid>
        </Fade>
    );
};

export default Website;
