import React, { useState, useEffect } from 'react';
import { useBuilder } from './hooks/useBuilder';
import lz from 'lzutf8';
import { Box } from 'ds/components';
import { Editor, Frame, Element } from '@craftjs/core';
import { useWebsite } from 'services/website/provider';
import templates from './blocks/main';
import { useGetWebsites } from 'services/website/gql/hooks/website.hook';
import Viewport from './Viewport';
import { RenderNode } from './RenderNode';
import './tailwind.css';

const App = (props) => {
    const [websiteData, setWebsiteData] = useState('');
    const [enabled, setEnabled] = useState(false);
    const [page, setPage] = useState({});
    const { website, setWebsite, websites, removeUnusedImages, updateOldWebsites } = useWebsite();
    const { title, pageName } = props.match.params; // Used to query DB for page data



    // Update old websites
    useEffect(() => {
        if (website && !Object.keys(website).length > 0) return;
        const update = async () => {
            await updateOldWebsites();
        };
        update();
			console.log(website)
    }, [website, websites]);

    // Load website data on load
    useEffect(() => {
        const w = websites.find((website) => website.title == title);
			console.log(w)
				setWebsite(w)

        if (w && !Object.keys(w).length > 0) return;
        const page = w?.pages?.find((page) => page.name == pageName);
        setPage(page);

        const base64 = page?.data;
        if (base64 !== undefined) {
            const uint8array = lz.decodeBase64(base64);
            const json = lz.decompress(uint8array);

            removeUnusedImages(json);

            setWebsiteData(json);
            setEnabled(true);
        }
    }, [websites]);

    return (
        <Editor onRender={RenderNode} resolver={templates}>
            <Viewport page={page}>
                {enabled && (
                    <Frame data={websiteData}>
													<Element is={templates.Container} canvas>
			<templates.Header_A />
			<templates.Hero_A />
			<templates.Feature_A />
			<templates.Footer_A />
		</Element>
                    </Frame>
                )}
            </Viewport>
        </Editor>
    );
};

const BlankStarter = () => {
	return (
		<Element is={templates.Container} canvas>
			<templates.Header_A />
			<templates.BAYC />
			<templates.Hero_A />
			<templates.Feature_A />
			<templates.Footer_A />
		</Element>
	)	
};

const BAYCStarter = () => {
	return (
		<Element is={templates.Container} canvas>
			<templates.Header_A />
			<templates.Hero_B />
			<templates.Feature_A />
			<templates.Footer_A />
		</Element>
	)
};

export default App;
