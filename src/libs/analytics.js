import ReactGA from 'react-ga';
import posthog from 'posthog-js';
import LogRocket from 'logrocket';


export const useAnalytics = () => {
	const initGA = () => {
		ReactGA.initialize('UA-222492814-1');
		ReactGA.pageview(window.location.pathname + window.location.search);
	}

	const initPosthog = () => {
//		if (!window.location.href.includes('localhost')) {
			posthog.init("phc_Y320pMWnNVcSMIAIW1bbh35FXjgqjZULkZrl5OhaIAf", {api_host: 'https://app.posthog.com'});
//		}
	}

	const initLogRocket = () => {
		if (!window.location.href.includes('localhost')) {
			LogRocket.init('sdihjw/ambition')
		}
	}


	return {
		initGA,
		initPosthog,
		initLogRocket
	}
}
