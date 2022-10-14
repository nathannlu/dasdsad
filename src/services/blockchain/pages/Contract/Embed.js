import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Button, Stack, TextField, Typography } from 'ds/components';
import { useToast } from 'ds/hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useEmbedBttonStyling } from './hooks/useEmbedBttonStyling';

const Embed = ({ contract, id }) => {
    const { addToast } = useToast();
    const [embedCode, setEmbedCode] = useState('');
    const [customEmbedCode, setCustomEmbedCode] = useState('');

    const { getCssString } = useEmbedBttonStyling(contract, id);

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
        else if (contract.blockchain === 'goerli') chainId = '5';
        else if (contract.blockchain === 'rinkeby') chainId = '4';
        else if (contract.blockchain === 'polygon') chainId = '89';
        else if (contract.blockchain === 'mumbai') chainId = '13881';
        else if (contract.blockchain === 'solana') chainId = 'solana';
        else if (contract.blockchain === 'solanadevnet') chainId = 'solanadevnet';
        else throw new Error('blockchain not supported!');

        const bundleUrl = 'https://cdn.jsdelivr.net/gh/ambition-so/embed-prod-build@main/bundle.js';
        const contractAddress = contract?.address;
        const contractType = contract?.type === 'erc721a' && 'erc721a' || 'erc721';
        const classes = {
            "connect-button": "connect-button",
            "mint-button": "mint-button",
            "details-container": "details-container",
            "details": "details"
        };

        const css = getCssString(contract?.embed?.css && JSON.parse(contract?.embed.css) || undefined);

        setEmbedCode(`<ambition-button chainid="${chainId}" contractaddress="${contractAddress}" type="${contractType}" classes='${JSON.stringify(classes)}'></ambition-button>
        <script defer="defer" src="${bundleUrl}"></script>
        <style>${css}</style>`);

        setCustomEmbedCode(`
            function handleOnLoad() {
                const iframe = document.getElementById('iframe').contentWindow.document;
                const ambitionButton = document.createElement("ambition-button");

                const chainid = document.createAttribute("chainid");
                const contractaddress = document.createAttribute("contractaddress");
                const type = document.createAttribute("type");
                const classes = document.createAttribute("classes");

                chainid.value = "${chainId}";
                contractaddress.value = "${contractAddress}";
                type.value = "${contractType}";
                classes.value = JSON.stringify(${JSON.stringify(classes)});

                ambitionButton.setAttributeNode(chainid);
                ambitionButton.setAttributeNode(contractaddress);
                ambitionButton.setAttributeNode(type);
                ambitionButton.setAttributeNode(classes);

                const script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://cdn.jsdelivr.net/gh/ambition-so/embed-prod-build@main/bundle.js";

                const style = document.createElement('style');
                const css = \`${css}\`;

                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                iframe.body.append(ambitionButton);
                iframe.head.append(style);
                iframe.head.append(script);
            }
        `);

    }, [contract]);

    return (
        <Stack gap={2} alignItems="flex-start">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Embed
            </Typography>

            <Typography variant="p" sx={{ fontStyle: 'italic' }} color="gray">
                ** Now you can customize the embed button, by providing the styling to classes
            </Typography>

            <Box display="flex" sx={{ width: '100%', mb: 4 }}>
                <Box flex="1" display="flex" flexDirection="column">
                    <Typography>Direct Embed:</Typography>
                    <TextField
                        fullWidth={true}
                        sx={{ mb: '1em' }}
                        rows={12}
                        multiline={true}
                        InputProps={{ readOnly: true }}
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

            <Box display="flex" sx={{ width: '100%' }}>
                <Box flex="1" display="flex" flexDirection="column">
                    <Typography>Custom Embed:</Typography>
                    <TextField
                        fullWidth={true}
                        sx={{ mb: '1em' }}
                        rows={12}
                        multiline={true}
                        InputProps={{ readOnly: true }}
                        value={customEmbedCode}
                    />

                    <Typography variant="p" sx={{ fontStyle: 'italic', my: 2 }} color="gray">
                        **Copy the above code and add to script tag on the page<br />
                    </Typography>

                    <TextField
                        fullWidth={true}
                        sx={{ mb: '1em' }}
                        rows={1}
                        multiline={true}
                        InputProps={{ readOnly: true }}
                        value={`<iframe width="320" id="iframe" scrolling="no" frameBorder="0" onload="handleOnLoad()"></iframe>`}
                    />
                    <Typography variant="p" sx={{ fontStyle: 'italic' }} color="gray">
                        **Copy the above iframe code in html where you want to load the embed button
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
};

export default Embed;
