import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import orderApi from '../../../api/orderApi.js';
import storageKeys from '../../../constants/storage-key.js';
import { formatDateTime, formatPrice } from '../../../Utils/common.js';
import useClock from '../../../Utils/useLock.jsx';
import './DashBoardDetail.scss';

function createData(
    customer,
    sale,
    room_id,
    total_price,
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
        room_id,
        type,
        id,
        info: [
            {
                created_at: created_at,
                additional_price: JSON.parse(additional_price),
                type_booking: type_booking,
                data: data,
                phone_customer: phone_customer,
                in_expected: in_expected,
                out_expected: out_expected,
                in_reality: in_reality,
                out_reality: out_reality,
                sale: sale,
                total_price: total_price,
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    // get userId in localstorage
    const userId = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

    const handleClickRemove = async () => {
        try {
            const data = await orderApi.delete({ user: userId }, row.id);
            window.location.reload();
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
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
                <TableCell align="center">{row.room_id}</TableCell>
                <TableCell align="center">{row.customer}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell width={200} align="center"></TableCell>
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
                                        <TableCell align="center">type_booking</TableCell>
                                        <TableCell align="center">price_order</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {row.info.map((infoRow, index) => (
                                        <>
                                            <TableRow key={index}>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.sale}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.created_at}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {(infoRow.additional_price[0]?.length !== 0 ||
                                                        (infoRow.additional_price[0]?.length === 0 && infoRow.additional_price?.length !== 1)) &&
                                                        infoRow.additional_price.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                            >
                                                                <p>{item?.info}: &nbsp;</p>

                                                                <span>{formatPrice(item?.price)}</span>
                                                            </div>
                                                        ))}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.type_booking}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {formatPrice(infoRow.total_price)}
                                                </TableCell>
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
                                    {row.info.map((infoRow, index) => (
                                        <>
                                            <TableRow key={index}>
                                                <TableCell align="center">{infoRow.phone_customer}</TableCell>
                                                <TableCell align="center">{formatDateTime(infoRow.in_expected)}</TableCell>
                                                <TableCell align="center">{formatDateTime(infoRow.out_expected)}</TableCell>
                                                <TableCell align="center">{formatDateTime(infoRow.in_reality)}</TableCell>
                                                <TableCell align="center">{formatDateTime(infoRow.out_reality)}</TableCell>
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

export default function DashBoardDetail() {
    const [page, setPage] = React.useState(0);
    const history = useHistory();
    const timeString = useClock();

    const {
        params: { roomId },
        url,
    } = useRouteMatch();

    const [RoomOrderList, setRoomOrderList] = React.useState([]);

    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        (async () => {
            if (roomId) {
                const orderByRoom = await orderApi.getOrderListByRoom({
                    room_id: roomId,
                });
                const orderList = orderByRoom.data.data;

                if (orderList) {
                    orderList.map((order, index) => {
                        if (order.in_reality && order.out_reality) {
                            if (
                                new Date(order.in_reality).getTime() < new Date(timeString).getTime() &&
                                new Date(order.out_reality).getTime() >= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'running';
                            }
                        } else if (order.in_reality && order.out_expected && order.out_reality !== null) {
                            if (
                                new Date(order.in_reality).getTime() <= new Date(timeString).getTime() &&
                                new Date(order.out_expected).getTime() <= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'running';
                            }
                        } else if (order.in_expected && order.out_expected) {
                            if (
                                new Date(order.in_expected).getTime() >= new Date(timeString).getTime() &&
                                new Date(order.out_expected).getTime() >= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'booked';
                            } else {
                                orderList.splice(index, 1);
                            }
                        }
                    });
                }
                setRoomOrderList(orderList);
            }
        })();
    }, [timeString === undefined]);

    const rows = [];
    for (let i = 0; i < RoomOrderList?.length; i++) {
        rows.push(
            createData(
                RoomOrderList[i].customer,
                RoomOrderList[i].sale,
                RoomOrderList[i].room_id,
                RoomOrderList[i].total_price,
                // formatPrice(RoomOrderList.RoomOrderList[i].fixed_price),
                RoomOrderList[i].additional_price,
                RoomOrderList[i].phone_customer,
                RoomOrderList[i].created_at,
                RoomOrderList[i].data,
                RoomOrderList[i].id,
                RoomOrderList[i].type_booking,
                RoomOrderList[i].in_expected,
                RoomOrderList[i].out_expected,
                RoomOrderList[i].in_reality,
                RoomOrderList[i].out_reality,
                RoomOrderList[i].type
            )
        );
    }

    return (
        <div className="dashboard-detail">
            <Button onClick={() => history.push(`/order-manager/create/${roomId}`)} variant="outlined">
                New order +
            </Button>
            <Typography> những order trong room id: {roomId} đang chờ hoặc đang sử dụng</Typography>

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>id</TableCell>
                            {/* <TableCell align="center">data</TableCell> */}
                            <TableCell align="center">room_id</TableCell>
                            <TableCell align="center">customer</TableCell>
                            <TableCell align="center">type</TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <Row key={index} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
