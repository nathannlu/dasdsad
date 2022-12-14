import Web3 from 'web3/dist/web3.min';
import { useUpdateContractAddress } from 'services/blockchain/gql/hooks/contract.hook';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from 'services/blockchain/pages/New/hooks/useDeployContractForm';
import { useToast } from 'ds/hooks/useToast';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/Asd.json';
import posthog from 'posthog-js';

export const useEthereum = () => {
    const { walletController } = useWeb3();
    const walletAddress = walletController?.state.address;

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

    const handleDeploymentError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
        setLoading(false);
        setError(true);
    };

    // @TODO update baseUri & blockchain
    const handleDeploymentSuccess = async (newContractAddress, id) => {
        await updateContractAddress({
            variables: { id: id, address: newContractAddress },
        });
        posthog.capture('User deployed contract to blockchain', {
            $set: {
                deployedContract: true,
            },
        });
        posthog.capture('User successfully deployed contract to blockchain', {
            blockchain: 'ethereum',
            version: '1'
        });
    };

    const deployEthereumContract = async ({
        id,
        uri,
        name,
        symbol,
        totalSupply,
        cost,
        open,
    }) => {
        try {
            const web3 = window.web3;
            console.log(web3.eth);
            const contract = new web3.eth.Contract(NFTCollectible.abi);
            const priceInWei = web3.utils.toWei(cost.toString());

            const options = {
                data: NFTCollectible.bytecode,
                arguments: [uri, name, totalSupply],
            };
            const senderInfo = { from: walletAddress };

            contract
                .deploy(options)
                .send(senderInfo, (err, txnhash) => {
                    if (err) {
                        handleDeploymentError(err);
                    } else {
                        addToast({
                            severity: 'info',
                            message:
                                'Deploying contract... should take a couple of seconds',
                        });
                    }
                })
                .on('error', (err) => handleDeploymentError(err))
                .then(async (newContractInstance) =>
                    handleDeploymentSuccess(
                        newContractInstance.options.address,
                        id
                    )
                );
        } catch (e) {
            handleDeploymentError(e);
        }
    };

    return {
        deployEthereumContract,
    };
};
