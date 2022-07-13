import React, { useState, useEffect, useContext } from 'react';

export const ModalContext = React.createContext({});
export const useModal = (data) => useContext(ModalContext)

import { Modal, Box, Button, Stack, IconButton, Typography, Divider } from 'ds/components';
import { AppBar, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ModalAppbar = ({ onClose, variant, title }) => {
	if (variant === 'contained') {
		return (
			<AppBar
				position="fixed"
				sx={{
					bgcolor: 'grey.100',
					py: 2,
					boxShadow: 'none',
					borderBottom: '1px solid rgba(0,0,0,.2)',
					color: '#000',
				}}
			>
				<Stack direction="row" px={2} gap={2} alignItems="center">
					<IconButton
						edge="start"
						color="inherit"
						onClick={onClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>

					{title && <React.Fragment>
						<Divider
							sx={{ height: '20px', borderWidth: 0.5 }}
							orientation="vertical"
						/>
						<Box>
							<Typography variant="body">
								{title}
							</Typography>
						</Box>
					</React.Fragment> || null}
				</Stack>
			</AppBar>
		);
	}

	return (
		<Stack>
			<IconButton sx={{ ml: 'auto' }}>
				<CloseIcon onClick={onClose} />
			</IconButton>
		</Stack>
	)
}

const DEFAULT_SETTINGS = {
	styles: {},
	isLoading: false,
	fullScreen: false,
	title: null
}

export const ModalManager = (props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [modalSettings, setModalSettings] = useState(DEFAULT_SETTINGS);

	const createModal = (data, settings) => {

		const openModal = (newData) => {
			setModalSettings(prevState => ({ ...settings }));
			setModalData(newData || data);
			setIsModalOpen(true);
		}

		const closeModal = () => {
			setIsModalOpen(false);
		}

		return [isModalOpen, openModal, closeModal];
	}

	const fullScreenStyles = modalSettings?.fullScreen && {
		position: 'fixed',
		inset: 0,
		width: '100vw',
		height: '100vh',
		maxWidth: '100vw',
		maxHeight: '100vh',
		borderRadius: 0
	} || {};

	return (
		<ModalContext.Provider
			value={{
				createModal,
				setModalSettings: (settings) => setModalSettings(prevState => ({ ...prevState, ...settings })),
				setModalData
			}}
		>
			{props.children}
			<Modal
				open={isModalOpen}
				onClose={() => {
					if (modalSettings.isLoading) {
						return;
					}
					setIsModalOpen(false);
				}}
				sx={{
					overflow: 'auto',
					alignItems: 'center',
					display: 'flex',
					zIndex: 5000,
					...fullScreenStyles
				}}
			>
				<Fade in={isModalOpen} timeout={600}>
					<Box
						p={3}
						pt={1}
						sx={{
							width: '1200px',
							margin: '0 auto',
							background: '#fff',
							borderRadius: '10px',
							maxHeight: '90vh',
							overflow: 'auto',
							'&:focus-visible': { outline: 'none' },
							...fullScreenStyles,
							...modalSettings.styles
						}}
					>
						<ModalAppbar
							onClose={() => setIsModalOpen(false)}
							variant={modalSettings?.fullScreen && 'contained' || null}
							title={modalSettings?.title || null}
						/>

						{/* assign Top margin */}
						<Box sx={{ marginTop: modalSettings?.fullScreen ? '84px' : undefined }}>
							{modalData || null}
						</Box>

					</Box>
				</Fade>
			</Modal>
		</ModalContext.Provider>
	)
};
