import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Action from './Action';
import Details from './Details';
import Embed from './Embed';


const View = ({id, contract}) => {
  const [value, setValue] = React.useState("details");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Details" value="details" />
          <Tab label="Action" value="action" />
          <Tab label="Embed" value="embed" />
        </Tabs>
      </Box>
			{{
				"details": <Details id={id} contract={contract} />,
				"action": <Action id={id} contract={contract} />,
				"embed": <Embed id={id} contract={contract} />
			}[value]}
    </Box>
  );
}


export default View;
