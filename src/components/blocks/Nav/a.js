import React from 'react';
import { Fade } from "@material-ui/core";
import Button from '../Button';
import Link from '../Link';

const Template = props => {
	return (
		<Fade in={true}>
			<header class="text-gray-600 body-font" style={{background: props.background.value}}>
				<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
					<a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
						<img src={props.logo.value} />
					</a>
					<nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
						{props.links?.value.map((item, i) => (
							<Link
								text={item.link.value.text.value}
								link={item.link.value.link.value}
							/>
						))}
					</nav>
					<Button 
						text={props.button.value.text.value}
						link={props.button.value.link.value}
						isMint={props.button.value.isMint.value}
					/>
				</div>
			</header>
		</Fade>
	)
};

export default Template;
