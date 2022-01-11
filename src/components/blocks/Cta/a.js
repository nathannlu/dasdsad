import React from 'react';
import { Fade } from "@material-ui/core";
import Button from '../Button';

const Template = props => {
	return (
		<Fade in={true}>
			<section class="text-gray-600 body-font" style={{ background: props.background.value }}>
				<div class="container px-5 py-24 mx-auto">
					<div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
						<h1 class="flex-grow sm:pr-16 text-2xl font-medium title-font text-gray-900">{props.title.value}</h1>
						<Button 
							text={props.button.value.text.value}
							link={props.button.value.link.value}
							isMint={props.button.value.isMint.value}
						/>
					</div>
				</div>
			</section>
		</Fade>
	)
};

export default Template;
