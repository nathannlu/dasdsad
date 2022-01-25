import React, { useState, useContext } from 'react';
import uuid from 'react-uuid';
import { Snackbar, Alert } from '../components';

export const ToastContext = React.createContext({})

export const useToast = () => useContext(ToastContext);

export const ToastManager = ({children}) => {
	const [toastQueue, setToastQueue] = useState([]);

	const addToast = (toast) => {
		const newToast = {
			open: true,
			message: toast.message,
			severity: toast.severity,
			id: uuid()
		}
		setToastQueue([...toastQueue, newToast]);
	}

	const removeToast = (id) => {
		setToastQueue(prevState => {
			const newToastQueue = prevState.filter(toast => toast.id !== id);

			return newToastQueue;
		})
	}

	return (
		<ToastContext.Provider
			value={{
				addToast
			}}
		>
			{children}

			{toastQueue.map(toast => (
				<Snackbar key={toast.id} open={toast.open} autoHideDuration={5000} onClose={() => removeToast(toast.id)} sx={{zIndex: 9999}}>
					<Alert onClose={() => removeToast(toast.id)} severity={toast.severity} sx={{ width: '100%' }}>
						{ toast.message }
					</Alert>
				</Snackbar>
			))}
		</ToastContext.Provider>
	)
};
