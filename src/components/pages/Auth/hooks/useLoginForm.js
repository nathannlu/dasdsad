import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'ds/hooks/useForm';
import { useAuth } from 'libs/auth'; 
import { useToast } from 'ds/hooks/useToast'; 
import { useCreateCollection } from 'gql/hooks/collection.hook';
import { useLayerManager } from 'core/manager';
import { useMetadata } from 'core/metadata';

export const useLoginForm = () => {
	const { isAuthenticated } = useAuth();
	const { addToast } = useToast();
	const history = useHistory();
	const { query: {layers} } = useLayerManager();
	const { settingsForm } = useMetadata();
	const [createCollection] = useCreateCollection({
		onCompleted: data => {
			console.log(data);
		}
	});

	const { form: loginForm } = useForm({
		email: {
			default: '',
			rules: []
		},
		password: {
			default: '',
			rules: []
		}
	})

	const handleLoginError = (err) => {
		addToast({
			severity: 'error',
			message: err.message
		});
	}

	const handleRedirect = () => {
		history.push('/dashboard');
	}

	const handleLoginSuccess = async () => {
		// On successful log in, save layers to person

		// If is first time
		if(layers) {
			let _layers = [...layers]
			_layers.forEach(layer => {
				layer.images.map(trait => {
					trait.url = trait.base64	
					delete trait.base64
					delete trait.rarity
					delete trait.preview
					delete trait.type
					delete trait.url
				})
			});

			let obj = {
				layers: _layers,
				name: settingsForm.name.value,
				description: settingsForm.description.value,
				size: settingsForm.collectionSize.value
			};

			await createCollection({variables: {collection: obj}})
		}

		handleRedirect();
	}

	// Handle existing JWT token
	useEffect(() => {
		if(isAuthenticated) {
			handleRedirect();
		}
	}, [isAuthenticated])

	return {
		loginForm,
		handleRedirect,
		handleLoginError,
		handleLoginSuccess
	}
}
