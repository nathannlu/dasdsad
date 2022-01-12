import React from 'react';
import { Fade } from "@material-ui/core";
import Button from '../Button';

const Template = props => {
	return (
		<Fade in={true}>
			<section class="text-gray-600 body-font" style={{background: props.background.value}}>
				<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
					<div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
						<img class="object-cover object-center rounded" alt="hero" src={props.image.value} />
					</div>
					<div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
						<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
							{props.title.value}
						</h1>
						<p class="mb-8 leading-relaxed">
							{props.content.value}
						</p>
						<div class="flex justify-center">
							<Button 
								text={props.button.value.text.value}
								link={props.button.value.link.value}
								isMint={props.button.value.isMint.value}
							/>
						</div>
					</div>
				</div>
			</section>
		</Fade>
	)
}

export default Template;
