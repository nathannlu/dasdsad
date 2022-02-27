import Web3 from 'web3/dist/web3.min';
import { useUpdateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from 'services/blockchain/pages/New/hooks/useDeployContractForm';
import { useToast } from 'ds/hooks/useToast';
import { createSolanaContract } from 'solana';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';
import posthog from 'posthog-js';

export const useSolana = () => {
	const { deployContractForm } = useDeployContractForm();
	const { account } = useWeb3()
	const { setLoading, setError, setStart, selectInput, ipfsUrl } = useContract();
	const { addToast } = useToast();

	const deploySolanaContract = async ({contract}) => {
        try {
            console.log(contract); //id symbol nftColleciton.price nftColleciton.size
            console.log(account);
            createSolanaContract({
                address: account,
                privateKey: '5HkP4pQgoFzJ4VahMgcSGnhXwpGbF62XXhPkc8zna2wMZSfAFLDDzDeEFvjJopmzgkZwfCUZBUBpsUKxmtA8nVeC',
                symbol: contract.symbol,
                size: contract.nftCollection.size,
                price: contract.nftCollection.price,
                liveDate: 'now',
            });

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
