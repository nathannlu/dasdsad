import Web3 from 'web3/dist/web3.min';
import { useUpdateContractAddress } from 'services/blockchain/gql/hooks/contract.hook';
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
    const { account } = useWeb3();
    const { setLoading, setError, setStart, selectInput, ipfsUrl } =
        useContract();
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
        await updateContractAddress({
            variables: { id: id, address: candyMachineAddress },
        });
    };

    const deploySolanaContract = async ({
        uri,
        name,
        address,
        symbol,
        size,
        price,
        liveDate,
        creators,
        cacheHash,
        id,
        env,
    }) => {
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
								creators: [
										{ address, verified: true, share: 100 },
								],
                cacheHash,
                env,
            });

            console.log('res', res);

            handleDeploymentSuccess(id, res.candyMachineAddress);
        } catch (err) {

					let message = 'Something went wrong. Please open a ticket in Discord for help.';

					if (err == 'Error: Non-base58 character') {
						 message = 'You must be logged in with Phantom wallet in order to deploy on Solana'
					}
					if (err == 'Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1') {
						message = 'Not enough Sol in your wallet. E.g. 5.8sol is needed for 3,333 NFTs'
						
					}

					if(err == 'Error: failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.') {
						message = 'Your wallet has no Sol. Is your sol on the correct network (mainnet/devnet)?'
					}

					console.log(err)
//						if(err)
            addToast({
                severity: 'error',
                message
            });
        }
    };

    return {
        deploySolanaContract,
    };
};
