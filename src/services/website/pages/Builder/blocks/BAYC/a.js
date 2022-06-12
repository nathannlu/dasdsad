import React from 'react';

const BAYCa = (props) => {
	return (
		<section
			className="container mx-auto flex flex-wrap py-12 px-8"
			style={{ background: props.background.value, color: props.color.value }}>
			<div className="w-2/3 pr-32">
				<h2
					style={{
						fontStyle: 'italic',
						fontWeight: 900,
						fontSize: '28px',
					}}
					className="mb-4">
					{props.title.value}
				</h2>
				<p>
					{props.content.value}
				</p>
			</div>
			<div className="w-1/3 flex flex-wrap">
				<div className="w-1/2 p-2">
					<img src={props.image1.value} />
				</div>
				<div className="w-1/2 p-2">
					<img src={props.image2.value} />
				</div>
				<div className="w-1/2 p-2">
					<img src={props.image3.value} />
				</div>
				<div className="w-1/2 p-2">
					<img src={props.image4.value} />
				</div>
			</div>
		</section>
	);
};

export default BAYCa;
