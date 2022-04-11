import { useState, useRef } from 'react';
import { useStopUserSubscription } from 'gql/hooks/billing.hook';
import { useToast } from 'ds/hooks/useToast';

export const useBilling = () => {
    const [transactions, setTransactions] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterKey, setFilterKey] = useState('');
    const [anchorEls, setAnchorEls] = useState([]);
    const confirmationModalRef = useRef(null);
    const { addToast } = useToast();
    const [stopUserSubscription] = useStopUserSubscription({
        onCompleted: (data) => {
            if (data.stopUserSubscription) {
                addToast({
                    severity: 'success',
                    message: 'Subscription successfully cancelled.',
                });
            }
        },
    });

    const onCompleteUserSubscription = (data) => {
        const { getUserSubscriptions } = data;
        setTransactions(getUserSubscriptions);
    };

    const onMenuOpen = (idx, e) => {
        let tempState = [...anchorEls];
        tempState[idx] = e.target;
        setAnchorEls(tempState);
    };

    const onMenuClose = (idx) => {
        let tempState = [...anchorEls];
        tempState[idx] = null;
        setAnchorEls(tempState);
    };

    const onCancelSubscription = (idx) => {
        const productType = transactions[idx].productType;
        confirmationModalRef.current.show({
            title: 'Are you sure you want to cancel subscription?',
            description: `Cancelling this subscription will render your ${
                productType === 'Contract' ? 'NFT Collection' : 'Website'
            } inactive`,
            data: {
                transactionIndex: idx,
            },
        });
    };

    const onCancel = async (data) => {
        const isCanceled = transactions[data.transactionIndex].isCanceled;
        if (isCanceled) {
            addToast({
                severity: 'error',
                message: 'Subscription was cancelled already.',
            });
            return;
        }
        const subscriptionId = transactions[data.transactionIndex].id;
        await stopUserSubscription({ variables: { subscriptionId } });
        window.location.reload(true);
    };

    const onChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const onChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 8));
        setPage(0);
    };

    const getDateFromTimestamp = (timestamp) => {
        const a = new Date(timestamp * 1000);
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        return `${a.getDate()} ${months[a.getMonth()]} ${a.getFullYear()}`;
    };

    return {
        transactions,
        page,
        rowsPerPage,
        filterKey,
        anchorEls,
        confirmationModalRef,
        getDateFromTimestamp,
        setFilterKey,
        onCompleteUserSubscription,
        onCancel,
        onCancelSubscription,
        onMenuClose,
        onMenuOpen,
        onChangePage,
        onChangeRowsPerPage,
    };
};
