import React, { useState, useContext } from 'react';
import { useEditor } from '@craftjs/core';

export const ViewportContext = React.createContext({})

export const useViewport = () => useContext(ViewportContext);

export const ViewportProvider = ({ children }) => {
	const [selectedNode, setSelectedNode] = useState('');		// Saves component node id to determine which node the modal was opened from
	const [isComponentSelectionOpen, setIsComponentSelectionOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);	// Component editing drawer handler	
//	const { actions } = useEditor()
	const { actions, query: {createNode, node} } = useEditor();
	const { add, move } = actions;
	

	// Handle component settings opening
	const openComponentSettings = () => {
		setIsDrawerOpen(true)	
	}	
	const handleClose = () => {
		setIsDrawerOpen(false)
		actions.selectNode(null);
	}

	// Handle component modal opening
	const openComponentSelection = selectedNodeId => {
		setSelectedNode(selectedNodeId);
		setIsComponentSelectionOpen(true);
	}
	const closeComponentSelection = () => {
		setSelectedNode(null);
		actions.selectNode(null);
		setIsComponentSelectionOpen(false);
	}

	const addComponent = (component) => {
		const nodeIndex = node('ROOT').get().data.nodes.findIndex(arrItem => arrItem == selectedNode) + 1
		const newComponent = createNode(React.createElement(component, {}));

		add(newComponent, 'ROOT');
		move(newComponent.id, 'ROOT', nodeIndex);

		// console.log('Added', newComponent.id, 'to index', nodeIndex);

		closeComponentSelection();	
	}

	return (
		<ViewportContext.Provider
			value={{
				isDrawerOpen,
				setIsDrawerOpen,
				handleClose,
				openComponentSettings,
				isComponentSelectionOpen,
				openComponentSelection,
				closeComponentSelection,
				addComponent,
			}}
		>
			{ children }
		</ViewportContext.Provider>
	)
};
