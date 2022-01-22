import React, { useState, useEffect } from 'react';
import { Editor, Frame } from '@craftjs/core';
import lz from 'lzutf8';

import AllTemplates from '../blocks/main';
import { useGetWebsite } from 'gql/hooks/website.hook';
import { useWeb3 } from 'libs/web3';
import { useWebsites } from 'libs/website';

const Published = props => {
	const [json, setJson] = useState('');
	const [enabled, setEnabled] = useState(false);
	const { title, pageName } = props.match.params;
//	const title = 'test';
//	const pageName = 'home';

	const { loadWeb3 } = useWeb3();
	const { setWebsite } = useWebsite();


	useGetWebsites({
		title,
		onCompleted: (data) => {
			const website = data.getWebsite
			setWebsite(website)

			const page = website.pages.filter(page => page.pageName === pageName)

			// Decode website data;
			const base64 = page[0].pageData;
			const uint8array = lz.decodeBase64(base64);
			const json = lz.decompress(uint8array);
			setJson(json);

			setEnabled(true);
		}
	})

	/*
	useEffect(async () => {
		await loadWeb3();	
	}, [])
	*/


	return (
		<Editor 
			enabled={false}
			resolver={AllTemplates}
		>
			{ enabled && <Frame data={json} /> }
		</Editor>
	);
};

export default Published;
