import React, { useEffect, useState } from 'react';

import { getWalletType } from '@ambition-blockchain/controllers';
import { Box, Container, Fade, Stack } from 'ds/components';
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

    const [contract, setContract] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();
    const { contracts } = useContract();

    const { walletController } = useWeb3();
    const isSetupComplete = contract?.nftCollection?.baseUri && contract?.address ? true : false;

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

    return (
        <Fade in>
            <Stack>
                <Box>
									{contract.blockchain == 'solana' || contract.blockchain =='solanadevnet' ? (
                    <img
                        style={{
                            height: '250px',
                            width: '100%',
                            objectFit: 'cover',
                        }}
											src="https://static.opensea.io/solana/home-banner.png"
                    />
									) : (
                    <img
                        style={{
                            height: '250px',
                            width: '100%',
                            objectFit: 'cover',
                        }}
                        src="https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/9019e/hero.webp"
                    />

									)}

                </Box>

                <Container>
                    <Stack sx={{ minHeight: '100vh' }} py={2} gap={5}>
                        <Header contract={contract} />

                        {!isSetupComplete ? (
                            <NotComplete
                                id={id}
                                contract={contract}
                                setIsModalOpen={setIsModalOpen}
                            />
                        ) : (
                            <Tabs id={id} contract={contract} />
                        )}
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
