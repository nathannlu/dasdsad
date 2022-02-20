import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Typography, Button, Divider } from "ds/components";
import { Chip } from "@mui/material";
import { useWeb3 } from "libs/web3";
import { useContractDetails } from "./hooks/useContractDetails";

const Details = ({ contract }) => {
	const {
		balance,
		soldCount,
		price,
		isPublicSaleOpen,
		isPresaleOpen,
		max,
		metadataUrl
	} = useContractDetails(contract.address);

	return (
		<Stack>
			<Typography variant="h6" sx={{ fontWeight: "bold" }}>
				Details
			</Typography>

			<Grid container>
				<Grid item xs={6}>
					Balance:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{balance} {contract.nftCollection.currency}
				</Grid>
				<Grid item xs={6}>
					NFTs sold:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{soldCount}
				</Grid>
				<Grid item xs={6}>
					Price per NFT:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{price} {contract.nftCollection.currency}
				</Grid>
				<Grid item xs={6}>
					Collection size:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{contract?.nftCollection ? contract?.nftCollection?.size : null}
				</Grid>

				<Grid item xs={6}>
					Pre sales status:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{isPresaleOpen ? (
						<Chip label="Open" color="success" size="small" />
					) : (
						<Chip label="Closed" color="error" size="small" />
					)}
				</Grid>

				<Grid item xs={6}>
					Public sales status:
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{isPublicSaleOpen ? (
						<Chip label="Open" color="success" size="small" />
					) : (
						<Chip label="Closed" color="error" size="small" />
					)}
				</Grid>

				<Grid item xs={6}>
					Metadata URL
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{metadataUrl}
				</Grid>
				<Grid item xs={6}>
					Max per mint
				</Grid>
				<Grid sx={{ fontWeight: "bold" }} item xs={6}>
					{max}
				</Grid>

			</Grid>
		</Stack>
	);
};

export default Details;
