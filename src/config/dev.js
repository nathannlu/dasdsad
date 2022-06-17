export default {
    serverUrl: 'http://localhost:4000',
    stripe: {
        publicKey:
            'pk_test_51IwVBBJUIYorshTCCHqCB7hCk7DFVsR5ewLuX6KZQOsHpF89fXkgbaMbF5uTs3RPNsRV7VRjw6XZPCNxr9DFTyA50041b8JZZR',
        products: {
            contract: 'prod_L0rXZAhMMYdYxv',
            website: 'prod_L2Pkc8cppIQBjb',
        },
    },
    pinata: {
        key: '909f40b05b1344f8e789',
        secret: 'caf463c48639ee834e3d52c00f8304b5b985645ff872fbf5745dc76cd05b8f3b',
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OTg1NDk3NC0yZjZlLTRjMzYtODdkMS1jNzdmM2M3MzU5YTEiLCJlbWFpbCI6Im5hdGhhbkBhZ2VudHNxdWFyZS5jYSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5MDlmNDBiMDViMTM0NGY4ZTc4OSIsInNjb3BlZEtleVNlY3JldCI6ImNhZjQ2M2M0ODYzOWVlODM0ZTNkNTJjMDBmODMwNGI1Yjk4NTY0NWZmODcyZmJmNTc0NWRjNzZjZDA1YjhmM2IiLCJpYXQiOjE2NDE1MTk1Nzl9.VuRzAVIx0gcGM8NMy2YAs0pw6mUOm6RBCXxUgiopQ1s',
    },
    uploadcare: {
        publicKey: 'dfeba611508a6f7760ca',
        secretKey: '279067b46a3249a1fe39',
    },
    company: {
        walletAddress: '0xfd6c3bD6dB6D7cbB77Ee64d1E406B2ACB63A5166', // acc 2 on rinkeby
    },
    etherscan: {
        key: 'UI9IGQR2RXFAUKDYHMEXFEVT1GKPX8JIYY'
    }
};
