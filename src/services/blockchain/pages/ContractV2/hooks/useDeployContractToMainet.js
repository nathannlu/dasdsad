import React, { useState } from "react";

import { useWeb3 } from 'libs/web3';
import { useToast } from 'ds/hooks/useToast';
import { useUpdateContractAddress } from 'services/blockchain/gql/hooks/contract.hook';

import { getMainnetBlockchainType, ContractController, getWalletType } from '@ambition-blockchain/controllers';

export const useDeployContractToMainnet = (contract, contractState, id) => {
    const { addToast } = useToast();
    const { walletController } = useWeb3();

    const [state, setState] = useState({
        isDeploying: false,
        isDeploymentStepModalOpen: false,
        activeDeploymentStep: null
    });

    const [updateContractAddress] = useUpdateContractAddress({ onError });

    const onError = (err) => {
        addToast({ severity: 'error', message: err?.message });
        setState(prevState => ({ ...prevState, activeDeploymentStep: null, isDeploying: false, isDeploymentStepModalOpen: false }));
    };

    const deployContractToMainnet = async () => {
        try {

            setState(prevState => ({ ...prevState, activeDeploymentStep: 0, isDeploying: true, isDeploymentStepModalOpen: true }));

            const { name, symbol, type, nftCollection } = contract;
            const { baseUri, unRevealedBaseUri } = nftCollection;
            const { collectionSize, price, maxPerMint, maxPerWallet, isPublicSaleOpen, isRevealed } = contractState;

            const walletType = getWalletType(contract?.blockchain);
            const blockchain = getMainnetBlockchainType(contract?.blockchain);

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
                setState(prevState => ({ ...prevState, activeDeploymentStep: 1 }));
                const deployedContract = await contractController.deployContract(
                    walletAddress,
                    name,
                    symbol,
                    collectionSize,
                    e => onError(e)
                );

                if (!deployedContract) {
                    onError(new Error("Error! Something went wrong unable to deploy contract."));
                    return;
                }

                // wait for some time allow contract to be saved
                await new Promise(resolve => setTimeout(resolve, 10 * 1000));
                const contractAddress = deployedContract.options.address;
                contractController = new ContractController(contractAddress, blockchain, type);

                /**
                 * STEP-3
                 * update reveal
                 */
                setState(prevState => ({ ...prevState, activeDeploymentStep: 2 }));
                await contractController.updateReveal(walletAddress, isRevealed, isRevealed ? baseUri : unRevealedBaseUri);

                // wait for some time allow contract to be saved
                await new Promise(resolve => setTimeout(resolve, 10 * 1000));

                /**
                 * STEP-4
                 * update public Sale Open
                 */
                setState(prevState => ({ ...prevState, activeDeploymentStep: 3 }));

                const web3 = window.web3;
                const priceInWei = web3.utils.toWei(`${price}`);

                await contractController.updateSale(walletAddress, isPublicSaleOpen, priceInWei, maxPerWallet, maxPerMint);

                // wait for some time allow contract to be saved
                await new Promise(resolve => setTimeout(resolve, 10 * 1000));


                /**
                 *  STEP-5
                 *  Save contract details in backend
                 */
                setState(prevState => ({ ...prevState, activeDeploymentStep: 4 }));
                await updateContractAddress({ variables: { id, address: contractAddress } });

                posthog.capture('User successfully deployed contract to mainnet blockchain', {
                    blockchain: blockchain,
                    version: '2'
                });

                setState(prevState => ({ ...prevState, isDeploying: false, isDeploymentStepModalOpen: false }));
            });
        } catch (e) {
            console.log(e, 'Error! deploying contract.');
            onError(e);
        }
    }

    return {
        ...state,
        deployContractToMainnet
    };
}