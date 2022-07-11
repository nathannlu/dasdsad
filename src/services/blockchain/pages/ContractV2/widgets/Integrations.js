import React from 'react';
import { useParams } from 'react-router-dom';

import { Divider, Grid, Stack, Typography } from 'ds/components';

import SmartButtonIcon from '@mui/icons-material/SmartButton';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

import ActionCard from './ActionCard';

import Embed from '../../Contract/Embed';
import EmbedButtonStyling from '../../Contract/EmbedButtonStyling';
import Verify from '../Verify';

const Integrations = ({ contract }) => {
    const { id } = useParams();

    const listOfIntegrations = [
        {
            icon: <SmartButtonIcon />,
            title: 'Embed a mint button',
            description: 'Add a mint button to your website on Webflow, Squarespace, or WordPress',
            modal: {
                modal: <Embed id={id} contract={contract} />,
                fullScreen: true,
                title: `Embed a mint button`
            },
        },
        {
            icon: <FormatColorFillIcon />,
            title: 'Style Mint Button',
            description: 'We allow you to style your mint button according to your website.',
            modal: {
                modal: <EmbedButtonStyling id={id} contract={contract} />,
                fullScreen: true,
                title: `Style Mint Button`
            },
        },
        {
            icon: <img style={{ height: '25px' }} src="https://etherscan.io/images/brandassets/etherscan-logo-circle.png" />,
            title: 'Verify on Etherscan',
            description: 'Set a list of users that can mint your NFT during pre-sale phase.',
            modal: {
                modal: <Verify contract={contract} />,
                fullScreen: true,
                title: `Verify your Contract on Etherscan`
            },
        },
        {
            icon: <img style={{ height: '25px' }} src="https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png" />,
            title: 'Connect with OpenSea',
            description: 'Import your collection onto Opensea. You must have at least one NFT minted before you can integrate.',
            action: () => window.open("https://opensea.io/get-listed/step-two", '_blank').focus()
        },
    ];

    return (
        <Stack gap={1} mt={4}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Integrations</Typography>
            </Stack>

            <Divider />

            <Grid container>
                {listOfIntegrations.map((integration, i) => <ActionCard key={i} {...integration} />)}
            </Grid>
        </Stack>
    );
};

export default Integrations;