import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useMetadata } from 'core/metadata';
import { useLayerManager } from 'core/manager';
import FileSaver from 'file-saver';
import JSZip from 'jszip';

import Worker from "components/pages/Generator/workers/generator.worker.js";
import VideoWorkerWorker from "components/pages/Generator/workers/generator.worker.js";
import VideoWorker from 'components/pages/Generator/workers/video.worker.js';
const worker = new Worker();
const videoWorker = new VideoWorker();


export const useGenerator = () => {
	const { settingsForm } = useMetadata();
	const { query: { layers }} = useLayerManager();
	const { name, description, collectionSize } = settingsForm;
	const { addToast } = useToast()

	const [done, setDone] = useState(false);
	const [progress, setProgress] = useState(0);
	const [zipProgress, setZipProgress] = useState(null);
	const [generatedZip, setGeneratedZip] = useState('');


	// This will need to talk to web worker
	const generateImages = async () => {
		setDone(false);
		setProgress(null);
		setZipProgress(null);

		// Runs check
		if(validateForm()) {
			worker.postMessage({
				message:'generate',
				settings: {
					name: name.value,
					description: description.value
				},
				layers: [...layers],
				count: collectionSize.value
			})

			addToast({
				severity: 'info',
				message: 'Generating collection. This will take a some time...'
			})
		}
	};

	const save = () => {
		FileSaver.saveAs(generatedZip, 'sample.zip')
	}


	const validateForm = () => {
		if (collectionSize.value.length < 1) {
			addToast({
				severity: 'error',
				message: 'Collection Size value cannot be left empty'
			})
			return false;
		}
		for(let i = 0; i < layers.length; i++) {
			if(layers[i].images.length == 0) {
				addToast({
					severity: 'error',
					message: `Layer '${layers[i].name}' cannot have 0 traits. Please add a trait or remove the layer`
				});
				return false;
			}
		}
		return true;
	}



	// @TODO Refactor
	const readFileAsBufferArray = file => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function() {
        resolve(this.result);
      };
      fileReader.onerror = function() {
        reject(this.error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };
	const mergeImageVideo = async (totalMemory = 33554432) => {
		const raw1 = layers[0].images[0].file;
		const raw2 = layers[1].images[0].file
		const file1 = {
			name: 'input.mp4',
			data: new Uint8Array(await readFileAsBufferArray(raw1))
		}
		const file2 = {
			name: 'image.png',
			data: new Uint8Array(await readFileAsBufferArray(raw2))
		}

		videoWorker.postMessage({
			type: 'command',
			files: [file1, file2],
			arguments: [
//				'-y',
				'-i', 'input.mp4',
				'-i', 'image.png',
				'-filter_complex',"overlay=25:25:enable='between(t,0,20)'",
				'-pix_fmt','yuv420p','-c:a','copy',
				'output.mp4'
			],
			totalMemory: 1073741824
		})
		
	}

	const listenToWorker = () => {
		videoWorker.onmessage = function (event) {
			var message = event.data;
			if (message.type == "ready") {
				console.log('loaded')

			} else if (message.type == "stdout") {
				console.log('output', message.data)
			} else if (message.type == "done") {
				console.log(message.data)

				var blob = new Blob([message.data[0].data])
				const src = window.URL.createObjectURL(blob)
				setDownloadSrc(src)


			} else if (message.type == "start") {
				console.log("Worker has received command")
			}
		};
		worker.onmessage = (message) => {
			if (message.data.message == 'output') {
				setGeneratedZip(message.data.content);

				addToast({
					severity: 'success',
					message: 'Finished generation!'
				})
				setDone(true);
			}
			
			if (message.data.message == 'progress') {
				setProgress(message.data.progress)
			}
			if (message.data.message == 'zip_progress') {
				setZipProgress(message.data.zipProgress)
			}
		}
	}
	


	return {
		listenToWorker,
		save,
		validateForm,
		generateImages,
		done,
		progress,
		zipProgress
	}
}
