import * as React from 'react';
import Papa from "papaparse";

import { Grid, IconButton, TextField, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Button, { buttonClasses } from '@mui/material/Button';

import { styled } from '@mui/material/styles';

import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledButton = styled(Button)(({ theme }) => ({
    [`&.${buttonClasses.root}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&.error': {
        '& td, & th': {
            color: 'red !important',
        }
    },
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

/**
 * 
 * @param {*} count: if undefined the count static value will be set against address 
 * @returns Array<{
 *      address: string;
 *      count: number;
 * }>
 */
const CSVWidget = ({ addresses, count, onSave }) => {
    const hiddenFileInput = React.useRef(null);

    const rowsPerPage = 5;
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(null);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => setPage(newPage);

    const addRow = () => setRows(prevState => {
        const newRows = [...prevState, { address: '', count: 1, isError: false, isEdit: true }];
        return mergeAddresses(newRows);
    });

    const deleteRow = (address) => setRows(prevState => prevState.filter(a => a.address !== address));

    const editRow = (address, isEdit) => setRows(prevState => {
        const newRows = prevState.map(a => {
            if (a.address === address) {
                return { ...a, isEdit };
            }
            return a;
        });
        return mergeAddresses(newRows);
    });

    const mergeAddresses = (rows) => rows.reduce((rows, row) => {
        const found = rows.find(r => r.address === row.address);
        if (found) {
            return rows.map(r => {
                if (r.address === row.address) {
                    return { ...r, count: Number(r.count) + Number(row.count) };
                }
                return r;
            });
        }
        return [...rows, row];
    }, []);

    const validateRows = () => {
        let isInvalid = false;

        setRows(prevState => {
//            const newRows = prevState.map(r => ({ ...r, isError: !!(!r.address || !r.address.length || isNaN(r.count) || r.isEdit) }));
            const newRows = prevState.map(r => ({ ...r, isError: false }));

            console.log(newRows);
            isInvalid = false; // !!newRows.find(r => r.isEdit || r.isError);
            return newRows;
        });

        return isInvalid;
    }

    const handleChange = event => {
        const file = event.target.files[0];
        if (file.type.indexOf('csv') === -1) {
            setIsError('Inavlid! file type.');

            //clear error
            setTimeout(() => setIsError(null), 9000);
            return;
        }

        setIsLoading(true);

        Papa.parse(file, {
            complete: function (results) {
                setIsLoading(false);
                const newRows = results.data.reduce((rows, row) => {
                    if (!row[0]) {
                        return rows;
                    }
                    return ([...rows, { address: row[0], count: count || row[1], isError: false }])
                }, []);

                console.log(newRows, results.data);

                setRows(prevState => mergeAddresses([...prevState, ...newRows]));
            }
        });
    };

    const handleAddressChange = (value, address) => {
        setRows(prevState => {
            const newRows = prevState.map(a => {
                if (a.address === address) {
                    return { ...a, address: value };
                }
                return a;
            });
            return newRows;
        });
    }

    const handleCountChange = (value, address) => {
        setRows(prevState => {
            const newRows = prevState.map(a => {
                if (a.address === address) {
                    return { ...a, count: value };
                }
                return a;
            });
            return newRows;
        });
    }

    const handleOnSave = () => {
        if (validateRows()) {
            setIsError('Inavlid data! Please remove invalid addresses.');

            //clear error
            setTimeout(() => setIsError(null), 9000);
            return;
        }
        onSave(rows);
    }

    React.useEffect(() => {
        setRows(addresses.map(a => ({ ...a, isError: false, isEdit: false })));
    }, [addresses]);

    return (
        <Grid container={true} justifyContent="column" py={4} borderRadius={4}>
            <Typography color="GrayText" sx={{ fontStyle: 'italic', mb: 4 }}>
                If you want to insert a batch of wallets you can upload a CSV with all the addresses and tokens. If all wallets are just getting one token, you can upload a CSV file simply with the addresses. The CSV should have the addresses as the first column and the quantity as optional second column. You don't need to add any headers to the CSV file. Repeated addresses are allowed and Ambition will simply add them up (e.g if an address shows up twice in the CSV file, that address will get 2 tokens).
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ADDRESS</StyledTableCell>
                            <StyledTableCell align="right">COUNT</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <StyledTableRow key={row.address} className={row.isError && 'error'}>

                                <StyledTableCell component="th" scope="row">
                                    {row.isEdit && <TextField fullWidth={true} value={row.address} onChange={e => handleAddressChange(e.target.value, row.address)} error={row.isError} /> || row.address}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    {row.isEdit && !count && <TextField value={count || row.count} onChange={e => handleCountChange(e.target.value, row.address)} error={row.isError} /> || count || row.count}
                                </StyledTableCell>

                                <StyledTableCell align="right" sx={{ gap: 2 }}>
                                    {row.isEdit && <IconButton color="primary" aria-label="edit" onClick={e => editRow(row.address, false)}>
                                        <CheckCircleIcon color='success' />
                                    </IconButton> || null}

                                    {!row.isEdit && <React.Fragment>
                                        <IconButton color="primary" aria-label="edit" onClick={e => editRow(row.address, true)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" aria-label="delete" onClick={e => deleteRow(row.address)}>
                                            <CancelIcon />
                                        </IconButton>
                                    </React.Fragment> || null}
                                </StyledTableCell>

                            </StyledTableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={3} />
                            </TableRow>
                        )}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={3}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPageOptions={[rowsPerPage]}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            {isError && <Grid container={true} justifyContent="flex-start" mt={2} gap={2}>
                <Typography color="error">{isError}</Typography>
            </Grid> || null}

            <Grid container={true} justifyContent="flex-end" mt={2} gap={2}>
                <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} accept=".csv" />
                <Button variant="contained" size="small" disabled={isLoading} onClick={e => hiddenFileInput.current.click()}>Upload CSV</Button>
                <Button variant="contained" color="secondary" size="small" onClick={e => addRow()}>Add address</Button>
                <StyledButton variant="contained" color="secondary" size="small" onClick={e => handleOnSave()}>Save</StyledButton>
            </Grid>
        </Grid>
    );
};

export default CSVWidget;
