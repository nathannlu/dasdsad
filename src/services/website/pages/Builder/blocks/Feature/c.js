import React from 'react';
import { Fade } from "@material-ui/core";

const Template = props => {
	return (
		<Fade in={true}>
			<section className="text-gray-600 body-font" style={{background: props.background.value, color: props.color.value}}>
				<div className="container px-5 py-24 mx-auto flex flex-wrap">
					<div className="lg:w-2/5 w-1/2 w-full mb-10 lg:mb-0 rounded-lg overflow-hidden">
						<img alt="feature" className="object-cover object-center h-full w-full" src={props.image.value} />
					</div>
					<div className="flex flex-col flex-wrap lg:py-6 -mb-10 lg:w-3/5 lg:pl-12 lg:text-left text-center">
						<div className="flex flex-col mb-10 lg:items-start items-center">
							{props.features.value.map((item, idx) => (
								<div key={idx} className="flex-grow mb-10">
									<h2 className="sm:text-3xl text-2xl font-medium title-font mb-3">
										{item.title.value}
									</h2>
									<p className="leading-relaxed text-base">
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
