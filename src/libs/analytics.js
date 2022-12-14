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
			...launchpadTracking,
			...websiteBuilderTracking,
			...authTracking
    };
};

const launchpadTracking = {
	logUserClickedOnCollection: () => {
		posthog.capture('User selected service', {
			service: 'NFT launchpad',
		});
	},

	// Used to track contract creation on our server-side
	trackContractCreation: () => {
		if (posthog.isFeatureEnabled('ab_test_1')) {
				// run your activation code here
			posthog.capture('User created contract in dashboard', {
				blockchain: 'ethereum',
				group: 'a',
			});
		} else {
			posthog.capture('User created contract in dashboard', {
				blockchain: 'ethereum',
				group: 'b',
			});
		}
	},

	// Track user subscribed to IPFS

	// Track user uploaded images to IPFS count

	// Track user uploaded metadata to IPFS count


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

	// Used to track mainnet/testnet eth, sol devnet/mainnet deployments
	trackContractDeployment: (blockchain) => {
		posthog.capture('User successfully deployed contract to blockchain', {
			blockchain,
			version: '2'
		});
	}
}

const websiteBuilderTracking = {
	logUserClickedOnWebsite: () => {
		posthog.capture('User selected service', {
			service: 'Website builder',
		});
	},

	trackUserCreatedWebsite: (template) => {
		posthog.capture('User created website in dashboard', {
			template,
		});
	},
	trackUserSaveWebsite: () => {
		posthog.capture('User saved website progress');
	},
	trackUserPublishWebsite: () => {
		posthog.capture('User published website to live');
	},
};

const authTracking = {
	// @param type - metamask | phantom | email
	// @TODO set address or email, and mongo user ID
	trackUserLoggedIn: (type) => {
		posthog.capture('User logged into web app', {
			type,
			$set: { webAppUser: true }
		})
	}
};
