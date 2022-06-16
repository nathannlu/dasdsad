import React from 'react';

const BAYCd = (props) => {
	return (
		<section
			style={{ background: props.background.value, color: props.color.value }}>
			<div className="container mx-auto flex flex-wrap py-12 py-12 px-8">
				<div className="w-2/3">
					<h2
						style={{
							fontSize: '28px',
							fontWeight: 900,
							fontStyle: 'italic',
						}}>
						{props.title.value}
					</h2>
					<p>{props.content.value}</p>

					{props.features.value.map((item) => (
						<div className="flex my-4">
							<div style={{ width: '10%' }}>
								{item.percentage.value}
							</div>
							<div>{item.content.value}</div>
						</div>
					))}
				</div>
				<div className="w-1/3 p-16">
					<img
						className="mx-auto"
						style={{ backgroundColor: props.backgroundColor.value }}
						src={props.image.value}
					/>
				</div>
			</div>
		</section>
	);
};

export default BAYCd;
