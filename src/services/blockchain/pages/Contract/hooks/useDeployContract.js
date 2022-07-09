import { useState } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';
import { useEthereum } from 'services/blockchain/blockchains/hooks/useEthereum';
import { useSolana } from 'services/blockchain/blockchains/hooks/useSolana';

export const useDeployContract = (contract) => {
    const { deployEthereumContract } = useEthereum();
    const { deploySolanaContract } = useSolana();
    const { addToast } = useToast();
	const [loading, setLoading] = useState(false);

    const { walletController } = useWeb3();

    const deployContract = async (creators) => {
        const walletAddress = walletController?.state.address;
        const env = contract?.blockchain == 'solanadevnet' && 'devnet' || 'mainnet';

			setLoading(true);


			console.log(creators)

        try {
            if (!contract || !Object.keys(contract).length)
                throw new Error('Contract not found');

            if (contract.blockchain.indexOf('solana') === -1) {
                await deployEthereumContract({
                    uri: contract?.nftCollection?.baseUri,
                    name: contract.name,
                    symbol: contract.symbol,
                    totalSupply: contract?.nftCollection?.size,
                    cost: contract?.nftCollection?.price,
                    open: false,
                    id: contract.id,
                });
            } else {
                await deploySolanaContract({
                    uri: contract.nftCollection.baseUri,
                    name: contract.name,
                    address: walletAddress,
                    symbol: contract.symbol,
                    size: contract.nftCollection.size,
                    price: contract.nftCollection.price,
                    liveDate: 'now',
                    cacheHash: contract.nftCollection.cacheHash,
                    id: contract.id,
                    env,
									creators
                });
            }
					setLoading(false);
        } catch (err) {
            console.log(err.code);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    return { deployContract, loading };
};
