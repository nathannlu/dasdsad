import React, { useState, useEffect, useContext } from 'react';
import uuid from 'react-uuid';
import { Snackbar, Alert } from '../components';

export const ModalContext = React.createContext({});

export const useModal = (data) => useContext(ModalContext)

import { Modal, Box, Button, IconButton, Stack } from 'ds/components';
import CloseIcon from '@mui/icons-material/Close';

export const ModalManager = (props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [modalStyles, setModalStyles] = useState({});

	const createModal = (data, styles) => {

		const setIsModalOpenA = (value) => {
			if(styles) setModalStyles(styles)
			setModalData(data)
			setIsModalOpen(true)
		}

		const toggleModal = () => {
			setIsModalOpen(!isModalOpen);
		}

		return [isModalOpen, setIsModalOpenA, toggleModal];
	}

	return (
		<ModalContext.Provider
			value={{ createModal }}
		>
			{props.children}
			<Modal
				open={isModalOpen}
				onClose={()=>setIsModalOpen(false)}
				sx={{
					overflow: 'auto',
					alignItems: 'center',
					display: 'flex',
					zIndex: 5000,
					...modalStyles
				}}>
				<Box
					p={3}
					pt={1}
					sx={{
						width: '1200px',
						margin: '0 auto',
						background: '#fff',
						borderRadius: '10px',
					}}>
					<Stack>
						<IconButton sx={{ ml: 'auto' }}>
							<CloseIcon onClick={() => setIsModalOpen(false)} />
						</IconButton>
					</Stack>
					{modalData && modalData}
				</Box>
			</Modal>
		</ModalContext.Provider>
	)
};
