import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Action from './Action';
import Details from './Details';
import Embed from './Embed';
import EmbedButtonStyling from './EmbedButtonStyling';

const View = ({ id, contract, renderError }) => {
    const [value, setValue] = React.useState('details');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab label="Details" value="details" />
                    <Tab label="Action" value="action" />
                    <Tab label="Embed" value="embed" />
                    <Tab label="Embed Button Styling" value="embedButtonStyling" />
                </Tabs>
            </Box>
            <Box py={2}>
                {
                    {
                        details: <Details id={id} contract={contract} renderError={renderError} />,
                        action: <Action id={id} contract={contract} />,
                        embed: <Embed id={id} contract={contract} />,
                        embedButtonStyling: <EmbedButtonStyling id={id} contract={contract} />
                    }[value]
                }
            </Box>
        </Box>
    );
};

export default View;
