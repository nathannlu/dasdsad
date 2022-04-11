import React from 'react';
import { WalletProviderProps } from '@solana/wallet-adapter-react';
import { WalletProvider } from '@solana/wallet-adapter-react';

import {
    PhantomWalletAdapter,
    // getLedgerWallet,
    // getMathWallet,
    //   getSolflareWallet,
    //   getSolletWallet,
    // getSolongWallet,
} from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// import('@solana/wallet-adapter-react-ui/styles.css' as any) ;

export function ClientWalletProvider({ children }) {
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    return (
        <WalletProvider wallets={wallets}>
            <WalletModalProvider />
            {children}
        </WalletProvider>
    );
}

export default ClientWalletProvider;
