import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Stack, Modal, Button, Box, Grid, Typography } from 'ds/components';

import { useGenerateCollection } from './hooks/useGenerateCollection';
import { useCollection } from 'libs/collection';


const CheckoutModal = () => {
	const { save } = useGenerateCollection();	
	const { isModalOpen, setIsModalOpen, done, progress, zipProgress, settingsForm: { collectionSize } } = useCollection();
	const [percentage, setPercentage] = useState()


	useEffect(() => {
		let p = progress;
		let penis = 100 * ((++p)/collectionSize.value)
		setPercentage(penis);
	}, [progress])

	return (
		<Modal
			open={isModalOpen}
//			closeOnOuterClick={true}
			onClose={() => setIsModalOpen(false)}
			sx={{overflow: 'auto', alignItems: 'center', display: 'flex'}}
		>
			<Grid item xs={5} p={3} sx={{margin: '0 auto', bgcolor: 'white', borderRadius: 2}}>
				<Box sx={{height: '100px', width: '100px', overflow:'hidden', alignItems: 'center',justifyContent: 'center'}}>
					<img src="https://i.imgur.com/KfT2NnC.gif" style={{height: '100px', width: '100px', transform: 'scale(150%)'}} />
				</Box>
				<Typography variant="h5">
					Almost there... we are building your collection!
				</Typography>
				<Typography gutterBottom variant="body">
					In the meanwhile, checkout our <a target="_blank" style={{color: 'blue'}} href="https://discord.gg/ZMputCvjVe">Discord</a> and <a style={{color: 'blue'}} href="https://twitter.com/nftdatagen" target="_blank">Twitter</a>
				</Typography>
				<Typography gutterBottom variant="body">
					DO NOT CLOSE THIS PAGE
				</Typography>

				<Stack pt={2} gap={2}>
					{progress !== null && (
						<LinearProgressWithLabel value={percentage} />
					)}
					{zipProgress !== null && (
						<>
							Zipping... {Math.round(zipProgress)}%
						</>
					)}


					<Stack direction="row">
						<Button onClick={save} variant="contained" disabled={!done}>
							Download collection
						</Button>
					</Stack>
				</Stack>

			</Grid>
		</Modal>
	)
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress  variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default CheckoutModal;
