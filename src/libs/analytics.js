import ReactGA from 'react-ga';
import posthog from 'posthog-js';
import LogRocket from 'logrocket';

export const useAnalytics = () => {
    const initGA = () => {
        ReactGA.initialize('UA-222492814-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    };

    const initPosthog = () => {
        //		if (!window.location.href.includes('localhost')) {
        posthog.init('phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf', {
            api_host: 'https://app.posthog.com',
        });
        //		}
    };

    const initLogRocket = () => {
        if (!window.location.href.includes('localhost')) {
            LogRocket.init('sdihjw/ambition');
        }
    };




		// Website tracking

    return {
        initGA,
        initPosthog,
        initLogRocket,
			...launchpadTracking
    };
};

const launchpadTracking = {
	logUserClickedOnCollection: () => {
		posthog.capture('User selected service', {
			service: 'NFT launchpad',
		});
	},
	logUserClickedOnWebsite: () => {
		posthog.capture('User selected service', {
			service: 'Website builder',
		});
	},
	trackUploadToIPFS: () => {
		posthog.capture('User connected NFT images + metadata', {
			service: 'Paid',
		});
	},
	trackPersonalIPFS: () => {
		posthog.capture('User connected NFT images + metadata', {
			service: 'Personal',
		});
	},
	// Used to track contract creation on our server-side
	trackContractCreation: () => {
		posthog.capture('User created contract in dashboard', {
			blockchain: 'ethereum',
		});
	},
	// Used to track mainnet/testnet eth, sol devnet/mainnet deployments
	trackContractDeployment: (blockchain) => {
		posthog.capture('User successfully deployed contract to blockchain', {
			blockchain,
			version: '2'
		});
	}
}
