import * as React from 'react';

import { Container, Box } from 'ds/components';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// import Actions from './Actions';
import Balance from './Balance';
import Overview from './Overview';
import Settings from './Settings';
import Embed from '../Contract/Embed';

const ContractDetailTabs = (props) => {
    const [value, setValue] = React.useState('overview');
    const handleChange = (event, newValue) => setValue(newValue);

    return (
        <React.Fragment>
            <Container>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Overview" value="overview" />
                    {/* <Tab label="Actions" value="actions" /> */}
                    <Tab label="Settings" value="settings" />
                    <Tab label="Embed" value="embed" />
                    <Tab label="Balance" value="balance" />
                </Tabs>
            </Container>

            <Box py={2}>
                {{
                    overview: <Overview {...props} />,
                    // actions: <Actions {...props} />,
                    settings: <Settings {...props} />,
                    embed: <Embed {...props} />,
                    balance: <Balance {...props} />
                }[value]}
            </Box>
        </React.Fragment>
    );
}

export default ContractDetailTabs;