import React, { useState, useEffect } from 'react';
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

const Embed = ({ contract, id }) => {
    console.log(contract, 'contract');

    const { addToast } = useToast();
    const [embedCode, setEmbedCode] = useState('');
    const [embedChainId, setEmbedChainId] = useState('');
    const copyEmbedCode = () => {
        navigator.clipboard.writeText(embedCode);
        addToast({
            severity: 'info',
            message: 'Embed code copied to clipboard',
        });
    };

    useEffect(() => {
        let chainId;
        if (contract.blockchain === 'ethereum') chainId = '1';
        else if (contract.blockchain === 'rinkeby') chainId = '4';
        else if (contract.blockchain === 'polygon') chainId = '89';
        else if (contract.blockchain === 'mumbai') chainId = '13881';
        else if (contract.blockchain === 'solana') chainId = 'solana';
        else if (contract.blockchain === 'solanadevnet') chainId = 'solanadevnet';
        else throw new Error('blockchain not supported!');
        setEmbedChainId(chainId);

        // setEmbedCode(`<iframe
        // 	src="https://${
        //         window.location.hostname.indexOf('localhost') === -1
        //             ? window.location.hostname
        //             : `${window.location.hostname}:3000`
        //     }/smart-contracts/embed/v1?contract=${
        //     contract.address
        // }&chainId=${chainId}"
        // 	width="100%"
        // 	height="115px"
        // 	frameborder="0"
        // 	scrolling="no"
        //     style="border-radius: 10px; width: 350px"
        // />`);

        setEmbedCode(`<ambition-button chainid="${chainId}" contractaddress="${contract?.address}" type="${contract?.type === 'erc721a' && 'erc721a' || 'erc721'}"></ambition-button>
        <script defer="defer" src="https://cdn.jsdelivr.net/gh/ambition-so/embed-prod-build@main/bundle.js"></script>`);
    }, [contract]);

    return (
        <Stack gap={2} alignItems="flex-start">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Embed
            </Typography>
            <Box display="flex">
                <Box flex="1" display="flex" flexDirection="column">
                    <Typography>Code:</Typography>
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
                {/* <Box sx={{ ml: '1em' }} display="flex" flexDirection="column">
                    <Typography>Preview:</Typography>
                    <Box>
                        <iframe
                            src={`https://${
                                window.location.hostname.indexOf(
                                    'localhost'
                                ) === -1
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
                </Box> */}
            </Box>
        </Stack>
    );
};

export default Embed;
