import React, { useState, useEffect } from "react";
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
} from "ds/components";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useToast } from "ds/hooks/useToast";

const Embed = ({ contract, id }) => {
    const { addToast } = useToast();
	const [embedCode, setEmbedCode] = useState("");
	const [embedChainId, setEmbedChainId] = useState("");
	const copyEmbedCode = () => {
		navigator.clipboard.writeText(embedCode);
		addToast({
			severity: "info",
			message: "Embed code copied to clipboard",
		});
	};

	useEffect(() => {
		let chainId;
		if (contract.blockchain === "ethereum") chainId = "0x1";
		else if (contract.blockchain === "rinkeby") chainId = "0x4";
		else if (contract.blockchain === "polygon") chainId = "0x89";
		else if (contract.blockchain === "mumbai") chainId = "0x13881";
        else if (contract.blockchain.indexOf('solana') != -1) chainId = "solana";
		setEmbedChainId(chainId);

		setEmbedCode(`<iframe
			src="https://${
				window.location.hostname.indexOf("localhost") === -1
					? window.location.hostname
					: `${window.location.hostname}:3000`
			}/smart-contracts/embed/v1?contract=${contract.address}&chainId=${chainId}"
			width="100%"
			height="115px"
			frameborder="0"
			scrolling="no"
            style="border-radius: 10px; width: 350px"
		/>`);
	}, [contract]);

	return (
		<Stack gap={2} alignItems="flex-start">
			<Typography variant="h6" sx={{ fontWeight: "bold" }}>
				Embed
			</Typography>
			<Box display="flex">
				<Box flex="1" display="flex" flexDirection="column">
					<Typography>Code:</Typography>
					<TextField
						sx={{
							width: "600px",
							mb: "1em",
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
						onClick={copyEmbedCode}
					>
						Copy to clipboard
					</Button>
				</Box>
				<Box sx={{ ml: "1em" }} display="flex" flexDirection="column">
					<Typography>Preview:</Typography>
					<Box>
						<iframe
							src={`https://${
								window.location.hostname.indexOf("localhost") === -1
									? window.location.hostname
									: `${window.location.hostname}:3000`
							}/smart-contracts/embed?contract=${
								contract.address
							}&chainId=${embedChainId}`}
							width="350px"
							height="100px"
							frameBorder="0"
							scrolling="no"
						/>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default Embed;
