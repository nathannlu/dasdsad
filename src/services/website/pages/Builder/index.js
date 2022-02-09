import React, {useState, useEffect} from 'react';
import lz from 'lzutf8';
import { Box } from 'ds/components';
import { Editor, Frame, Element } from '@craftjs/core';
import { useWebsite } from 'services/website/provider';
import templates from './blocks/main';
import { useGetWebsites } from 'services/website/gql/hooks/website.hook';
import Viewport from './Viewport';
import { RenderNode } from './RenderNode';
import './tailwind.css';

const App = props => {
	const [websiteData, setWebsiteData] = useState('');	
	const [enabled, setEnabled] = useState(false);
	const [page, setPage] = useState({});
	const { website, removeUnusedImages, updateOldWebsites } = useWebsite();
	const { pageName } = props.match.params; // Used to query DB for page data

    // Update old websites
    useEffect(() => {
        if(!Object.keys(website).length > 0) return;
        const update = async () => {
            if (website.seo) return;
            await updateOldWebsites();
        }
        update();
    }, [website])

	// Load website data on load
	useEffect(() => {
		if(!Object.keys(website).length > 0) return;
		const page = website?.pages?.find(page => page.name == pageName);
        setPage(page);

        const base64 = page.data
        if (base64 !== undefined) {
            const uint8array = lz.decodeBase64(base64);
            const json = lz.decompress(uint8array);
            
            removeUnusedImages(json);

            setWebsiteData(json);
            setEnabled(true);
        }
	}, [website]);

	return (
			<Editor
				onRender={RenderNode}
				resolver={templates}
			>
				<Viewport page={page}>
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


export default App;
