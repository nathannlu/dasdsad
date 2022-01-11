import React from 'react';
import { Fade } from "@material-ui/core";

const Template = props => {
	return (
		<Fade in={true}>
			<section class="text-gray-600 body-font" style={{background: props.background.value}}>
				<div class="container px-5 py-24 mx-auto">
					<div class="text-center mb-20">
						<h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900 mb-4">{props.title.value}</h1>
						<p class="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-500s">{props.content.value}</p>
						<div class="flex mt-6 justify-center">
							<div class="w-16 h-1 rounded-full bg-indigo-500 inline-flex"></div>
						</div>
					</div>
					<div class="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
						{props.features.value.map(item => (
							<div class="p-4 md:w-1/3 flex flex-col text-center items-center">
								<div class="w-20 h-20 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-5 flex-shrink-0 overflow-hidden">
									<img src={item.image.value} />
								</div>
								<div class="flex-grow">
									<h2 class="text-gray-900 text-lg title-font font-medium mb-3">{item.title.value}</h2>
									<p class="leading-relaxed text-base">{item.content.value}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</Fade>
	)
}

export default Template;
