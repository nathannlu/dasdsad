import React, { useEffect, useState } from 'react';

import { getWalletType } from '@ambition-blockchain/controllers';
import { Box, Container, Fade, Stack } from 'ds/components';
import { Alert } from '@mui/material';

import { useToast } from 'ds/hooks/useToast';

import { useWeb3 } from 'libs/web3';
import { useParams } from 'react-router-dom';
import { useContract } from 'services/blockchain/provider';
import Header from './Header';
import IPFSModal from './IPFSModal';
import NotComplete from './NotComplete';
import Tabs from './Tabs';

const Upload = (props) => {
    const { addToast } = useToast();
    const { id } = useParams();
    const { contracts } = useContract();
    const { walletController } = useWeb3();
    const [contract, setContract] = useState({});
    const isSetupComplete = !!(contract?.nftCollection?.baseUri && contract?.address);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [state, setState] = useState({ errorMessage: null });

    const handleError = (e) => {
        console.error(e);
        addToast({ severity: 'error', message: e.message });
        location.href = '/smart-contracts';
    }

    const getContract = async () => {
        try {
            const c = contracts.find((c) => c.id == id);
            if (!c) {
                throw new Error('Contract details not found!');
            }

            setContract(c);

            const walletType = getWalletType(c?.blockchain);

            console.log(walletType, 'walletType', c?.blockchain);

            await walletController?.loadWalletProvider(walletType);
            await walletController?.compareNetwork(c?.blockchain, async (error) => {
                if (error) {
                    handleError(error);
                    return;
                }
            });
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        if (!contracts || !contracts.length) return;
        getContract();
    }, [contracts]);

    const bannerImage = contract.blockchain === 'solana' || contract.blockchain === 'solanadevnet'
        && "https://static.opensea.io/solana/home-banner.png"
        || "https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/9019e/hero.webp";

    return (
        <Fade in>
            <Stack>
                <Box>
                    <img style={{ height: '250px', width: '100%', objectFit: 'cover' }} src={bannerImage} />
                </Box>

                <Container>
                    <Stack sx={{ minHeight: '100vh' }} py={2} gap={5}>
                        <Header contract={contract} />

                        {state.errorMessage && <Alert severity="error" sx={{ mt: 2, maxWidth: '720px' }}>{state.errorMessage}</Alert>
                            || isSetupComplete && <Tabs id={id} contract={contract} renderError={errorMessage => setState(prevState => ({ ...prevState, errorMessage }))} />
                            || <NotComplete id={id} contract={contract} setIsModalOpen={setIsModalOpen} />}

                    </Stack>

                    <IPFSModal
                        id={id}
                        contract={contract}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                    />
                </Container>
            </Stack>
        </Fade>
    );
};

export default Upload;
