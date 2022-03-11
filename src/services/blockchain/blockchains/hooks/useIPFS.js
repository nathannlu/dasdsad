import config from 'config';
import basePathConverter from 'base-path-converter';
import axios from 'axios'
import { useState } from 'react';
import { useContract } from 'services/blockchain/provider';
import { useToast } from 'ds/hooks/useToast';
import { useAuth } from 'libs/auth';
import { useSetCacheHash } from 'services/blockchain/gql/hooks/contract.hook';
import MD5 from 'crypto-js/md5'

export const useIPFS = () => {
	const {
		imagesUrl, setImagesUrl,
		metadataUrl, setMetadataUrl,
		ipfsUrl, setIpfsUrl,
		uploadedFiles,
		uploadedJson,
		setStart,
		setActiveStep,
		setError,
        contract,
        setCacheHash: setHash,
	} = useContract()
	const { addToast } = useToast();
	const { user } = useAuth();
	const [loading,setLoading] = useState(false)
    const [setCacheHash] = useSetCacheHash({
		onError: err => {
			addToast({
				severity: 'error',
				message: err.message
			})	
		}
	});

	const pinImages = async (callback) => {
		const folder = uploadedFiles
		setStart(true);
		setLoading(true)
		setActiveStep(0);
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const src = `./images`;

		addToast({
			severity: 'info',
			message: "Deploying images to IPFS... this may take a long time depending on your collection size"
		});

        let data = new FormData();
		for (let i = 0; i < folder.length; i++) {
			data.append('file', folder[i], `/assets/${folder[i].name}`)
		}

        //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
        //metadata is optional
        const metadata = JSON.stringify({
            name: user.id + '_assets',
        });

		data.append('pinataMetadata', metadata);

		const opt = {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url,data,opt)
			setImagesUrl(res.data.IpfsHash)
			addToast({
				severity: 'success',
				message: 'Added images to IPFS under URL: ipfs//' + res.data.IpfsHash
			})
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message
			});
			setError(true);
		}
		
		setLoading(false)
		callback()
	};

	const updateAndSaveJson = async (file, data) => {
		return new Promise((resolve, reject) => {

			if(file.name !=='metadata.json') {
				const fileReader = new FileReader();
				fileReader.onload = function ( evt ) {
					// Parse JSON and modify
					const jsonMetadata = JSON.parse(evt.target.result)
					const tokenId = file.name.split('.')[0]

					if(jsonMetadata.properties?.files && jsonMetadata.properties?.files[0]?.type == 'image/webp') {
						jsonMetadata.image = contract.blockchain.indexOf('solana') != -1 ? `https://gateway.pinata.cloud/ipfs/${imagesUrl}/${tokenId}.webp` : `ipfs://${imagesUrl}/${tokenId}.webp`
						
					} else {
						jsonMetadata.image = contract.blockchain.indexOf('solana') != -1 ? `https://gateway.pinata.cloud/ipfs/${imagesUrl}/${tokenId}.png` : `ipfs://${imagesUrl}/${tokenId}.png`
					}

					// Attach JSON to formdata
					const metadataFile = new Blob([JSON.stringify(jsonMetadata)])
					data.append('file', metadataFile, `/metadata/${tokenId}.json`)

					resolve(data)
				};
				fileReader.readAsText(file);

			} else {
				data.append('file', file, '/metadata/metadata.json')
				resolve(data)
			}
		})
	}

    const createCacheContent = async (metadataToken) => {
       try {
            console.log('Creating cache content')
            let cacheContent = [];
            const folder = uploadedJson;
            folder.forEach((file, idx) => {
                cacheContent.push({
                    'mint_num': idx + 1,
                    "uri": `https://gateway.pinata.cloud/ipfs/${metadataToken}`
                })
            })
            const hash = MD5(cacheContent).toString();
            console.log('cacheContent Hash:', hash, contract.id);
            setHash(hash);
            await setCacheHash({ variables: { id: contract.id, cacheHash: hash } });
       }
       catch (err) {
            console.log(err);
            addToast({
                severity: 'error',
                message: e.message 
            });
       }
    }

	const pinMetadata = async (callback) => {
		const folder = uploadedJson;
        let data = new FormData();
		const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
		setLoading(true)

		addToast({
			severity: 'info',
			message: "Deploying metadata to IPFS... this may take a long time depending on your collection size"
		});

		// Update metadata
		for (let i = 0; i < folder.length; i++) {
			await updateAndSaveJson(folder[i], data);
		}

        const metadata = JSON.stringify({
            name: user.id + '_metadata',
        });

		data.append('pinataMetadata', metadata);

		const opt = {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
				'pinata_api_key': config.pinata.key,
				'pinata_secret_api_key': config.pinata.secret
			}
		}

		try {
			const res = await axios.post(url, data, opt)
			addToast({
				severity: 'success',
				message: 'Added json metadata to IPFS under URL: ipfs://' + res.data.IpfsHash
			})
            console.log('Json Metadata: ', res.data.IpfsHash);
            await createCacheContent(res.data.IpfsHash);
			setIpfsUrl('ipfs://' + res.data.IpfsHash + '/');
			setMetadataUrl(res.data.IpfsHash);
		} 
        catch(e) {
			addToast({
				severity: 'error',
				message: e.message 
			});
        };
	
		setLoading(false)
		callback();
	}


	return {
		pinMetadata,
		pinImages,
		loading
	}
}
