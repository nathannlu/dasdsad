import React from 'react';

const BAYCnav = (props) => {
	return (
		<nav className="w-full" style={{background: props.background.value}}>
					<div>
						<img style={{height: '75px'}} src={props.logo.value} />
					</div>
				</nav>
	)
};

export default BAYCnav;
