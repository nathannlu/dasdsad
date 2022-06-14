import React from 'react';

const BAYChero = (props) => {
	return (
		<header style={{background: props.background.value}}>
			<div className="container mx-auto">
				<img src={props.image.value} />
			</div>
		</header>


	)
};

export default BAYChero;
