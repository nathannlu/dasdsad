import React from 'react';
import { Stack, Box,Button, Typography, TextField, FormLabel } from 'ds/components';
import { Chip, Radio, RadioGroup, FormControl, FormControlLabel, IconButton } from '@mui/material';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useValidateForm } from '../hooks/useValidateForm'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Settings = props => {
	const { settingsForm, metadataType, setMetadataType, addCreator, removeCreator, creators } = useMetadata();
	const { validateCollectionSize } = useValidateForm();

	return (
		<Stack justifyContent="space-between" sx={{minHeight: '90vh', paddingTop: '120px'}}>
			<Stack gap={2}>
				<Box md={3} item>
					<Chip sx={{opacity: .8, mb: 1}} label="Step 1/4" />
					<Typography variant="h2">
						Metadata &amp; collection
					</Typography>
					<Typography variant="body">
						Edit fields below to configure your metadata
					</Typography>
				</Box>
				<Box>
					<FormLabel>Name</FormLabel>
					<TextField {...settingsForm.name} fullWidth />
				</Box>
				<Box>
					<FormLabel>Description</FormLabel>
					<TextField  {...settingsForm.description} fullWidth/>
				</Box>
				<Box>
					<FormLabel>Collection Size*</FormLabel>
					<TextField {...settingsForm.size} fullWidth />
				</Box>
				<Stack spacing={1}>
					<FormLabel>Metadata Type*</FormLabel>
					<FormControl>
						<RadioGroup row value={metadataType} onChange={(e) => setMetadataType(e.target.value)}>
							<FormControlLabel sx={{ ml: '.75em', mr: 0 }} value="eth" control={<Radio sx={{'&.MuiRadio-root': {padding: 0, mr: '.5em'}}}/>} label="ETH" />
							<FormControlLabel sx={{ ml: '.75em', mr: 0 }} value="sol" control={<Radio sx={{'&.MuiRadio-root': {padding: 0, mr: '.5em'}}}/>} label="SOL" />
						</RadioGroup>
					</FormControl>
					{metadataType === 'sol' && (
						<Stack 
							spacing={1}
							borderRadius='10px'
							backgroundColor='white'
							padding='2em'
							sx={{
								marginTop: '1em',
								boxShadow: '0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%);'
							}}
						>
							<Stack direction='row' spacing={1}>
								<Box>
									<FormLabel>Symbol</FormLabel>
									<TextField {...settingsForm.symbol} fullWidth />
								</Box>
								<Box>
									<FormLabel>Seller Fee Basis Points</FormLabel>
									<TextField {...settingsForm.sellerFeeBasisPoints} fullWidth />
								</Box>
							</Stack>
							<Box>
								<FormLabel>External URL</FormLabel>
								<TextField {...settingsForm.externalUrl} fullWidth />
							</Box>
							<Stack direction='row' spacing={1}>
								<Box>
									<FormLabel>Creator Address</FormLabel>
									<TextField {...settingsForm.creatorAddress} fullWidth />
								</Box>
								<Box>
									<FormLabel>Creator Share</FormLabel>
									<TextField {...settingsForm.creatorShare} fullWidth />
								</Box>
								<Box display='flex' alignItems='flex-end'>
									<FormLabel></FormLabel>
									<Button 
										style={{
											backgroundColor: 'rgb(25,26,36)',
											color: 'white'
										}}
										onClick={addCreator}
									>
										Add
									</Button>
								</Box>
							</Stack>
							<Box>
								<Stack spacing={1}>
									{creators?.map((creator, idx) => (
										<Stack direction='row' spacing={2} key={idx} alignItems='center'>
											<Typography fontSize='10'>
												{creator.address}
											</Typography>
											<Typography fontSize='10'>
												{creator.share}
											</Typography>
											<IconButton
												onClick={() => removeCreator(idx)}
											>
												<DeleteOutlineIcon  style={{ color: 'rgb(230, 230, 230)' }} />
											</IconButton>
										</Stack>
									))}
								</Stack>
							</Box>
						</Stack>
					)}
				</Stack>
			</Stack>
			<Box sx={{alignSelf: 'flex-end', justifySelf: 'flex-end', marginTop: '3em'}}>
				<Button 
					onClick={() => validateCollectionSize() && props.nextStep()}
					style={{
						backgroundColor: 'rgb(25,26,36)',
						color: 'white'
					}}
				>
					Next
				</Button>
			</Box>
		</Stack>
	)
};

export default Settings;

