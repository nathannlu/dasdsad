import React, { useEffect } from 'react';

import { Divider, Grid, Stack, Typography } from 'ds/components';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { useModal } from 'ds/hooks/useModal';
import { useContractSettings } from '../hooks/useContractSettings';

import ActionCard from './ActionCard';
import CSVWidget from './CSVWidget';

import { getNftStorageTypeLabel } from 'ambition-constants';

const Actions = ({ contract, contractState, setIsIPFSModalOpen }) => {
    const actionCardRef = React.createRef();
    const {
        isMinting,
        isWithdrawing,
        mint,
        withdraw,

        updateSales,
        isSavingPublicSales,

        setPresales,
        airdrop,

        isSavingAirdrop,
        isSavingPreSales,

        whitelistAddresses,
        airdropAddresses,

        setWhitelistAddresses,
        setAirdropAddresses

    } = useContractSettings();

    const nftStorageType = getNftStorageTypeLabel(contract?.nftStorageType);
    const isEarningsToWithdrawAvailable = contractState?.balanceInEth && Number(contractState?.balanceInEth) > 0;

    const listOfActions = [
        {
            icon: <CreditScoreIcon />,
            title: 'Mint an NFT',
            description: 'Mint an NFT from your collection',
            isLoading: isMinting,
            isDisabled: !contractState?.isPublicSaleOpen,
            helperText: !contractState?.isPublicSaleOpen && 'Enable public sales to start minting!' || null,
            action: () => mint(1)
        },
        {
            icon: <AccountBalanceWalletIcon />,
            title: 'Withdraw your funds',
            description: 'Send the funds from your sale to your wallet.',
            isLoading: isWithdrawing,
            isDisabled: !isEarningsToWithdrawAvailable,
            helperText: !isEarningsToWithdrawAvailable && 'There are no earnings on this contract to be withdrawn!' || null,
            action: () => withdraw()
        },
        {
            icon: <FormatListNumberedIcon />,
            title: 'Create a new presale list',
            description: 'Upload list of wallets to set up early minting via merkle proofs',
            isLoading: isSavingPreSales,
            modal: {
                modal: <CSVWidget
                    count={1}
                    addresses={whitelistAddresses.map(a => ({ address: a }))}
                    onSave={addresses => {
                        const updatedAddresses = addresses.map(({ address }) => address);
                        actionCardRef?.current?.closeModal();

                        setWhitelistAddresses(updatedAddresses);
                        setPresales(true, updatedAddresses);
                    }}
                    saveButtonText="Save Whitelist and Open pre-sales"
                />,
                fullScreen: true,
                title: 'Create a new presale list'
            },
        },
        {
            icon: <SystemUpdateAltIcon />,
            title: 'Airdrop your NFT',
            description: 'Used to reward users with a free NFT. Use this function to send NFTs to your community.',
            isLoading: isSavingAirdrop,
            modal: {
                modal: <CSVWidget
                    addresses={airdropAddresses}
                    onSave={addresses => {
                        const updatedAddresses = addresses.map(({ address, count }) => ({ address, count }));
                        actionCardRef?.current?.closeModal();
                        setAirdropAddresses(updatedAddresses);
                        airdrop(updatedAddresses);
                    }}
                    saveButtonText="Save Airdrop list and send NFTs"
                />,
                fullScreen: true,
                title: 'Airdrop your NFT'
            },
        },
        {
            icon: <UploadFileIcon />,
            title: 'Re-Upload NFT Collection',
            description: `We allow re-uploading NFT collection to ${nftStorageType}`,
            action: () => setIsIPFSModalOpen(true)
        }
    ];

    return (
        <Stack gap={1} mt={4}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Actions</Typography>
            </Stack>
            <Divider />

            <Grid container>
                {listOfActions.map((action, i) => <ActionCard key={i} ref={actionCardRef} {...action} />)}
            </Grid>
        </Stack>
    );
};

export default Actions;