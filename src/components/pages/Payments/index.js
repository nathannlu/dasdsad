import React from 'react';
import { useAuth } from 'libs/auth';
import { Fade, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Menu, MenuItem, IconButton, TextField, ListItemText, ListItemIcon } from 'ds/components';
import { TableContainer, Paper, Chip, TablePagination } from '@mui/material';
import { useGetUserSubscriptions } from 'gql/hooks/billing.hook';
import SettingsIcon from '@mui/icons-material/Settings';
import CancelIcon from '@mui/icons-material/Cancel';
import ConfirmationModal from './ConfirmationModal';
import { useBilling } from './hooks/useBilling'; 

const Payment = () => {
	const { user } = useAuth();
    const {
        transactions,
        page,
        rowsPerPage,
        filterKey, 
        anchorEls,
        confirmationModalRef, 
        onCompleteUserSubscription,
        onCancelSubscription,
        onCancel,
        onChangePage,
        onChangeRowsPerPage,
        onMenuOpen,
        onMenuClose,
        getDateFromTimestamp,
        setFilterKey } = useBilling();

    useGetUserSubscriptions({
		customerId: user.stripeCustomerId,
        onCompleted: async data => {
            onCompleteUserSubscription(data);
        }
	});

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
                    onConfirm={onCancel}
                />
                <Box
                    marginTop='6em'
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
                                            onClick={(e) => {
                                                if (transaction.isCanceled) return;
                                                onMenuOpen(idx, e);
                                            }}
                                        >
                                            <SettingsIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEls[idx]}
                                            open={Boolean(anchorEls[idx])}
                                            onClose={() => onMenuClose(idx)}
                                        >
                                            <MenuItem onClick={() => onCancelSubscription(idx)}>
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
                                onPageChange={onChangePage}
                                onRowsPerPageChange={onChangeRowsPerPage}
                            />
                        )}
                    </Box>
                </Box>
            </Box>
		</Fade>
	)
};

export default Payment
