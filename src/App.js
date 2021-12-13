import React from 'react';
import Generator from 'components/pages/Generator';
import ReactGA from 'react-ga';

function App() {
	ReactGA.initialize('G-X392J39GCK');
	ReactGA.pageview(window.location.pathname + window.location.search);

  return (
		<Generator />
  );
}

export default App;
