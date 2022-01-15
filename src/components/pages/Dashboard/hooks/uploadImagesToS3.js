import React from 'react';

export const useUploadImagesToS3 = () => {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

	const uploadImages = folder => {
		const src = './images';
    let data = new FormData();

		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], basePathConverter(src, folder[i].path))
		}
		
	}

	
	return {
		
	}
};

