import React from 'react';
import { Fade } from "@material-ui/core";

const Template = props => {
	return (
		<Fade in={true}>
			<section className="text-gray-600 body-font" style={{background: props.background.value}}>
				<div className="container px-5 py-24 mx-auto">
					<div className="flex flex-wrap w-full mb-20">
						<div className="lg:w-1/2 w-full mb-6 lg:mb-0">
							<h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{props.title.value}</h1>
							<div className="h-1 w-20 bg-indigo-500 rounded"></div>
						</div>
						<p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
							{props.description.value}
						</p>
					</div>
					<div className="flex flex-wrap -m-4">
						{props.content.value.map((item, i) => (
							<div key={i} className="xl:w-1/4 md:w-1/2 p-4">
								<div className="bg-gray-100 p-6 rounded-lg">
									<img className="h-40 rounded w-full object-cover object-center mb-6" src={item.image.value} alt="content" />
									<h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">{item.subtitle.value}</h3>
									<h2 className="text-lg text-gray-900 font-medium title-font mb-4">{item.title.value}</h2>
									<p className="leading-relaxed text-base">{item.content.value}</p>
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
