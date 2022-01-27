import React from 'react';
import { Fade } from "@material-ui/core";
import Button from '../Button';

const Template = props => {
	return (
		<Fade in={true}>
			<section className="text-gray-600 body-font" style={{background: props.background.value}}>
				<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
					<div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
						<h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
							{props.title.value}
						</h1>
						<p className="mb-8 leading-relaxed">
							{props.content.value}
						</p>
						<Button 
							text={props.button.value.text.value}
							link={props.button.value.link.value}
							isMint={props.button.value.isMint.value}
						/>
					</div>
					<div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
						<img className="object-cover object-center rounded" alt="hero" src={props.image.value} />
					</div>
				</div>
			</section>
		</Fade>
	)
}

export default Template;
