import React, { useState, useEffect } from 'react';
import { useWeb3 } from 'libs/web3';
import { useWebsite } from 'services/website/provider';
import { useGetContract } from 'services/blockchain/gql/hooks/contract.hook';
//import { mintV2 } from 'solana/helpers/mint.js';
import { useToast } from 'ds/hooks/useToast';

export const useMintButton = () => {
	const { loadWalletProvider, mint, getOpen, presaleMint, getSize, getPrice } = useWeb3();
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

		(async () => {
            const blockchain =  contract.blockchain;
            if (blockchain.indexOf('solana') !== -1) { // Solana
                const userAddress = await loadWalletProvider('phantom');
            }
            else { // Metamask
                const userAddress = await loadWalletProvider('metamask');
                const isOpen = await getOpen(website.settings.connectedContractAddress);
                setOpen(isOpen);
                const size = await getSize(website.settings.connectedContractAddress);
                setSize(size);
                const cost = await getPrice(website.settings.connectedContractAddress);
                setPrice(cost);        
            }
		})()

	}, [website, contract])

    // useEffect(() => {
    //     if (!contract) return;

    //     //console.log(contract)

    // }, [contract])
    

    const onMint = async () => {
        try {
            if (!contract) throw new Error('Cannot find contract');
            if (!website) throw new Error('Cannot find website');

            const blockchain =  contract.blockchain;

            if (blockchain.indexOf('solana') !== -1) { // Solana
                const userAddress = await loadWalletProvider('phantom');
                await mintV2(contract.blockchain === 'solanadevnet' ? 'devnet' : 'mainnet', contract.address, userAddress);
            }
            else { // Eth or Polygon
                const userAddress = await loadWalletProvider('metamask');
                //const isOpen = await getOpen(website.settings.connectedContractAddress);

                if (open) {
                    console.log('open')
                    await mint(price, website.settings.connectedContractAddress, userAddress, mintCount);
                }
                else {
                    console.log('not open')
                    await presaleMint(price, contract.address, contract.nftCollection.whitelist, userAddress, mintCount);
                }
            }
        }
        catch (err) {
            console.log(err);
            addToast({
                severity: "error",
                message: err.message,
            })
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
    }
}
