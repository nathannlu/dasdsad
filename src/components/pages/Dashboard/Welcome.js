import React, { useState, useEffect } from 'react';
// import TemplateShowcase from '../../molecules/TemplateShowcase';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { useAuth } from 'libs/auth';
import { useWebsite } from 'libs/website';
import { useCreateWebsite } from 'gql/hooks/website.hook';
import { Box, Button, Typography, Grid, Container } from 'ds/components';

const Welcome = props => {
	const [newWebsite, setNewWebsite] = useState({title: 'test'});
	const { website } = useWebsite();
	const [createWebsite] = useCreateWebsite({
		title: newWebsite.title,
		onCompleted: data => {
			return <Redirect to="/dashboard" />
		}
	})

	useEffect(() => {
		const hasWebsite = Object.keys(website).length !== 0;
		if (hasWebsite) {
			return <Redirect to="/dashboard" />
		}
	}, [])

	return (
		<div>
			<div className="w-full" style={{backgroundColor: '#eee'}}>
				<div className="w-2/5 mx-auto flex flex-wrap space-x-2">
					<div active>Sign up</div>
					<div active>Set up </div>
					<div>Build</div>
				</div>

				<div className="w-1/3 py-24 mx-auto">
					<h1>
						Create your new website	
					</h1>
					<p>
						Based on your answers, we recommend either of the following starting points:
					</p>
				</div>
			</div>

			<div className="w-2/3 mx-auto flex flex-wrap space-x-8 py-32">
				<button onClick={() => createWebsite()}>
					new website
				</button>
				{/*
				<TemplateShowcase
					src="https://d3e54v103j8qbb.cloudfront.net/template-assets/5c75aacdf20430c74e511659/thumbnails/1558042197606_undefined"
					onClick={() => createWebsite() }
				>
					<h3 className="mb-3">
						Real Estate Starter
					</h3>
					<p>
						Build a unique and professional website for your business in no time. Customize the team, work, blog, and contact pages to match your brand — and set your business apart.
					</p>
				</TemplateShowcase>

				<TemplateShowcase
					src="https://uploads-ssl.webflow.com/5cdaceba136d188604d0c7da/5ce306e4927f1aeb21e93ac6_blank-page-thumbnail.svg"
					onClick={() => props.history.push('/builder')}
				>
					<h3 className="mb-3">
						AI Generated
					</h3>
					<p>
						Let Agentsquare generate you a website — then customize to your liking.
					</p>
				</TemplateShowcase>
				*/}
			</div>
		</div>
	)
};

export default Welcome;
