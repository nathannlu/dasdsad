import React from 'react';

const BAYCb = (props) => {
	
	return (
										<section className="container mx-auto py-12 px-8 flex flex-wrap" style={{ background: props.background.value }}>
														
									<div className="mb-4 w-full">
										<h2 style={{color: props.titleColor.value, fontWeight: 500, fontStyle: 'italic', fontSize: '24px'}}>
											{props.title.value}
										</h2>
										<h3 style={{color: props.paragraphColor.value}}>
											{props.subtitle.value}
										</h3>
									</div>
									<div className="w-1/2">
										<p style={{color: props.paragraphColor.value}}>
											{props.contentA.value}
										</p>
									</div>
									<div className="w-1/2 pl-4">
										<p style={{color: props.paragraphColor.value}}>
											{props.contentB.value}
										</p>
									</div>
								</section>
	)
};

export default BAYCb
