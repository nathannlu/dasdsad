import { useState, useEffect } from 'react';
import { useToast } from 'ds/hooks/useToast';
import { useForm } from 'ds/hooks/useForm';
import { useWeb3 } from 'libs/web3';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { useSetWhitelist } from 'services/blockchain/gql/hooks/contract.hook.js';
import { mintV2 } from 'solana/helpers/mint';
import { withdrawV2 } from 'solana/helpers/withdraw';
import { loadCandyProgramV2 } from 'solana/helpers/accounts';
import { BN } from '@project-serum/anchor';
import {
    PublicKey,
} from '@solana/web3.js';
import { updateCandyMachine } from 'solana/helpers/updateContract';

export const useContractActions = (contractAddress) => {
    const { addToast } = useToast();
    const { retrieveContract, account } = useWeb3();
    const [contract, setContract] = useState({});
    const [setWhitelist] = useSetWhitelist({});
    const { form: actionForm } = useForm({
        airdropList: {
            default: '',
            placeholder: `0x123\n0x456\n0x789`,
            rules: [],
        },
        whitelistAddresses: {
            default: '',
            placeholder: `0x123\n0x456\n0x789`,
            rules: [],
        },
        maxPerMintCount: {
            default: '',
            placeholder: '5',
            rules: [],
        },
        maxPerWalletCount: {
            default: '',
            placeholder: '10',
            rules: [],
        },
        newPrice: {
            default: '',
            placeholder: '5',
            rules: [],
        },
        whitelistToken: {
            default: '6L2i8gKPJtjCj1TA7vQLYQn52xmubn3Fz6rTaFV5qMvM',
            placeholder: '6L2i8gKP...',
            rules: [],
        },
        goLiveDate: {
            value:'2017-06-01T08:30',
            rules: [],
        },
        newMetadataUrl: {
            default: '',
            placeholder: 'New metadata URL',
            rules: [],
        },
    });

    const onTxnError = (err) => {
        addToast({
            severity: 'error',
            message: err.message,
        });
    };

    const onTxnInfo = () => {
        addToast({
            severity: 'info',
            message:
                'Sending transaction to Ethereum. This might take a couple of seconds...',
        });
    };

    const onTxnSuccess = () => {
        addToast({
            severity: 'success',
            message: `Transaction success`,
        });
    };

    // Update base URI
    const updateBaseUri = async (baseUri = actionForm.newMetadataUrl.value) => {
        contract.methods
            .setBaseURI(baseUri)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const setMaxPerMint = async (count = actionForm.maxPerMintCount.value) => {
        contract.methods
            .setMaxPerMint(parseInt(count))
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const setMaxPerWallet = async (count = actionForm.maxPerWalletCount.value) => {
        contract.methods
            .setMaxPerWallet(parseInt(count))
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const setCost = async (price = actionForm.newPrice.value) => {
        const web3 = window.web3;
        const priceInWei = web3.utils.toWei(price);

        contract.methods
            .setCost(priceInWei)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const openSales = async (status = true) => {
        contract.methods
            .setOpen(status)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const openPresale = async (status = true) => {
        contract.methods
            .setPresaleOpen(status)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const airdrop = async (list = actionForm.airdropList.value.split('\n')) => {
        console.log(list);
        contract.methods
            .airdrop(list)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    const setMerkleRoot = (
        id,
        addresses = actionForm.whitelistAddresses.value.split('\n')
    ) => {
        const leafNodes = addresses.map((addr) => keccak256(addr));
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
            sortPairs: true,
        });
        const root = merkleTree.getRoot();

        contract.methods
            .setPreSaleAddresses(root)
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());

        setWhitelist({ variables: { id, whitelist: addresses } });
    };

    const presaleMint = async (whitelist, count = 1) => {
        const cost = await contract.methods.cost().call();

        const leafNodes = whitelist.map((addr) => keccak256(addr));
        const claimingAddress =
            (await leafNodes.find((node) =>
                compare(keccak256(account), node)
            )) || '';
        const merkleTree = new MerkleTree(leafNodes, keccak256, {
            sortPairs: true,
        });

        const hexProof = merkleTree.getHexProof(claimingAddress);

        contract.methods
            .presaleMint(count, hexProof)
            .send(
                {
                    from: account,
                    value: cost,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    // compare array buffers
    function compare(a, b) {
        for (let i = a.length; -1 < i; i -= 1) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    const withdraw = async (wallet = 'metamask', env = 'mainnet') => {
        if (wallet == 'phantom') {
            console.log('withdrawing phantom');
            await withdrawV2(env, contractAddress);
            return;
        }

        contract.methods
            .withdraw()
            .send(
                {
                    from: account,
                    value: 0,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());
    };

    // Mint NFT
    const mint = async (count = 1, wallet = 'metamask', env = 'mainnet') => {
        if (wallet == 'phantom') {
            console.log('minting phantom');
            await mintV2(env, contractAddress, account);
            return;
        }

        const { methods } = contract;
        const price = await methods.cost().call();

        methods
            .mint(count)
            .send(
                {
                    from: account,
                    value: price,
                },
                (err) => (err ? onTxnError(err) : onTxnInfo())
            )
            .once('error', (err) => onTxnError(err))
            .once('confirmation', () => onTxnSuccess());

        /*
		try {
			// Support depreciated method
			await methods.mintNFTs(count).estimateGas({
				from: account,
				value: price
			}, (err, gasAmount) => {
				if(!err && gasAmount !== undefined) {
					methods.mintNFTs(count).send({ 
						from: account,
						value: price
					}, err => err ? onTxnError(err) : onTxnInfo())
					.once('error', err => onTxnError(err))
					.once("confirmation", () => onTxnSuccess())
				}
			})

			await methods.mint(count).estimateGas({
				from: account,
				value: price
			}, (err, gasAmount) => {
				if(!err && gasAmount !== undefined) {
					methods.mint(count).send({ 
						from: account,
						value: price
					}, err => err ? onTxnError(err) : onTxnInfo())
					.once('error', err => onTxnError(err))
					.once("confirmation", () => onTxnSuccess())
				}
			})
		} catch (e) {
			addToast({
				severity: 'error',
				message: e.message
			});
		}
		*/
    };

    const updateWhiteListToken = async ( wallet, env = 'mainnet', turnOnWhiteList = false,
        newMint = actionForm.whitelistToken.value // nonly token for now
      ) => {
        if (wallet == 'phantom') {
            console.log('updating white');
           
        } else{
            onTxnError("Please connect with Phantom wallet");
        }

        // console.log(window.solana);
        // const sol = await window.solana.connect();
        // console.log(sol)
        // const payerPublicAddress = new PublicKey(
        //     sol.publicKey.toString().toBuffer()
        // );

        // console.log(window.solana.publicKey.toString())

        // needs to be dynamic
        const anchorProgram = await loadCandyProgramV2(null, 'devnet');
        const candyMachineAddress = contractAddress;
        const connection = anchorProgram.provider.connection;
        const candyMachineObj = await anchorProgram.account.candyMachine.fetch(
            candyMachineAddress,
        );

        console.log(candyMachineObj);

        let newWhiteList;

        if(turnOnWhiteList){
            newWhiteList =  {
                mode:  { burnEveryTime: true },
                mint: new PublicKey(newMint),
                presale: true ,
                discountPrice : null
            }
        } else {
            newWhiteList = null;
        }

        

        // let toModifyCandyMachineData = candyMachineObj.data;

        // console.log(toModifyCandyMachineData)


        const newSettings = {
            itemsAvailable:  candyMachineObj.data.itemsAvailable,
            uuid: candyMachineObj.data.uuid,
            symbol: candyMachineObj.data.symbol,
            sellerFeeBasisPoints: candyMachineObj.data.sellerFeeBasisPoints,
            isMutable: true,
            maxSupply: candyMachineObj.data.maxSupply,
            retainAuthority: false,
            gatekeeper: candyMachineObj.data.gatekeeper,
            goLiveDate: candyMachineObj.data.goLiveDate,
            endSettings: candyMachineObj.data.endSettings,
            price: candyMachineObj.data.price,
            whitelistMintSettings: newWhiteList ,
            hiddenSettings: candyMachineObj.data.hiddenSettings,
            creators: candyMachineObj.data.creators.map(creator => {
            return {
                address: new PublicKey(creator.address),
                verified: true,
                share: creator.share,
            };
            }),
        };

        console.log(newSettings);

        updateCandyMachine(candyMachineAddress, env, newSettings);

    };

    const updateGoLiveDate = async ( wallet, env = 'mainnet', newGoLiveDate = actionForm.goLiveDate.value) => {
        if (wallet == 'phantom') {
            console.log('updating white');
           
        } else{
            onTxnError("Please connect with Phantom wallet");
        }

        const epoch = new Date(newGoLiveDate).getTime()
        console.log(newGoLiveDate);
        console.log(epoch);
        console.log(new BN(epoch).toString());

        // return;

        const anchorProgram = await loadCandyProgramV2(null, 'devnet');
        const candyMachineAddress = contractAddress;
        const connection = anchorProgram.provider.connection;
        const candyMachineObj = await anchorProgram.account.candyMachine.fetch(
            candyMachineAddress,
        );

        console.log(candyMachineObj);

        const newSettings = {
            itemsAvailable:  candyMachineObj.data.itemsAvailable,
            uuid: candyMachineObj.data.uuid,
            symbol: candyMachineObj.data.symbol,
            sellerFeeBasisPoints: candyMachineObj.data.sellerFeeBasisPoints,
            isMutable: true,
            maxSupply: candyMachineObj.data.maxSupply,
            retainAuthority: false,
            gatekeeper: candyMachineObj.data.gatekeeper,
            goLiveDate: new BN(epoch/1000),
            endSettings: candyMachineObj.data.endSettings,
            price: candyMachineObj.data.price,
            whitelistMintSettings: candyMachineObj.data.whitelistMintSettings ,
            hiddenSettings: candyMachineObj.data.hiddenSettings,
            creators: candyMachineObj.data.creators.map(creator => {
            return {
                address: new PublicKey(creator.address),
                verified: true,
                share: creator.share,
            };
            }),
        };

        console.log(newSettings);

        updateCandyMachine(candyMachineAddress, env, newSettings);

    };

    useEffect(() => {
        const c = retrieveContract(contractAddress);
        setContract(c);
    }, [contractAddress]);

    return {
        actionForm,
        updateBaseUri,
        setMaxPerMint,
        setCost,
        openSales,
        openPresale,
        airdrop,
        setMerkleRoot,
        updateWhiteListToken,
        presaleMint,
        withdraw,
        mint,
        setMaxPerWallet,
        updateGoLiveDate
    };
};


