import React, { useEffect } from 'react';
import { Fade, Box, Stack, Grid, Typography, Button, IconButton } from 'ds/components';
import { useWeb3 } from 'libs/web3';

const PhantomButton = () => {
    const { loginToWallet } = useWeb3();

    return (
        <Button
			startIcon={<img style={{width:'20px'}} src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/sqzgmbkggvc1uwgapeuy" />} 
			fullWidth 
			onClick={() => loginToWallet('phantom')} 
			variant="contained" 
            style={{
                backgroundColor: 'rgb(25,26,36)',
                color: 'white',
                textTransform: 'none'
            }}
		>
			Continue with Phantom
		</Button>
    )
}

export default PhantomButton
