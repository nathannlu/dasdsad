import { useQuery, useMutation } from '@apollo/client';
import { CREATE_COLLECTION, GET_COLLECTIONS } from '../collection.gql';
import { useLayerManager } from 'services/generator/controllers/manager';
import { useMetadata } from 'services/generator/controllers/metadata';
import { useTraits } from 'services/generator/controllers/traits';
import { toDataURL } from 'utils/imageData';

export const useCreateCollection = ({ onCompleted, onError }) => {
    const [createCollection, { ...mutationResult }] = useMutation(
        CREATE_COLLECTION,
        {
            onCompleted,
            onError,
        }
    );

    return [createCollection, { ...mutationResult }];
};

export const useGetCollections = async () => {
    const {
        actions: { setLayers },
    } = useLayerManager();
    const { updateSettingsForm } = useMetadata();

    const { ...queryResult } = useQuery(GET_COLLECTIONS, {
        onCompleted: async (data) => {
            // Update layer maanger, traits manager
            let collections = data.getCollections;
            /* eslint-disable no-unsafe-optional-chaining */
            let layers = [...collections[0]?.layers];
            let clonedLayers = JSON.parse(JSON.stringify(layers));

            // Add field for base64
            for (let i = 0; i < clonedLayers.length; i++) {
                const layer = clonedLayers[i];
                for (let j = 0; j < layer.images.length; j++) {
                    let image = clonedLayers[i].images[j];
                    image.preview = image.url;
                    image.base64 = await toDataURL(image.url);
                    image.type = 'image/png';
                }
            }

            // Save collection to metadata too
            updateSettingsForm((prevState) => {
                let newState = { ...prevState };
                newState.size.value = collections[0]?.size;
                newState.description.value = collections[0]?.description;
                newState.name.value = collections[0]?.name;

                return { ...newState };
            });

            setLayers(clonedLayers);
        },
    });

    return { ...queryResult };
};
