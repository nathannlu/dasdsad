import React from 'react';
import { Stack, FormLabel, TextField, Modal,  Box, Typography, Button } from 'ds/components';
import { useLayerManager } from 'core/manager';
import { useTrait } from 'core/traits';
import { useNewTraitNameForm } from '../hooks/useNewTraitNameForm';


const ChangeTraitNameModal = ({isModalOpen, setIsModalOpen, editTrait}) => {
	const { query: { layers, selected }} = useLayerManager();
	const { updateTrait } = useTrait();
	const {
		newTraitNameForm,
		onSubmit
	} = useNewTraitNameForm({
		editTrait,
		isModalOpen,
		setIsModalOpen
	});

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
							<TextField fullWidth size="small" {...newTraitNameForm.name} />
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
