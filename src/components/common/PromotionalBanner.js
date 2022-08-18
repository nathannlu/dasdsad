import React from 'react';
import { Button, Link, Box, Typography, Stack } from 'ds/components';
import posthog from 'posthog-js';

const PromotionalBanner = () => {
	const onClick = () => {
		posthog.capture('User clicked on promotional banner');
	};

	return (
		<a
			onClick={onClick}
			href="https://tryambient.netlify.app/"
			target="_blank">
			<Box
				sx={{
					p: 3,
					mb: 3,
					border: '1px solid rgba(255,255,255,.15)',
					borderRadius: '5px',
					backgroundImage:
						'url(https://tryambient.netlify.app/images/login-pattern.png)',
					transition: 'all .2s',
					'&:hover': {
						boxShadow: '0 0 30px rgba(0,0,0,.15)',
					},
				}}>
				<Stack>
					<Typography variant="body" sx={{ fontWeight: 600 }}>
						New animated minting website
					</Typography>
					<Typography variant="h5">
						Launch NFTs better with animated minting websites
					</Typography>
					<Typography variant="body" sx={{ opacity: 0.8 }}>
						Skip the cost of hiring a designer and developer to create complex websites. Our website editor enables creators to create high-end websites for their NFT projects. Specifically designed and tested for launching NFT collections.
					</Typography>
					<Box>
						<Button size="small">Sign up today - it's free!</Button>
					</Box>
				</Stack>
			</Box>
		</a>
	);
};

export default PromotionalBanner;
