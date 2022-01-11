import React from 'react';

const Link = ({text, link}) => {
	return (
		<a href={link} class="mr-5 hover:text-gray-900">{text}</a>
	)
};

export default Link;
