import { Box, Button, Collapse, IconButton, Pagination, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../Utils/common.js';
import './OrderManager.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RoomApi from '../../api/RoomApi.js';
import storageKeys from '../../constants/storage-key.js';
import { useHistory } from 'react-router-dom';
import orderApi from '../../api/orderApi.js';
import { getRoomOrderList } from '../../features/RoomOrderList/components/RoomOrderCard/RoomOrderSlice.js';
import { unwrapResult } from '@reduxjs/toolkit';

function createData(
    customer,
    sale,
    additional_price,
    phone_customer,
    created_at,
    data,
    id,
    type_booking,
    in_expected,
    out_expected,
    in_reality,
    out_reality,
    type
) {
    return {
        data,
        customer,
        type_booking,
        type,
        id,
        info: [
            {
                created_at: created_at,
                additional_price: additional_price,
                data: data,
                phone_customer: phone_customer,
                in_expected: in_expected,
                out_expected: out_expected,
                in_reality: in_reality,
                out_reality: out_reality,
                sale: sale,
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    // get userId in localstorage
    const userId = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

    const handleClickRemove = async () => {
        try {
            const data = await orderApi.delete({ user: userId }, row.id);
            console.log(data);

            const action = getRoomOrderList({ page: 1, limit: 10 });
            const resultAction = await dispatch(action);
       
        } catch (error) {
            console.log('fail to remove room ', error.message);
        }
    };
    const handleClickUpdate = () => {
        history.push(`/order-manager/${row.id}`);
    };

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.id}
                </TableCell>

                {/* <TableCell align="center">{JSON.parse(row.data[0]?.room_name)}</TableCell>
                <TableCell align="center">{JSON.parse(row.data[0]?.room_id)}</TableCell> */}
                <TableCell align="center">{row.type_booking}</TableCell>
                <TableCell align="center">{row.customer}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell width={200} align="center">
                    <Button onClick={() => handleClickUpdate()} color="success" variant="outlined">
                        Update
                    </Button>
                    <Button onClick={() => handleClickRemove()} color="error" variant="outlined">
                        Remove
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                info
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">sale</TableCell>

                                        <TableCell align="center">create_at</TableCell>
                                        <TableCell align="center">additional_price</TableCell>
                                        <TableCell align="center">room_id</TableCell>
                                        <TableCell align="center">room_name</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {row.info.map((infoRow) => (
                                        <>
                                            <TableRow key={infoRow.created_at}>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.sale}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.created_at}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.additional_price}
                                                </TableCell>
                                                {infoRow.data !== 'null' ? (
                                                    <>
                                                        <TableCell align="center">{JSON.parse(infoRow.data)[0].room_id}</TableCell>
                                                        <TableCell align="center">{JSON.parse(infoRow?.data)[0].room_name}</TableCell>
                                                    </>
                                                ) : null}
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                                <br />
                                <br />

                                <TableHead>
                                    <TableCell align="center">phone_customer</TableCell>
                                    <TableCell align="center">in_expected</TableCell>
                                    <TableCell align="center">out_expected</TableCell>
                                    <TableCell align="center">in_reality</TableCell>
                                    <TableCell align="center">out_reality</TableCell>
                                </TableHead>
                                <TableBody>
                                    {row.info.map((infoRow) => (
                                        <>
                                            <TableRow>
                                                <TableCell align="center">{infoRow.phone_customer}</TableCell>
                                                <TableCell align="center">{infoRow.in_expected}</TableCell>
                                                <TableCell align="center">{infoRow.out_expected}</TableCell>
                                                <TableCell align="center">{infoRow.in_reality}</TableCell>
                                                <TableCell align="center">{infoRow.out_reality}</TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function OrderManager() {
    const [page, setPage] = React.useState(0);
    const RoomOrderList = useSelector((state) => state.order);
    React.useEffect(() => {

    },[RoomOrderList]);
    console.log('RoomOrderList', RoomOrderList);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = [];
    for (let i = 0; i < RoomOrderList.RoomOrderList?.length; i++) {
        rows.push(
            createData(
                RoomOrderList.RoomOrderList[i].sale,
                RoomOrderList.RoomOrderList[i].customer,
                // formatPrice(RoomOrderList.RoomOrderList[i].fixed_price),
                RoomOrderList.RoomOrderList[i].additional_price,
                RoomOrderList.RoomOrderList[i].phone_customer,
                RoomOrderList.RoomOrderList[i].created_at,
                RoomOrderList.RoomOrderList[i].data,
                RoomOrderList.RoomOrderList[i].id,
                RoomOrderList.RoomOrderList[i].type_booking,
                RoomOrderList.RoomOrderList[i].in_expected,
                RoomOrderList.RoomOrderList[i].out_expected,
                RoomOrderList.RoomOrderList[i].in_reality,
                RoomOrderList.RoomOrderList[i].out_reality,
                RoomOrderList.RoomOrderList[i].type
            )
        );
    }

    React.useEffect(() => {
        setRowsPerPage(RoomOrderList.pagination.limit);
    }, [RoomOrderList.pagination.limit]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>id</TableCell>
                            {/* <TableCell align="center">data</TableCell> */}
                            <TableCell align="center">type_booking</TableCell>
                            <TableCell align="center">customer</TableCell>
                            <TableCell align="center">type</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
