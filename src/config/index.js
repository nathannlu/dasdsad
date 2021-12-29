import dev from './dev';
import prod from './prod';

const configs = {
	dev,
	prod
};

// Enviornment variable is set in react-scripts
const exportedConfig = dev //configs[process.env.REACT_APP_CONFIG];

export default exportedConfig;

