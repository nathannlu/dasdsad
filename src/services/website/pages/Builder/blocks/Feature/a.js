import React from 'react';
import { Fade } from "@material-ui/core";

const Template = props => {
	return (
		<Fade in={true}>
			<section className="text-gray-600 body-font" style={{ background: props.background.value }}>
				<div className="container px-5 py-24 mx-auto">
					<h1 className="sm:text-3xl text-2xl font-medium title-font text-center text-gray-900 mb-20">
						{props.title.value}
					</h1>

					<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4 md:space-y-0 space-y-6">
						{props.features.value.map((feature, idx) => (
							<div key={idx} className="p-4 md:w-1/3 flex">
								<div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4 flex-shrink-0">
									<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
									</svg>
								</div>
								<div className="flex-grow pl-6">
									<h2 className="text-gray-900 text-lg title-font font-medium mb-2">{feature.title.value}</h2>
									<p className="leading-relaxed text-base">
										{feature.content.value}
									</p>
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
