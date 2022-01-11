import ReactGA from 'react-ga';
import posthog from 'posthog-js';

export const useAnalytics = () => {
	const initGA = () => {
		ReactGA.initialize('G-X392J39GCK');
		ReactGA.pageview(window.location.pathname + window.location.search);
	}

	const initPosthog = () => {
		if (!window.location.href.includes('localhost')) {
			posthog.init("phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf", {api_host: 'https://app.posthog.com'});
		}
	}


	return {
		initGA,
		initPosthog
	}
}
