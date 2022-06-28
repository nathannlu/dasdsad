import { useEffect, useState } from 'react'
import axios from 'axios';
import { WalletController, ContractController } from '@ambition-blockchain/controllers';
import ERC721a from '@ambition-blockchain/controllers/src/abis/AmbitionCreatorImpl.json';
import ProxyERC721a from '@ambition-blockchain/controllers/src/abis/AmbitionERC721A.json';
import config from 'config';
import { useToast } from 'ds/hooks/useToast';

export const useGas = () => {
    const { addToast } = useToast();
    const [estimates, setEstimates] = useState();
    const [priceUSD, setPriceUSD] = useState();
    const [gasBaseFee, setGasBaseFee] = useState();
    const [isEthUsd, setIsEthUsd] = useState(false);
    const [isSolUsd, setIsSolUsd] = useState(false);

    useEffect(() => {
        initialize();
    }, [])

    const initialize = async () => {
        try {
            // Get crypto price in USD
            const usdData = await getCrytoPriceInUsd();
            setPriceUSD(usdData)

            // Load wallet
            const walletController = new WalletController();
            await walletController.loadWalletProvider('metamask');
            //await walletController.loadWalletProvider('solana');

            // Get ETH Base Fee
            const ethBaseFee = await getBaseFee();
            setGasBaseFee(ethBaseFee);

            // ETH Gas Estimates
            const ethContractCreation = await getETHDeploymentFee(ethBaseFee.ethereum, usdData.ethereum);
            const ethMint = await getEthMintFee(ethBaseFee.ethereum, usdData.ethereum);
            //const ethReveal = await getEthRevealFee(ethBaseFee.ethereum, usdData.ethereum);

            // SOL Gas Estimates
            const solDeploymentRent = await getSolDeploymentRent(usdData.solana);

            // Estimate Object
            const estimatesObj = {
                ethereum: {
                    contractCreation: { ...ethContractCreation },
                    mintFees: { ...ethMint }
                },
                solana: {
                    deploymentRent: { ...solDeploymentRent }
                }
            }

            setEstimates(estimatesObj);
        }
        catch (err) {
            console.error(err);
        }
    }

    const getCrytoPriceInUsd = async () => {
        try {
            const tokens = ['ethereum', 'solana'].join();
            const currencies = ['usd'].join();
            const usdData = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
                params: {
                    ids: tokens,
                    vs_currencies: currencies
                }
            });
            return {
                ethereum: usdData.data.ethereum.usd,
                solana: usdData.data.solana.usd
            };
        }
        catch (err) {
            console.error(err);
            return {
                ethereum: 1198.59,
                solana: 33.98
            }
        }
    }

    const getBaseFee = async () => {
        try {
            const res = await axios.get('https://api.etherscan.io/api', {
                params: {
                    module: 'gastracker',
                    action: 'gasoracle',
                    apikey: config.etherscan.key
                }
            });
            
            return {
                ethereum: res.data.result.suggestBaseFee,
                solana: 0
            }
        }
        catch (err) {
            console.error(err);
            return {
                ethereum: 23.429166388,
                solana: 0
            }
        }
    }

    const getETHDeploymentFee = async (baseFee, usdData) => {
        try {
            const contract = new window.web3.eth.Contract(ProxyERC721a.abi);

            const ethBytecodeDeployment = contract.deploy({
                arguments: ['deployTest', 'deployTest', 10000],
                data: ProxyERC721a.bytecode
            }).encodeABI();
    
            const ethDeploymentGas = await window.web3.eth.estimateGas({
                data: ethBytecodeDeployment,
                from: config.company.walletAddress
            });
    
            const deploymentGasGwei = (ethDeploymentGas * baseFee).toString();
            const deploymentGasWei = window.web3.utils.toWei(deploymentGasGwei, 'gwei');
            const ethDeploymentGasEstimate = parseFloat(window.web3.utils.fromWei(deploymentGasWei, 'ether'));

            return { 
                eth: ethDeploymentGasEstimate.toFixed(4),
                usd: (ethDeploymentGasEstimate * usdData).toFixed(2) 
            };
        }
        catch (err) {
            console.error(err);
            return { 
                eth: 0.0236,
                usd: 27.55 
            };
        }
    }

    const getEthMintFee = async (baseFee, usdData) => {
        try {
            const contract = new window.web3.eth.Contract(ERC721a.abi, '0x82745c9f1929C4e32B35a6Ecc8eD494a1D0290E0');
            const ethMintGas = await contract.methods.mint(1).estimateGas({
                from: config.company.walletAddress
            });
    
            const mintGasGwei = (ethMintGas * baseFee).toFixed(4);
            const mintGasWei = window.web3.utils.toWei(mintGasGwei, 'gwei');
            const ethMintGasEstimate = parseFloat(window.web3.utils.fromWei(mintGasWei, 'ether'));

            return { 
                eth: ethMintGasEstimate.toFixed(4),
                usd: (ethMintGasEstimate * usdData).toFixed(2) 
            };
        }
        catch (err) {
            console.error(err);
            return { 
                eth: 0.0038,
                usd: 4.47 
            };
        }
    }

    const getSolDeploymentRent = async (usdData) => {
        try {
            const solDeploymentEstimate = 0.000007582;
            return { 
                sol: solDeploymentEstimate.toFixed(9),
                usd: (solDeploymentEstimate * usdData).toFixed(5) 
            };

        }
        catch (err) {
            console.error(err);
            return { 
                sol: 0.000007582,
                usd: 0.00025
            };
        }
    }

    //@TODO: not working if caller is not the owner
    const getEthRevealFee = async (baseFee, usdData) => {
        try {
            const contract = new window.web3.eth.Contract(ERC721a.abi, '0x82745c9f1929C4e32B35a6Ecc8eD494a1D0290E0');
            
            const ethRevealGas = await contract.methods.updateReveal(true, 'https://gateway.pinata.cloud/ipfs/QmYEfNYNBe9KMJ25uBnQHT1Nc7Lo5uGPhcokHzGo9Rv3cf/1.png').estimateGas({
                from: config.company.walletAddress
            });

            console.log(ethRevealGas)
    
            // const ethRevealGas = await window.web3.eth.estimateGas({
            //     data: ethBytecodeMint,
            //     from: config.company.walletAddress
            // });
    
            // const revealGasGwei = (ethRevealGas * baseFee).toString();
            // const revealGasWei = window.web3.utils.toWei(revealGasGwei, 'gwei');
            // const ethRevealGasEstimate = parseFloat(window.web3.utils.fromWei(revealGasWei, 'ether'));

            // return { 
            //     eth: ethRevealGasEstimate.toFixed(4),
            //     usd: (ethRevealGasEstimate * usdData).toFixed(2) 
            // };

            return { 
                eth: 0,
                usd: 0
            };
        }
        catch (err) {
            console.error(err);
            return { 
                eth: 0,
                usd: 0
            };
        }
    }

    return {
        gasBaseFee,
        priceUSD,
        estimates,
        isEthUsd,
        setIsEthUsd,
        isSolUsd,
        setIsSolUsd
    }
}