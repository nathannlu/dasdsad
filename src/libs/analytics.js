import ReactGA from 'react-ga';
import posthog from 'posthog-js';
import LogRocket from 'logrocket';


export const useAnalytics = () => {
	const initGA = () => {
		ReactGA.initialize('G-X392J39GCK');
		ReactGA.pageview(window.location.pathname + window.location.search);
	}

	const initPosthog = () => {
//		if (!window.location.href.includes('localhost')) {
			posthog.init("phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf", {api_host: 'https://app.posthog.com'});
//		}
	}

	const initLogRocket = () => {
		if (!window.location.href.includes('localhost')) {
			LogRocket.init('tbhvh1/web3')
		}
	}


	return {
		initGA,
		initPosthog,
		initLogRocket
	}
}
