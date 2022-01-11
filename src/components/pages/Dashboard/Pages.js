import React, { useState } from 'react';
import { Button, Box, TextField, Typography, Stack, Card, Grid, Modal, Fade } from 'ds/components';
import { useForm } from 'ds/hooks/useForm';
import { Link } from 'react-router-dom';
import { useWebsite } from 'libs/website';
import { useCreateWebsite } from 'gql/hooks/website.hook';
import { useToast } from 'ds/hooks/useToast';

import { Edit as EditIcon } from '@mui/icons-material'

const Pages = () => {
	const { website } = useWebsite();
	const [title, setTitle] = useState();
	const { addToast } = useToast();
	const [createWebsite] = useCreateWebsite({
		title,
		onCompleted: data => {
			console.log(data);
		}
	})


	return (
		<Fade in>
			<Box 
				component="main"
				sx={{
					flexGrow: 1,
					height: '100%',
					p: 2
				}}
			>
				<Grid container className="mt-16">
					<Box>
						<Typography gutterBottom variant="h4">
							Page Manager
						</Typography>
					</Box>
				</Grid>

				{Object.keys(website).length > 0 ? (
					<Grid container gap={2}>
						{website.pages == null ? (
							<Box> loading </Box>
						) : website.pages.map((page) => (
							<Fade key={page.pageName} in>
								<Grid item xs={3}>
									<Card variant="outlined">
											<Box sx={{ bgcolor: 'grey.300'}}>
											<img src="https://uni-pages-screenshots.s3.amazonaws.com/empty_thumbnail.jpg" />
										</Box>
										<Box sx={{
											bgcolor: 'white',
											p: 2
										}}>
											<Typography gutterBottom variant="h6">
												{page.pageName}
											</Typography>

											<Stack direction="row" gap={2}>
												<Button 
													startIcon={<EditIcon />}
													size="small" 
													variant="contained"
													href={`/builder/${website.title}/${page.pageName}`} 
												>
													Edit page
												</Button>
											</Stack>
										</Box>
									</Card>
								</Grid>
							</Fade>
						))}
					</Grid>
				) : (
					<Box>
						<Button variant="contained" onClick={createWebsite}>
							Create your new website
						</Button>
						<TextField onChange={e => setTitle(e.target.value)} />
					</Box>
				)}

			</Box>
		</Fade>
	)
};

export default Pages;
