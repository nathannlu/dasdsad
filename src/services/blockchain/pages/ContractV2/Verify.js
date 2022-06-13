import React, { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import {
	Fade,
	Container,
	Link,
	TextField,
	Stack,
	Box,
	Grid,
	Typography,
	Button,
	Divider,
} from 'ds/components';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useToast } from 'ds/hooks/useToast';


const Verify = ({ contract, contractState }) => {
	const { encodeConstructor } = useWeb3();
	const { addToast } = useToast();
	const [embedCode, setEmbedCode] = useState('');
	const copyEmbedCode = () => {
		navigator.clipboard.writeText(embedCode);
		addToast({
			severity: 'info',
			message: 'Constructor arguments copied to clipboard',
		});
	};

	useEffect(() => {
		(async () => {
			setEmbedCode(await encodeConstructor(contract));
		})();

		const isTestnet = contract.blockchain == 'rinkeby'
	}, [contract]);


	return (
		<Stack gap={2} alignItems="flex-start">
			<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
				Verify smart contract
			</Typography>
			<Stack direction="row">
				<Box>
					<Typography>Compiler</Typography>
					<TextField
						sx={{
							width: '300px',
							mb: '1em',
						}}
						InputProps={{
							readOnly: true,
						}}
						value={"v0.8.7+commit.e28d00a7"}
					/>
				</Box>
				<Box>
					<Typography>Optimization</Typography>
					<TextField
						sx={{
							width: '300px',
							mb: '1em',
						}}
						InputProps={{
							readOnly: true,
						}}
						value={"No"}
					/>
				</Box>
			</Stack>

			<Box display="flex">
				<Box flex="1" display="flex" flexDirection="column">
					<Typography>Download solidity Contract Code</Typography>
					<Button onClick={() => {
						contract.blockchain == 'rinkeby' 
							? window.open('https://github.com/ambition-so/controllers/blob/main/src/contracts/ambition-proxy-testnet.sol',"_blank").focus() // testnet contract
							: window.open('https://github.com/ambition-so/controllers/blob/main/src/contracts/ambition-proxy-mainnet.sol',"_blank").focus() // mainnet contract
					}} variant="contained">
							Download
						</Button>
				</Box>
			</Box>


			<Box display="flex">
				<Box flex="1" display="flex" flexDirection="column">
					<Typography>Constructor Arguments</Typography>
					<TextField
						sx={{
							width: '600px',
							mb: '1em',
						}}
						rows={8}
						multiline
						InputProps={{
							readOnly: true,
						}}
						value={embedCode}
					/>
					<Button
						variant="outlined"
						endIcon={<ContentCopyIcon />}
						onClick={copyEmbedCode}>
						Copy to clipboard
					</Button>
				</Box>
			</Box>
		</Stack>
	);
};

export default Verify;
