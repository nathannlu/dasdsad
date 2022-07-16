import development from './dev';
import production from './prod';

const configs = {
    development,
    production,
};

// Enviornment variable is set in react-scripts
const configEnv = process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV;
const exportedConfig = configs[configEnv];
console.log('Loaded', configEnv, 'config');

export default exportedConfig;
