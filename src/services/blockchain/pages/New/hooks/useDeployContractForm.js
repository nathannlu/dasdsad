import { useForm } from 'ds/hooks/useForm';
import { useToast } from 'ds/hooks/useToast';
import { useContract } from 'services/blockchain/provider';
import { useHistory } from 'react-router-dom';
import posthog from 'posthog-js';

export const useDeployContractForm = () => {
    const { form: deployContractForm } = useForm({
        name: {
            default: '',
            placeholder: 'Bored Ape Yacht Club',
        },
        symbol: {
            default: '',
            placeholder: 'BAYC',
        },
        priceInEth: {
            default: '0.05',
            placeholder: '0.05',
        },
        royaltyPercentage: {
            default: '',
            placeholder: 5,
        },
        maxSupply: {
            default: '100',
            placeholder: '3333',
        },
    });
    const { addToast } = useToast();
    const history = useHistory();

    const onDeploy = () => {
        addToast({
            severity: 'info',
            message:
                'Deploying contract to Ethereum. This might take a couple of seconds...',
        });
    };

    const handleRedirect = () => {
        history.push('/smart-contracts');
    };

    const onCompleted = () => {
        addToast({
            severity: 'success',
            message: 'Smart contract successfully created',
        });
        posthog.capture('User created contract');
        handleRedirect();
    };

    const onError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    return {
        deployContractForm,
        onDeploy,
        onCompleted,
        onError,
    };
};
