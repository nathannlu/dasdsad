import React from 'react';

const Preview = (props) => {
	
	return (
		<div>
			<div>
				Host your own images
			</div>
			<div>
				Upload your images on our Decentralized network

				<small>
					$19.99/mo
				</small>

				<button onClick={props.nextStep}>
					Next
				</button>
			</div>
		</div>
	)
};

export default Preview;
