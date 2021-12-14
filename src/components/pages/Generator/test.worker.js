
const workercode = () => {
	self.onmessage = async (event) => { // eslint-disable-line no-restricted-globals
		self.postMessage('hi') // eslint-disable-line no-restricted-globals
		
		self.importScripts("./scripts/generatetest.js"); // eslint-disable-line no-restricted-globals

		if (event && event.data && event.data.msg === 'generate') {
//			self.postMessage("Generating...");
			const generatedImages = await self.generateImages(event.data.layers, event.data.count); // eslint-disable-line no-restricted-globals


			self.postMessage(generatedImages); // eslint-disable-line no-restricted-globals
//			self.postMessage("Done!");
		}
	};
};

let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;

