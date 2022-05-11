import * as React from 'react';
import Button from '@mui/material/Button';

import { Grid, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

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
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const CSVWidget = ({ addresses, onChange }) => {
    const rowsPerPage = 5;
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([...addresses]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => setPage(newPage);
    const renderCountColumn = Boolean(rows.length && rows[0].count !== undefined);

    const addRow = () => {
        setRows(prevState => [...prevState, { address: '0x1ADb0A678F41d4eD91169D4b8A5B3C149b92Fc46' }]);
    }

    const deleteRow = (address) => {
        setRows(prevState => prevState.filter(a => a.address !== address));
    }

    React.useEffect(() => { onChange(rows); }, [rows]);

    return (
        <Grid container={true} justifyContent="column" py={4} borderRadius={4}>
            <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ADDRESS</StyledTableCell>
                            {renderCountColumn && <StyledTableCell align="right">COUNT</StyledTableCell> || null}
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row">
                                    {row.address}
                                </StyledTableCell>
                                {renderCountColumn && <StyledTableCell align="right">{row.count}</StyledTableCell> || null}
                                <StyledTableCell align="right">
                                    <IconButton color="error" aria-label="delete" onClick={e => deleteRow(row.address)}>
                                        <CancelIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
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

            <Grid container={true} justifyContent="flex-end" mt={2} gap={2}>
                <Button variant="contained" size="small">Upload CSV</Button>
                <Button variant="contained" color="secondary" size="small" onClick={e => addRow()}>Add address</Button>
            </Grid>
        </Grid>
    );
};

export default CSVWidget;
