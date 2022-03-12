import Web3 from 'web3/dist/web3.min';
import { useUpdateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from 'services/blockchain/pages/New/hooks/useDeployContractForm';
import { useToast } from 'ds/hooks/useToast';
import { createSolanaContract } from 'solana';
import { mintV2 } from 'solana/helpers/mint.js';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';
import posthog from 'posthog-js';

export const useSolana = () => {
	const { deployContractForm } = useDeployContractForm();
	const { account } = useWeb3()
	const { setLoading, setError, setStart, selectInput, ipfsUrl } = useContract();
	const { addToast } = useToast();
    const [updateContract] = useUpdateContract({
		onCompleted: () => {
			addToast({
				severity: 'success',
				message: `Contract deployed.`
			})	
			setStart(false);
			setLoading(false)
			setError(false);
		},
		onError: err => {
			addToast({
				severity: 'error',
				message: `Contract successfully deployed, however was not saved in our server. Please contact an administrator. Error: ${err.message}`
			})	
			setError(true);
		}
	});

    const handleDeploymentSuccess = async (id, candyMachineAddress) => {
		posthog.capture(
			'User deployed contract to Solana blockchain', {
				$set: {
					deployedContract: true,
				}
		});
		await updateContract({ variables: { id: id, address: candyMachineAddress} });
	}

	const deploySolanaContract = async ({uri, name, address, symbol, size, price, liveDate, creators, cacheHash, id}) => {
        try {
            //mintV2();
            const res = await createSolanaContract({
                uri,
                name,
                address, 
                symbol, 
                size, 
                price, 
                liveDate, 
                creators,
                cacheHash
            });

            //handleDeploymentSuccess(id, 'candymachineaddresHERE');

            console.log(res);
        }
        catch (err) {
            console.error(err);
            addToast({
				severity: 'error',
				message: err.message
			})	
        }
	}
	
	return {
		deploySolanaContract
	}
}
