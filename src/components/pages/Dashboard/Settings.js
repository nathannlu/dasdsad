import React, { useState } from 'react';
import { useSetCustomDomain, useVerifyDns } from 'gql/hooks/website.hook';
import { useWebsite } from 'libs/website';
import { useForm } from 'ds/hooks/useForm';
import { useCustomDomainForm } from './hooks/useCustomDomainForm';

import { Fade, IconButton, Card, Stack, Box, TextField, Button, LoadingButton, Grid, Typography, Table, TableHead, TableBody, TableRow, TableCell, Collapse } from 'ds/components';
import { Language as DnsIcon, CheckCircle as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Settings = () => {
	// Handle adding custom domain
	const { website } = useWebsite();
	const {
		customDomainForm,
		onCompleted,
		onError
	} = useCustomDomainForm();
	const [setCustomDomain, { loading: setDomainLoading }] = useSetCustomDomain({
		title: website.title,
		customDomain: customDomainForm.domainName.value,
		onCompleted,
		onError
	});

	// Verify DNS
	const [customDomainVerified, setCustomDomainVerified] = useState(website.isCustomDomainActive);
	const [verifyDns, { loading: verificationLoading }] = useVerifyDns({
		title: website.title,
		onCompleted: data => setCustomDomainVerified(data.verifyDns)
	});

	// @TODO create a hook handler for collapse
	// const { toggle } = useCollapse({})
	const [openCollapse, setOpenCollapse] = useState(false);


	return (
		<Fade in>
			<Box 
				component="main"
				sx={{
					flexGrow: 1,
					minHeight: '100vh',
					p: 2
				}}
			>
				<Grid container>
					<Box sx={{width: '100%'}}>
						<Typography gutterBottom variant="h4">
							Settings
						</Typography>

						<Card sx={{p:2}}>
							<Stack gap={2}>
								<Box>
									<Typography variant="h5">
										Custom Domains
									</Typography>
									<Typography variant="body">
										If you own your domain already you can add it to Agentsquare.
									</Typography>
								</Box>

								{ website.customDomain && (
									<Box sx={{border: 1, borderColor: 'grey.300', borderRadius: 2, p:2}}>
										<Stack gap={1} alignItems="center" direction="row">
											<DnsIcon fontSize="large" />
											<Box>
												{website.customDomain}
											</Box>

											{customDomainVerified ? (
												<Stack direction="row" gap={.5} alignItems="center" sx={{color: 'green', marginLeft: 'auto'}}>
													<CheckIcon />
													Connected
												</Stack>
											) : (
												<Box onClick={() => setOpenCollapse(!openCollapse)} sx={{color: 'orange', marginLeft: 'auto'}}>
													Issues Detected
												</Box>
											)}

											<IconButton>
												<DeleteIcon />
											</IconButton>
										</Stack>
										
										<Collapse in={openCollapse}>
											{!customDomainVerified && (
												<Stack gap={2}>

													<Box sx={{border: 1, borderColor: 'grey.300', borderRadius: 2, p: 1, borderLeft: 3}}>
														<Typography>
															Visit the admin console of your domain registrar (the website you bought your domain from) and create two <b>A Records:</b>
														</Typography>
														<Table sx={{width: 'unset', '& td, & th': {p: '8px 16px'}}}>
															<TableHead>
																<TableRow>
																	<TableCell>Type</TableCell>
																	<TableCell>Name</TableCell>
																	<TableCell>Value</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																<TableRow sx={{'& td': {borderBottom: 0}}}>
																	<TableCell>A</TableCell>
																	<TableCell>@</TableCell>
																	<TableCell>3.143.11.9</TableCell>
																</TableRow>
															</TableBody>
														</Table>
													</Box>

													<Stack gap={2} alignItems="center" direction="row">
														<LoadingButton 
															loading={verificationLoading} 
															onClick={verifyDns} 
															variant="contained"
														>
															Check Status
														</LoadingButton>
														<Typography>
															NOTE: It may take up to a few hours for DNS changes to take effect.
														</Typography>
													</Stack>
												</Stack>
											)}
										</Collapse>
									</Box>
								)}

								<Box>
									<Typography variant="h5">
										Add Existing Domain
									</Typography>
									<Typography variant="body1">
										If you own your domain already you can add it to Webflow
									</Typography>
								</Box>

								<form onSubmit={e => {
									e.preventDefault();
									setCustomDomain();
								}}>
									<Stack gap={2} direction="row">
										<TextField
											sx={{flex: 1}}
											{...customDomainForm.domainName} 
										/>
										<LoadingButton 
											loading={setDomainLoading} 
											color="primary" 
											variant="outlined"
											type="submit"
										>
											Add domain
										</LoadingButton>
									</Stack>
								</form>

							</Stack>
						</Card>
					</Box>
				</Grid>
			</Box>
		</Fade>
	)
};

export default Settings;
