import React from 'react';

const BAYCfooter = (props) => {
	return (
		<footer className="px-8 py-8" style={{background: props.background.value}}>
								<hr style={{background: 'white'}} />
								<div className="flex flex-wrap items-center">
									<div className="text-left" style={{width: '180px'}}>
										<img src={props.logo.value} />
									</div>

									<div className="ml-auto text-right">
										<small>
											{props.copyright.value}
										</small>
									</div>
								</div>
							</footer>
	)
};

export default BAYCfooter;
