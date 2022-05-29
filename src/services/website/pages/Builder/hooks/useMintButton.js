import React, { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useWebsite } from 'services/website/provider';
import { useGetContract } from 'services/blockchain/gql/hooks/contract.hook';
import { mintV2 } from 'solana/helpers/mint.js';
import { useToast } from 'ds/hooks/useToast';

export const useMintButton = () => {
    const { mint, getOpen, presaleMint, getSize, getPrice, walletController, initializeWalletController } = useWeb3();
    const { website } = useWebsite();
    const [price, setPrice] = useState('');
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState(-1);
    const [contract, setContract] = useState();
    const [mintCount, setMintCount] = useState(1);
    const { addToast } = useToast();

    useGetContract({
        address: website?.settings?.connectedContractAddress,
        onCompleted: data => {
            setContract(data.getContract);
            if (data.getContract.blockchain.indexOf('solana') !== -1) {
                setPrice(data.getContract.nftCollection.price);
            }
        }
    })

    useEffect(() => {
        if (!website || !contract) return;
        const wc = walletController || initializeWalletController();

        (async () => {
            const blockchain = contract.blockchain;
            if (blockchain.indexOf('solana') !== -1) {
                // Solana
                await wc.loadWalletProvider('phantom');
            } else {
                // Metamask
                await wc.loadWalletProvider('metamask');
                const isOpen = await getOpen(website.settings.connectedContractAddress);
                setOpen(isOpen);
                const size = await getSize(website.settings.connectedContractAddress);
                setSize(size);
                const cost = await getPrice(website.settings.connectedContractAddress);
                setPrice(cost);
            }
        })()

    }, [website, contract])

    const onConnect = async () => {
        try {
            const wc = walletController || initializeWalletController();

            const blockchain = contract.blockchain;
            if (blockchain.indexOf('solana') !== -1) {
                // Solana
                await wc.loadWalletProvider('phantom');
            } else {
                // Metamask
                await wc.loadWalletProvider('metamask');
                await wc.compareNetwork(blockchain, async (e) => {
                    if (e) {
                        addToast({ severity: "error", message: e.message });
                        return;
                    }
                    await getOpen(contract?.address);
                    await getSize(contract?.address);
                    await getPrice(contract?.address);
                });
            }
        }
        catch (err) {
            console.log(err);
            addToast({ severity: "error", message: err.message });
        }
    }

    const onMint = async () => {
        try {
            if (!contract) throw new Error('Cannot find contract');
            if (!website) throw new Error('Cannot find website');

            const blockchain = contract.blockchain;
            const wc = walletController || initializeWalletController();

            if (blockchain.indexOf('solana') !== -1) {
                // Solana
                const walletAddress = await wc.loadWalletProvider('phantom');
                await mintV2(contract.blockchain === 'solanadevnet' ? 'devnet' : 'mainnet', contract.address, walletAddress);
            }
            else {
                // Eth or Polygon
                const walletAddress = await wc.loadWalletProvider('metamask');
                //const isOpen = await getOpen(website.settings.connectedContractAddress);

                if (open) {
                    console.log('open')
                    await mint(price, website.settings.connectedContractAddress, walletAddress, mintCount);
                } else {
                    console.log('not open')
                    await presaleMint(price, contract.address, contract.nftCollection.whitelist, walletAddress, mintCount);
                }
            }
        } catch (err) {
            console.log(err);
            addToast({ severity: "error", message: err.message });
        }
    }

    return {
        price,
        contract,
        onMint,
        size,
        open,
        setMintCount,
        mintCount,
        onConnect
    }
}
