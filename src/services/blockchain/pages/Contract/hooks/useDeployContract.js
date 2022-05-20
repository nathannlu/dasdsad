import React from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useWeb3 } from 'libs/web3';
import { useEthereum } from 'services/blockchain/blockchains/hooks/useEthereum';
import { useSolana } from 'services/blockchain/blockchains/hooks/useSolana';
import { useContract } from 'services/blockchain/provider';

export const useDeployContract = (contract) => {
    const { deployEthereumContract } = useEthereum();
    const { deploySolanaContract } = useSolana();
    //	const { contract } = useContract();
    const { account } = useWeb3();
    const { addToast } = useToast();

    const deployContract = async () => {
        console.log(contract.blockchain);
        let env;
        if (contract.blockchain == 'solanadevnet') {
            env = 'devnet';
        } else if (contract.blockchain == 'solana') {
            env = 'mainnet';
        }

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
                console.log('account', account);
                await deploySolanaContract({
                    uri: contract.nftCollection.baseUri,
                    name: contract.name,
                    address: account,
                    symbol: contract.symbol,
                    size: contract.nftCollection.size,
                    price: contract.nftCollection.price,
                    liveDate: 'now',

                    cacheHash: contract.nftCollection.cacheHash,
                    id: contract.id,
                    env,
                });
            }
        } catch (err) {
            console.log(err.code);
            addToast({
                severity: 'error',
                message: err.message,
            });
        }
    };

    return { deployContract };
};
