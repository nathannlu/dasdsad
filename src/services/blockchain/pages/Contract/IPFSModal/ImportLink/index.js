import React, { useState } from 'react';
import { Stack, Box, Typography, TextField, Button } from 'ds/components';
import {
    useSetBaseUri,
    useSetUnRevealedBaseUri,
} from 'services/blockchain/gql/hooks/contract.hook';
import { useToast } from 'ds/hooks/useToast';

const ImportLink = (props) => {
    const [ipfsUrl, setIpfsUrl] = useState('');
		const [unrevealedIpfsUrl, setUnrevealedIpfsUrl] = useState('');
    const { addToast } = useToast();
    const [setBaseUri] = useSetBaseUri({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Successfully added contract base URI',
            });
            props.setIsModalOpen(false);
        },
    });

    const [setUnRevealedBaseUri] = useSetUnRevealedBaseUri({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: 'Successfully updated contract unrevealed base URI',
            });
        },
    });


    return (
        <Stack gap={2}>
            <Box>
                <Button size="small" onClick={() => props.goToStep(1)}>
                    Go back
                </Button>
            </Box>



					{props.renderUploadUnRevealedImage && (
							<>
								<Box>
									<Typography sx={{fontWeight:'bold'}}>Input your unrevealed metadata URL here</Typography>
									<Typography>This is the ipfs URI to your uploaded metadata folder that points to your unrevealed image</Typography>
									<Typography> The link has to be inputed in the format of "ipfs://IPFS_CID_HERE/" (must include ending "/")</Typography>
								</Box>
								<Box>
										<TextField
												onChange={(e) => setUnrevealedIpfsUrl(e.target.value)}
												value={unrevealedIpfsUrl}
										/>
								</Box>
							</>
						)}

            <Box>
                <Typography sx={{fontWeight:'bold'}}>Input your collection metadata URL here</Typography>
								<Typography>This is the ipfs URI to your uploaded metadata folder that points to your collection image</Typography>
									<Typography>The link has to be inputed in the format of "ipfs://IPFS_CID_HERE/" (must include ending "/")</Typography>
            </Box>

            <Box>
                <TextField
                    onChange={(e) => setIpfsUrl(e.target.value)}
                    value={ipfsUrl}
                />
            </Box>

            <Button
                variant="contained"
                onClick={() => {
									if(props.renderUploadUnRevealedImage && !(unrevealedIpfsUrl.length > 1)) {
										addToast({
											severity: 'error',
											message: 'Unrevealed metadata URL field must be filled'
										});
										return;
									}
									if(!(ipfsUrl.length > 1)) {
										addToast({
											severity: 'error',
											message: 'Collection metadata URL field must be filled'
										});
										return;
									}

									if (props.renderUploadUnRevealedImage) {
										setUnRevealedBaseUri({ variables: { unRevealedBaseUri: unrevealedIpfsUrl, id: props.id } });
									}

									setBaseUri({ variables: { baseUri: ipfsUrl, id: props.id } });

									/*
                    setBaseUri({
                        variables: { baseUri: ipfsUrl, id: props.id },
                    })
										*/
                }}>
                Confirm
            </Button>
        </Stack>
    );
};

export default ImportLink;
