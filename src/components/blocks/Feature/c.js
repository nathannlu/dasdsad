import React from 'react';
import { Fade } from "@material-ui/core";

const Template = props => {
	return (
		<Fade in={true}>
			<section class="text-gray-600 body-font" style={{background: props.background.value}}>
				<div class="container px-5 py-24 mx-auto flex flex-wrap">
					<div class="lg:w-2/5 w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
						<img alt="feature" class="object-cover object-center h-full w-full" src={props.image.value} />
					</div>
					<div class="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-3/5 lg:pl-12 lg:text-left text-center">
						<div class="flex flex-col mb-10 lg:items-start items-center">
							{props.features.value.map((item, i) => (
								<div class="flex-grow mb-10">
									<h2 class="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-3">
										{item.title.value}
									</h2>
									<p class="leading-relaxed text-base">
										{item.content.value}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</Fade>
	)
}

export default Template;
