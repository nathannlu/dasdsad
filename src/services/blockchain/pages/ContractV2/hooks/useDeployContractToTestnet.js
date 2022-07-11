import React, { useState } from "react";

import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';
import { useUpdateContractAddress } from 'services/blockchain/gql/hooks/contract.hook';

import { ContractController, getWalletType } from '@ambition-blockchain/controllers';

export const useDeployContractToTestnet = (contract, id) => {
    const { addToast } = useToast();
    const { walletController } = useWeb3();

    const [state, setState] = useState({
        isDeploying: false,
    });

    const [updateContractAddress] = useUpdateContractAddress({ onError });

    const onError = (err) => {
        addToast({ severity: 'error', message: err?.message });
        setState(prevState => ({ ...prevState, isDeploying: false }));
    };

    const deployContractToTestnet = async () => {
        try {

            setState(prevState => ({ ...prevState, isDeploying: true }));

            const { name, symbol, type, nftCollection } = contract;

            const walletType = getWalletType(contract?.blockchain);
            const blockchain = contract?.blockchain;

            console.log({ walletController });

            /**
             * STEP-1 
             * connect and verify wallet connection
             */
            const walletAddress = walletController?.state?.address;
            if (!walletAddress) {
                throw new Error('Wallet not connected!');
            }

            if (walletType !== walletController?.state?.wallet) {
                throw new Error('Wallet not connected!');
            }

            addToast({
                severity: 'info',
                message: 'Deploying contract to blockchain. This might take a couple of seconds...',
            });

            // get the blockchain type on the basis of isTestnetEnabled 
            let contractController = new ContractController(null, blockchain, type);

            // switch network to testnet
            await walletController.compareNetwork(blockchain, async (error) => {
                if (error) {
                    onError(error);
                    return;
                }

                /**
                 * STEP-2
                 * deploy contract
                 */
                const deployedContract = await contractController.deployContract(
                    walletAddress,
                    name,
                    symbol,
                    nftCollection.size,
                    e => onError(e)
                );

                if (!deployedContract) {
                    onError(new Error("Error! Something went wrong unable to deploy contract."));
                    return;
                }

                // wait for some time allow contract to be saved
                await new Promise(resolve => setTimeout(resolve, 10 * 1000));
                const contractAddress = deployedContract.options.address;
                await updateContractAddress({ variables: { id, address: contractAddress } });

                posthog.capture('User successfully deployed contract to mainnet blockchain', {
                    blockchain: blockchain,
                    version: '2'
                });

                setState(prevState => ({ ...prevState, isDeploying: false }));
            });
        } catch (e) {
            console.log(e, 'Error! deploying contract.');
            onError(e);
        }
    }

    return {
        ...state,
        deployContractToTestnet
    };
}