import React from 'react';

const BAYCc = (props) => {
	return (
		<div style={{backgroundColor: props.background.value}}>
			<section
				className="container mx-auto flex flex-wrap"
				style={{
					backgroundColor: props.background.value,
					color: props.color.value,
				}}
				className="w-full flex flex-wrap py-8 items-center">
				<div className="w-1/3 text-center">
					<h3
						style={{
							fontSize: '28px',
							fontWeight: 900,
							fontStyle: 'italic',
						}}>
						{props.title.value}
					</h3>
				</div>
				<div className="w-1/3">
					<p>
						{props.content.value}
					</p>
				</div>
				<div className="w-1/3 text-center">
					<button
						style={{
							padding: '16px',
							borderRadius: '8px',
							backgroundColor: '#000',
							color: props.buttonColor.value,
							fontWeight: 600,
							textTransform: 'uppercase',
						}}>
						{props.buttonText.value}
					</button>
				</div>
			</section>
		</div>
	);
};

export default BAYCc;
