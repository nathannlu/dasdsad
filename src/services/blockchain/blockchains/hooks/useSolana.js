import { useToast } from 'ds/hooks/useToast';
import posthog from 'posthog-js';
import { useUpdateContractAddress } from 'services/blockchain/gql/hooks/contract.hook';
import { useContract } from 'services/blockchain/provider';
import { createSolanaContract } from 'solana';

export const useSolana = () => {
    const { setLoading, setError, setStart, selectInput, ipfsUrl } = useContract();
    const { addToast } = useToast();
    const [updateContractAddress] = useUpdateContractAddress({
        onCompleted: () => {
            addToast({
                severity: 'success',
                message: `Contract deployed.`,
            });
            setStart(false);
            setLoading(false);
            setError(false);
        },
        onError: (err) => {
            addToast({
                severity: 'error',
                message: `Contract successfully deployed, however was not saved in our server. Please contact an administrator. Error: ${err.message}`,
            });
            setError(true);
        },
    });

    const handleDeploymentSuccess = async (id, candyMachineAddress) => {
        posthog.capture('User deployed contract to Solana blockchain', {
            $set: {
                deployedContract: true,
            },
        });
        posthog.capture('User successfully deployed contract to blockchain', {
            blockchain: 'solana',
            version: '1'
        });
        await updateContractAddress({
            variables: { id: id, address: candyMachineAddress },
        });
    };

    const getContractCreators = async (baseUri, address) => {
        const hasAppendingSlash = baseUri.charAt(baseUri.length - 1) === '/';

        try {
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/`;
            let baseUriHash = null;

            if (baseUri?.indexOf('ipfs://') !== -1) {
                baseUriHash = `${ipfsUrl}${baseUri?.split('ipfs://')[1]}${hasAppendingSlash && '' || '/'}1.json`;
            } else {
                baseUriHash = `${baseUri}${hasAppendingSlash && '' || '/'}1.json`;
            }

            if (!baseUriHash) {
                throw new Error('Invalid baseUri');
            }

            const fetchResponse = await fetch(baseUriHash);
            const json = await fetchResponse.json();

            if (!json?.properties?.creators || !json?.properties?.creators.length) {
                throw new Error('creators field missing!');
            }

            return json?.properties?.creators.map(c => ({ ...c, verified: true }));
        } catch (e) {
//            console.log('Error getContractCreators:', e);
            return [{ address, verified: true, share: 100 }];
        }
    }

    const deploySolanaContract = async ({
        uri,
        name,
        address,
        symbol,
        size,
        price,
        liveDate,
        cacheHash,
        id,
        env,
    }) => {
        try {
            //mintV2();
            const creators = await getContractCreators(uri, address);
            const res = await createSolanaContract({
                uri,
                name,
                address,
                symbol,
                size,
                price,
                liveDate,
                creators,
                cacheHash,
                env,
            });

            await handleDeploymentSuccess(id, res.candyMachineAddress);
        } catch (err) {

            let message = 'Please open a ticket in Discord for help. Error: ' + err;

            if (err == 'Error: Non-base58 character') {
                message = 'You must be logged in with Phantom wallet in order to deploy on Solana'
            }
            if (err == 'Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1') {
                message = 'Not enough Sol in your wallet. E.g. 5.8sol is needed for 3,333 NFTs'

            }
            if (err == 'Error: failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.') {
                message = 'Your wallet has no Sol. Is your sol on the correct network (mainnet/devnet)?'
            }

            if (err == 'TypeError: Blob.encode requires (length 32) Buffer as src') {
                message = `Address ${address} is not a valid Solana address`
            }

            //						if(err)
            addToast({
                severity: 'error',
                message
            });
        }
    };

    return { deploySolanaContract };
};
