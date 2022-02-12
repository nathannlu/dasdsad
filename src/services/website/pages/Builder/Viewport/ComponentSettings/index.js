import React, { useState, useEffect } from 'react';
import { Drawer, Box, Typography } from "@material-ui/core";
import { useEditor } from '@craftjs/core';
import { useViewport } from '../context'

export const SettingsPanel = props => {
	const { isDrawerOpen, handleClose, setIsDrawerOpen, openComponentSettings } = useViewport()
	const { selected, connectors: {select} } = useEditor((state, query) => {
		const [currentNodeId] = state.events.selected.values();
		let selected;

		if (currentNodeId && state.nodes[currentNodeId]) {
			selected = {
				id: currentNodeId,
				name: state.nodes[currentNodeId].data.name,
				settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
			};
		}

		return { selected };
	})

	return selected ? (
		<Drawer anchor="right" open={isDrawerOpen} onClose={handleClose}>
			<div style={{width: '480px'}}>
				<div className="px-8 py-6">
					<h6>
						<b>
							Edit the
						</b>
						<span className="bg-gray-200 rounded-full py-1 px-3 mx-1">{selected.name}</span>
						<b>
							component
						</b>
					</h6>
				</div>
				<hr />
				<div className="px-8 py-6">
					{
						selected.settings && React.createElement(selected.settings)
					}
				</div>
			</div>
		</Drawer>
	) : null
};
