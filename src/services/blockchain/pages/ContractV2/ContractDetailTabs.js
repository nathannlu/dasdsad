import * as React from 'react';

import { Container, Box } from 'ds/components';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Actions from './Actions';
import Balance from './Balance';
import Overview from './Overview';
import Settings from './Settings';

const ContractDetailTabs = (props) => {
    const { id, contract, contractState } = props;

    const [value, setValue] = React.useState('overview');
    const handleChange = (event, newValue) => setValue(newValue);

    return (
        <React.Fragment>
            <Container>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Overview" value="overview" />
                    <Tab label="Actions" value="actions" />
                    <Tab label="Settings" value="settings" />
                    <Tab label="Balance" value="balance" />
                </Tabs>
            </Container>

            <Box py={2}>
                {
                    {
                        overview: <Overview contract={contract} contractState={contractState} />,
                        actions: <Actions id={id} contract={contract} contractState={contractState} />,
                        settings: <Settings {...props} />,
                        balance: <Balance id={id} contract={contract} />
                    }[value]
                }
            </Box>
        </React.Fragment>
    );
}

export default ContractDetailTabs;