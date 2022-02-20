import React, { useEffect } from 'react';
import { Fade } from "@material-ui/core";
import { useWeb3 } from 'libs/web3';
import Button from '../Button';

const Template = props => {
	const { loadWeb3, loadBlockchainData, account, mint } = useWeb3();
	useEffect(() => {
		(async () => {
			await loadWeb3()
			await loadBlockchainData()
		})()
	}, [])

	return (
		<Fade in={true}>
			<section className="text-gray-600 body-font" style={{background: props.background.value, color: props.color.value}}>
				<div className="container px-5 py-24 mx-auto">
					<div className="flex flex-col text-center w-full mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4">{props.title.value}</h1>
						<p className="lg:w-2/3 mx-auto leading-relaxed text-base">
							{props.description.value}
						</p>
					</div>
					<div className="flex flex-wrap">
						{props.content.value.map((item, idx) => (
							<div key={idx} className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
								<h2 className="text-lg sm:text-xl font-medium title-font mb-2">{item.title.value}</h2>
								<p className="leading-relaxed text-base mb-4">
									{item.content.value}
								</p>
							</div>
						))}
					</div>
					<div className="flex mt-16 justify-center">
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
