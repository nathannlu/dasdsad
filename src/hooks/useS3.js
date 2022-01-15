import React from 'react';
import { useSingleUpload } from 'gql/hooks/collection.hook';

export const useS3 = () => {
	const [singleUpload] = useSingleUpload({})

	const uploadImages = folder => {
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const src = './images';

		/*
    let data = new FormData();
		for (let i = 0; i < folder.length; i++) {

			data.append('file', folder[i])
//			data.append('file', folder[i], basePathConverter(src, folder[i].path))
		}
		*/

		// Upload
		console.log(folder[0])

		singleUpload({ variables: {files: folder}})
		
	}


	
	return {
		uploadImages	
	}
};

