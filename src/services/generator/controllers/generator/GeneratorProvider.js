import React, { useState, useEffect, useRef } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { GeneratorContext } from './GeneratorContext';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useLayerManager } from 'services/generator/controllers/manager';
import MD5 from 'crypto-js/md5';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import posthog from 'posthog-js';

const zip = new JSZip();

export const GeneratorProvider = ({children}) => {
	const [renderModalState, setRenderModalState] = useState(false);
	const [downloadModalState, setDownloadModalState] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [renderIndex, setRenderIndex] = useState(1);
	const [collectionMetadata, setCollectionMetadata] = useState([]);
	const [imageDimension, setImageDimension] = useState({});
	const [autoSaveCount, setAutoSaveCount] = useState(0);
	const [isAutoSave, setIsAutoSave] = useState(false);
	const { settingsForm, creators, metadataType } = useMetadata();
	const { query: { layers }} = useLayerManager();
	const { name, description, size, symbol, externalUrl, sellerFeeBasisPoints } = settingsForm;
	const { addToast } = useToast();
	const canvasRef = useRef();

	// Get weighted random image index
	const getLayerImageIndex = (layer) => {
        let weights = [];
        layer.images.forEach((image, idx) => {
            weights.push(parseInt(image.rarity.percentage) + (weights[idx - 1] || 0));
        });
        const random = Math.random() * layer.images[0].rarity.max;
		let randomIndex = 0;
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] > random) {
				randomIndex = i;
                break;
            }
        }     
        return randomIndex;
    }

	// Draws image on canvas
	const drawOnCanvas = (ctx, layer) => {
        return new Promise(resolve => {
            try {
				const randomIndex = getLayerImageIndex(layer);
				const newAttribute = {
					trait_type: layer.name,
					value: layer.images[randomIndex].name
				}
				ctx.drawImage(layer.images[randomIndex].image, 0, 0, imageDimension.width, imageDimension.height);
				resolve(newAttribute);
			}
			catch (err) {
				console.log('drawOnCanvas', err);
			}
        })
    }

	// Stack all layers together
    const stackLayers = (ctx) => {
        return Promise.all(
            layers.map((layer) => {
                return drawOnCanvas(ctx, layer)
                .then(res => {
                    return res;
                });
            })
        )
    }

	// Save the canvas to zip
	const saveCanvas = (curRenderIndex) => {
        return new Promise((resolve, reject) => {
            canvasRef.current.toBlob((blob) => {
                zip.folder("Images").file(`${curRenderIndex}.png`, blob);
                resolve();
            });
        })
    }

	// Auto save chunks
	const autoSave = (chunkCount) => {
        return new Promise(async (resolve, reject) => {
            try {
                const content = await zip.generateAsync({
                    type: "blob",
                    streamFiles: true
                }, (data) => {
					setAutoSaveCount(data.percent.toFixed(2));
                })
                saveAs(content, `Ambition Image Chunk ${chunkCount}.zip`);
                zip.remove("Images");
                resolve();
            }
            catch (e) {
                console.log(e);
                reject();
            }
        })
    }

	// Waits for canvasRef.current to load (I have to wait cuz canvas is inside the dialog)
	// please change this i dont like it hahahah, i cant think of a way to wait for the current key
	const getCanvas = () => {
		return new Promise((resolve, reject) => {
			const waitForCurrentShit = () => {
				if (canvasRef.current) return resolve(canvasRef.current);
				setTimeout(waitForCurrentShit, 30);
			}
			waitForCurrentShit();
		});
	}

	// Generate the unique images
	const generateImages = async () => {
		try {
			if (!validateForm()) return;

			console.log('[Ambition] Generating NFT Collection');

			setRenderModalState(true);

			const canvas = await getCanvas();
			const ctx = canvas.getContext("2d");

			zip.remove("Metadata");
			zip.remove("Images");

			let chunkCount = 1;
			let curRenderIndex = 1;
			let hashList = [];
			let curMetadata = [];

			setIsFinished(false);
			setIsAutoSave(false);
			setIsGenerating(true);
			setCollectionMetadata([]);

			let t0 = performance.now();
			let t1;

			while (curRenderIndex - 1 != size.value) {
				setRenderIndex(curRenderIndex);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				const attributes = await stackLayers(ctx);
				const currentHash = MD5(JSON.stringify(attributes)).toString();
				if (!hashList.includes(currentHash)) {
					hashList.push(currentHash);
					await saveCanvas(curRenderIndex);
					if (size.value >= 1000 && (curRenderIndex == size.value || curRenderIndex % 1000 == 0)) {
						setIsAutoSave(true);
						setIsDownloading(true);
						await autoSave(chunkCount++);
						setIsDownloading(false);
					}
					let nftJson = {
						name: `${name.value} #${curRenderIndex}`,
						description: description.value,                
						image: `${curRenderIndex}.png`,
						edition: renderIndex,
						attributes: attributes,
						compiler: "https://ambition.so/"
					}
					if (metadataType === "sol") {
						nftJson = {
							name: nftJson.name,
							symbol: symbol.value,
							description: nftJson.description,
							seller_fee_basis_points: sellerFeeBasisPoints.value,
							image: `${curRenderIndex}.png`,
							external_url: `${externalUrl.value}${curRenderIndex}.png`,
							edition: nftJson.edition,
							attributes: nftJson.attributes,
							properties: {
								category: "image",
								files: [
									{
										uri: `${curRenderIndex}.png`,
										type: "image/png"
									}
								],
								creators: creators
							},
							compiler: "https://ambition.so/"
						}
					}
					curMetadata.push(nftJson);
					curRenderIndex++;
					if (curRenderIndex - 1 === size.value) {
						setCollectionMetadata(curMetadata);
						setRenderModalState(false);
						setIsGenerating(false);
						setIsFinished(true);
						t1 = performance.now();
						console.log(`[Ambition] It took ${t1 - t0} milliseconds to generate this collection.`);
						posthog.capture('User finished generating collection');
					}
				}
			}
		}
		catch (err) {
			console.log(err);
		}
	};

	// Download collection including images and metadata
	const downloadCollection = async () => {
		try {
			if (!collectionMetadata.length) throw new Error('Please generate your collection first');

			setDownloadModalState(true);
			setIsDownloading(true);

			let fileIndex = 1;

			zip.folder("Metadata").file("metadata.json", JSON.stringify(collectionMetadata, null, 2));

			collectionMetadata.forEach(data => {
				zip.folder("Metadata").file(`${fileIndex}.json`, JSON.stringify(data, null, 2));
				fileIndex++;
			});

			const content = await zip.generateAsync({
				type: "blob",
				streamFiles: true
			}, (data) => {
				setAutoSaveCount(data.percent.toFixed(2));
			})

			saveAs(content, "Ambition.zip");
			setIsDownloading(false);
            setDownloadModalState(false);

			posthog.capture('User downloaded collection');
		}
		catch (err) {
			console.log(err);
			addToast({
				severity: 'error',
				message: err.message
			})
		}
	}

	// Download json metadata (this is only called if autosave is true)
	const generateJSONMetadata = async () => {
		try {
			if (!collectionMetadata.length) throw new Error('Please generate your collection first');

			setDownloadModalState(true);
			setIsDownloading(true);

			let fileIndex = 1;

			zip.remove("Images"); // delete images first

			zip.folder("Metadata").file("metadata.json", JSON.stringify(metadata, null, 2));

			metadata.forEach(data => {
				zip.folder("Metadata").file(`${fileIndex}.json`, JSON.stringify(data, null, 2));
				fileIndex++;
			});

			const content = await zip.generateAsync({
				type: "blob",
				streamFiles: true
			}, (data) => {
				setAutoSaveCount(data.percent.toFixed(2));
			})

			saveAs(content, "Ambition.zip");
			setIsDownloading(false);
            setDownloadModalState(false);

			posthog.capture('User generated json metadata');
		}
		catch (err) {
			console.log(err);
			addToast({
				severity: 'error',
				message: err.message
			})
		}
	}

	const validateForm = () => {
		try {
			if (size.value.length < 1) throw new Error('Collection Size value cannot be left empty');

			layers.forEach((layer) => {
				if (layer.images.length == 0) throw new Error(`Layer '${layer.name}' cannot have 0 traits. Please add a trait or remove the layer`);
			})

			if(layers[0].images[0].image.naturalWidth <= 0 || layers[0].images[0].image.naturalHeight <= 0)  {
				throw new Error("Image width or length must be greater than 0");
			}

			let possibleCombination = 1;
			layers.forEach((layer) => {
				const imgSize = layer.images.length;
				possibleCombination *= imgSize;
			})

			if (possibleCombination < size.value) {
				throw new Error(`Possible combination is under the desired collection count (${possibleCombination}/${size.value})`);
			}

			return true;
		}
		catch (err) {
			addToast({
				severity: 'error',
				message: err.message
			})
		}

		return false;
	}

	const value = {
		canvasRef,
		renderModalState,
		isGenerating,
		imageDimension,
		collectionMetadata,
		autoSaveCount,
		renderIndex,
		isDownloading,
		isFinished,
		downloadModalState,
		isAutoSave,

		validateForm,
		generateImages,
		setRenderModalState,
		setIsGenerating,
		setImageDimension,
		generateJSONMetadata,
		setDownloadModalState,
		downloadCollection,
	}
		
	return (
		<GeneratorContext.Provider value={value}>
			{children}
		</GeneratorContext.Provider>
	)
}
