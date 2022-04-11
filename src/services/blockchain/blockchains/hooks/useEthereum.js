import Web3 from 'web3/dist/web3.min';
import { useUpdateContract } from 'services/blockchain/gql/hooks/contract.hook';
import { useWeb3 } from 'libs/web3';
import { useContract } from 'services/blockchain/provider';
import { useDeployContractForm } from 'services/blockchain/pages/New/hooks/useDeployContractForm';
import { useToast } from 'ds/hooks/useToast';
import NFTCollectible from 'services/blockchain/blockchains/ethereum/abis/ambitionNFTPresale.json';
import posthog from 'posthog-js';

export const useEthereum = () => {
    const { deployContractForm } = useDeployContractForm();
    const { account } = useWeb3();
    const { setLoading, setError, setStart, selectInput, ipfsUrl } =
        useContract();
    const { addToast } = useToast();
    const [updateContract] = useUpdateContract({
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
        posthog.capture('User deployed contract to blockchain', {
            $set: {
                deployedContract: true,
            },
        });
        await updateContract({
            variables: { id: id, address: newContractAddress },
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

            console.log(uri, name, symbol, totalSupply, priceInWei);
            const options = {
                data: NFTCollectible.bytecode,
                arguments: [uri, name, symbol, totalSupply, priceInWei, open],
            };
            const senderInfo = {
                from: account,
            };

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
