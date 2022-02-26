import React, { useEffect } from 'react';
import { Fade, Box, Stack, Grid, Typography, Button, IconButton } from 'ds/components';
import { useWeb3 } from 'libs/web3';
import { useGetNonceByAddress, useVerifySignaturePhantom } from 'gql/hooks/users.hook';
import { useLoginForm } from '../hooks/useLoginForm';
import posthog from 'posthog-js';
import { useToast } from 'ds/hooks/useToast';

const PhantomButton = () => {
    const { account, loadPhantom, signNoncePhantom } = useWeb3()
	const { handleLoginSuccess } = useLoginForm();
    const { addToast } = useToast();

    const [getNonceByAddress] = useGetNonceByAddress({
		address: account
	})
    const [verifySignaturePhantom] = useVerifySignaturePhantom({
		onCompleted: async data => {
			posthog.capture('User logged in with phantom', {$set: {
				publicAddress: account
			}});

			await handleLoginSuccess();
		}
	})

    const onClick = async () => {
		try {
            await loadPhantom();
            const res = await getNonceByAddress();
		    const nonce = res.data.getNonceByAddress;
            const signature = await signNoncePhantom(nonce);
            await verifySignaturePhantom({variables: {address: signature.publicKey, signature: signature.signature}});
        }
        catch(err) {
            console.log(err);
            addToast({
                severity: 'error',
                message: err.message
            })
        }
	}

    return (
        <Button
			startIcon={<img style={{width:'20px'}} src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/sqzgmbkggvc1uwgapeuy" />} 
			fullWidth 
			onClick={onClick} 
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