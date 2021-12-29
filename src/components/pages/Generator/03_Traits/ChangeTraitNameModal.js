import React, { useState, useEffect } from 'react';
import { Stack, FormLabel, TextField, Modal, Grid, Box, LoadingButton, Card, Typography, Divider, Button, Select, MenuItem } from 'ds/components';
import { useCollection } from 'libs/collection';


const ChangeTraitNameModal = ({isModalOpen, setIsModalOpen, editTrait}) => {
	const { layers, setLayers, selected } = useCollection();
	const [newTraitName, setNewTraitName] = useState();

	const onSubmit = e => {
		e.preventDefault();

		setLayers(prevState => {
			prevState[selected].images[editTrait].name = newTraitName;
			return [...prevState]
		})

		setIsModalOpen(false)
	}

	useEffect(() => {
		if(isModalOpen) {
			setNewTraitName(layers[selected]?.images[editTrait]?.name)	
		}
	}, [isModalOpen])
	
	return (
		<Modal
			open={isModalOpen}
			closeOnOuterClick={true}
			onClose={()=>setIsModalOpen(false)}
			sx={{overflow: 'auto', alignItems: 'center', display: 'flex'}}
		>
			<form
				onSubmit={onSubmit}
				style={{
					width: '540px',
					margin: '0 auto',
					borderRadius: '5px'
				}}
			>
				<Box sx={{bgcolor: 'white', borderBottom: 1, borderColor: 'grey.300', p: 2}}>
					<Typography variant="h6">
						Edit trait name
					</Typography>
				</Box>
				<Stack
					sx={{ bgcolor: 'grey.100', p: 2 }}
					gap={4}
				>
					<Box>
						<FormLabel>
							Trait name
						</FormLabel>

						<Stack direction="row">
							<TextField fullWidth size="small" value={newTraitName} onChange={e => setNewTraitName(e.target.value)} />
							<Button type="submit" variant="contained" size="small">
								Done
							</Button>
						</Stack>
					</Box>
				</Stack>
			</form>
		</Modal>
	)
};

export default ChangeTraitNameModal;
