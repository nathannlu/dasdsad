import React from 'react';

const BAYChero = (props) => {
	return (
		<header className="container mx-auto" style={{background: props.background.value}}>
			<img src={props.image.value} />
		</header>


	)
};

export default BAYChero;
