import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useViewport } from './Viewport/context';
import { Fade, Stack, Box, Button, IconButton } from 'ds/components';

import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';

import {
	DeleteOutlineOutlined as DeleteIcon,
	EditOutlined as EditIcon,
	Add as AddIcon,
	ArrowDownward as DownIcon,
	ArrowUpward as UpIcon
} from '@mui/icons-material'


export const RenderNode = ({ render }) => {
	const { actions: {add, move}, query: {createNode, node}, connectors: {select} } = useEditor();
  const { actions, query, connectors } = useEditor();
  const {
    id,
    isActive,
    isHover,
    dom,
    deletable,
		isNavOrHeader
  } = useNode((node) => ({
    isActive: node.events.selected,
    isHover: node.events.hovered,
		deletable: query.node(node.id).isDeletable(), // && !(node.data.name.split('_')[0] == 'Header' || node.data.name.split('_')[0] == 'Footer'),
    dom: node.dom,
		isNavOrHeader: false // node.data.name.split('_')[0] == 'Header' || node.data.name.split('_')[0] == 'Footer'
  }));
	const { openComponentSelection, openComponentSettings } = useViewport();
  const currentRef = useRef();
	const currentNodeIndex = node('ROOT').get().data.nodes.findIndex(arrItem => arrItem == id)

	const moveUp = () => {
		const newIndex = currentNodeIndex - 1

		if(currentNodeIndex > 0) {
			move(id, 'ROOT', newIndex);
		}
	};

	const moveDown = () => {
		const newIndex = currentNodeIndex + 2

		if(currentNodeIndex < node('ROOT').get().data.nodes.length - 1) {
			move(id, 'ROOT', newIndex);
		}
	}

	// Hover/active selection indicator
  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
				dom.classList.add('component-selected')
			} else {
				dom.classList.remove('component-selected')
			};
    }
  }, [dom, isActive, isHover]);

	// Get properties of hovered div
  const getPos = useCallback((dom) => {
    const { top, left, bottom, right } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0, right: 0 };
    return {
      top: `${top}px`,
      left: `${left}px`,
			bottom: `${bottom}px`,
			height: `${bottom - top}px`,
			width: `${right - left}px`
    };
  }, []);

	// Scroll handler 
  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom]);

	// Add scroll event listenr to HTML
  useEffect(() => {
    document.addEventListener('scroll', scroll);

    return () => {
      document.removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
						<Fade in={true}>
							<div
								ref={currentRef}
								className="px-2 py-2 text-white fixed flex items-center"
								style={{
									left: getPos(dom).left,
									top: getPos(dom).top,
									zIndex: 0,
									height: getPos(dom).height,
									width: getPos(dom).width,
								}}
							>

								<Stack sx={{
									zIndex: 5,
									left: '50%',
									transform: 'translate(-50%, 50%)',
									position: 'absolute',
									bottom: 0
								}}>
									<Button
										ref={ref=>select(ref, id)}
										variant="contained"
										size="small"
										onClick={() => {
											openComponentSelection(id);
										}}
										startIcon={<AddIcon />}
									>
										Add a component
									</Button>
								</Stack>

								<Stack
									sx={{
										zIndex: 5,
										position: 'absolute',
										top: 12,
										right: 24,
										background: 'white',
										boxShadow: '0 4px 16px rgb(0 0 0 / 12%), 0 0 0 1px rgb(0 0 0 / 2%)',
										borderRadius: '8px',
										padding: '8px'
									}}
									gap={2}
									direction="row"
								>
									<IconButton
										ref={ref=>select(ref, id)}
										size="small"
										onClick={() => {
											openComponentSettings(id)
										}}
									>
										<EditIcon />
									</IconButton>


									{!isNavOrHeader ? (
										<>
										{currentNodeIndex > 0 && ( 
											<IconButton
												ref={ref=>select(ref, id)}
												size="small"
												onClick={() => {
													moveUp();
													actions.selectNode(null);
												}}
											>
												<UpIcon />
											</IconButton>
										)}
										{currentNodeIndex < node('ROOT').get().data.nodes.length - 1 && ( 
											<IconButton
												ref={ref=>select(ref, id)}
												size="small"
												onClick={() => {
													moveDown();
													actions.selectNode(null);
												}}
											>
												<DownIcon />
											</IconButton>
										)}
										</>
									) : null}

									{deletable  ? (
										<IconButton
											ref={ref=>select(ref, id)}
											size="small"
											onMouseDown={(e: React.MouseEvent) => {
												e.stopPropagation();
												actions.delete(id);
											}}
											color="error"
										>
											<DeleteIcon />
										</IconButton>
									) : null}

								</Stack>
							</div>
						</Fade>,
            document.body
          )
        : null}
      {render}
    </>
  );
};
