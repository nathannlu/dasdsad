import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from 'libs/auth';
import { Fade, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem, IconButton, TextField, ListItemText, ListItemIcon } from 'ds/components';
import { TableContainer, Paper, Chip, TablePagination } from '@mui/material';
import { useGetUserSubscriptions, useStopUserSubscription } from 'gql/hooks/billing.hook';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from 'ds/hooks/useToast';

const Payment = () => {
	const { user } = useAuth();
	const [transactions, setTransactions] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterKey, setFilterKey] = useState('');
    const [anchorEls, setAnchorEls] = useState([]);
    const confirmationModalRef = useRef(null);
    const { addToast } = useToast();
    const [ stopUserSubscription ] = useStopUserSubscription({
		onCompleted: data => {
			if (data.stopUserSubscription) {
                addToast({
                    severity: 'success',
                    message: "Subscription successfully cancelled."
                });
            }
		}
	});

    useGetUserSubscriptions({
		customerId: user.stripeCustomerId,
        onCompleted: async data => {
            onCompleteUserSubscription(data);
        }
	});

    const onCompleteUserSubscription = (data) => {
        const { getUserSubscriptions } = data;
        setTransactions(getUserSubscriptions);
    }

    const getDateFromTimestamp = (timestamp) => {
        const a = new Date(timestamp * 1000);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${a.getDate()} ${months[a.getMonth()]} ${a.getFullYear()}`;
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 8));
        setPage(0);
    };

    const handleMenuOpen = (idx, e) => {
        let tempState = [...anchorEls];
        tempState[idx] = e.target;
        setAnchorEls(tempState);
    }

    const handleMenuClose = (idx) => {
        let tempState = [...anchorEls];
        tempState[idx] = null;
        setAnchorEls(tempState);
    }

    const handleCancelSubscription = (idx) => {
        const productType = transactions[idx].productType;
        confirmationModalRef.current.show({
            title: "Are you sure you want to cancel subscription?",
            description: `Cancelling this subscription will render your ${productType === "Contract" ? "NFT Collection" : "Website"} inactive`,
            data: {
                transactionIndex: idx
            }
        });
    }

    const handleConfirmCancel = async (data) => {
        const isCanceled = transactions[data.transactionIndex].isCanceled;
        if (isCanceled) {
            addToast({
                severity: 'error',
                message: "Subscription was cancelled already."
            });
            return;
        }
        const subscriptionId = transactions[data.transactionIndex].id;
        await stopUserSubscription({variables: { subscriptionId }});
        window.location.reload(true);
    }

	return (
		<Fade in>
			<Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                width='full'
                height='100%'
            >
                <ConfirmationModal 
                    ref={confirmationModalRef}
                    onConfirm={handleConfirmCancel}
                />
                <Box
                    marginTop='10em'
                    maxWidth='1000px'
                    width='100%'
                >
                    <Typography fontSize='24pt' marginBottom='1em'>
                        Your Transactions
                    </Typography>
                    <Box
                        display='flex'
                        justifyContent='flex-end'
                        marginBottom='.5em'
                    >
                        <TextField label="Filter" variant="standard" autoComplete='off' value={filterKey} onChange={(e) => setFilterKey(e.target.value)}></TextField>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label='Transaction List' >
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Start</TableCell>
                                    <TableCell>End</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions && 
                                    (rowsPerPage > 0
                                        ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : transactions
                                    )
                                    .filter((row) => JSON.stringify(row).includes(filterKey))
                                    .map((transaction, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{transaction.id}</TableCell>
                                        <TableCell>
                                            <Chip label={transaction.productType} size="small" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label='Stripe' color='primary' size="small" />
                                        </TableCell>
                                        <TableCell>${transaction.price.substring(0, transaction.price.length - 2)}.{transaction.price.substring(transaction.price.length - 2)}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={transaction.isCanceled ? "Canceled" : "Active" } 
                                                size="small" 
                                                sx={{
                                                    backgroundColor: transaction.isCanceled ? 'gray' : 'green',
                                                    color: 'white'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{getDateFromTimestamp(transaction.startDate)}</TableCell>
                                        <TableCell>{getDateFromTimestamp(transaction.endDate)}</TableCell>
                                        <TableCell>
                                        <IconButton 
                                            aria-label="Settings"
                                            color='secondary'
                                            onClick={(e) => handleMenuOpen(idx, e)}
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEls[idx]}
                                            open={Boolean(anchorEls[idx])}
                                            onClose={() => handleMenuClose(idx)}
                                        >
                                            <MenuItem onClick={() => handleCancelSubscription(idx)}>
                                                <ListItemIcon>
                                                    <CancelIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText>Cancel Subscription</ListItemText>
                                            </MenuItem>
                                        </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box
                        marginTop='1em'
                        display='flex'
                        justifyContent='center'
                    >
                        {transactions && (
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={transactions.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
		</Fade>
	)
};

export default Payment
