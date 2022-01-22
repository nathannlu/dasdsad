import React, {useState, useEffect} from 'react';
import lz from 'lzutf8';
import {Editor, Frame, Element} from '@craftjs/core';

import { useWebsite } from 'libs/website';
import templates from 'components/blocks/main';
import { useGetWebsites } from 'gql/hooks/website.hook';

import Viewport from './Viewport';
import { RenderNode } from './RenderNode';

import './styles.css';


const App = props => {
	const [websiteData, setWebsiteData] = useState('');	
	const [enabled, setEnabled] = useState(false);

	useGetWebsites()
	const { website } = useWebsite();

	// Used to query DB for page data
	const { pageName } = props.match.params;

	

	// Load website data on load
	useEffect(() => {
		const page = website?.pages.find(page => page.name == pageName);
		const base64 = page.data
		if (base64 !== undefined) {
			const uint8array = lz.decodeBase64(base64);
			const json = lz.decompress(uint8array);
			
			setWebsiteData(json);
			setEnabled(true);
		}
	}, []);



	return (
		<Editor
			onRender={RenderNode}
			resolver={templates}
		>
			<Viewport>
				{enabled &&
					(
						<Frame data={websiteData}>
							<Element is={templates.Container} canvas>
								<templates.Header_A />
								<templates.Hero_A />
								<templates.Feature_A />
								<templates.Footer_A />
							</Element>
						</Frame>
					)
				}
			</Viewport>
		</Editor>
	);
};

const HomePage = ({websiteData}) => {
	return (
		<Frame data={websiteData}>
			<Element canvas>
				{/*
				<Element id="nav" is={templates.Nav_A} />
				<Element is={templates.Feature_A} />
				<Element is={templates.Footer_A} />
				*/}
			</Element>
		</Frame>
	)
};


export default App;
