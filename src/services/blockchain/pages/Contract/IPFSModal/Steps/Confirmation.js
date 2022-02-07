const Confirmation = props => {
	const { imagesUrl, metadataUrl, ipfsUrl } = useContract();
	const { addToast } = useToast();

  const [setBaseUri] = useSetBaseUri({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: 'Successfully added contract base URI'
			})
			props.setIsModalOpen(false)
		}
	})

	return (
		<Stack gap={2}>
			<Box>
				Your first NFT is stored at <a style={{color: 'blue'}} href={`https://gateway.pinata.cloud/ipfs/${imagesUrl}/0.png`} target="_blank">ipfs://{imagesUrl}/</a>. Please verify the content is correct.
			</Box>

			<Box>
				Metadata for your first NFT is stored at <a style={{color: 'blue'}} href={`https://gateway.pinata.cloud/ipfs/${metadataUrl}/0`} target="_blank">{ipfsUrl}</a>. Please verify the content is correct.
			</Box>

			<Button variant="contained" onClick={() => setBaseUri({variables: {baseUri: ipfsUrl, id: props.id}})}>
				Confirm
			</Button>
		</Stack>
	)
};

