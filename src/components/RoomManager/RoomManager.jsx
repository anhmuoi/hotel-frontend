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
import './RoomManager.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RoomApi from '../../api/RoomApi.js';
import storageKeys from '../../constants/storage-key.js';
import { useHistory } from 'react-router-dom';
import { getRoomList } from '../../features/RoomList/components/RoomCard/RoomCardSlice.js';

function createData(name, location, priceMonth, priceInvestDate, DepreciationTime, created_at, data, id) {
    return {
        name,
        location,
        priceMonth,
        priceInvestDate,
        id,
        info: [
            {
                created_at: created_at,
                DepreciationTime: DepreciationTime,
                data: data,
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
            const data = await RoomApi.delete({ user: userId }, row.id);
            const action = getRoomList({ page: 1, limit: 10 });
            const resultAction = await dispatch(action);
        } catch (error) {
            console.log('fail to remove room ', error.message);
        }
    };
    const handleClickUpdate = () => {
        history.push(`/room-manager/${row.id}`);
    };

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                    {row.id}
                </TableCell>
                <TableCell align="center">{row.name}</TableCell>

                <TableCell align="center">{row.location}</TableCell>
                <TableCell align="center">{row.priceMonth}</TableCell>
                <TableCell align="center">{row.priceInvestDate}</TableCell>
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
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                info
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">create_at</TableCell>
                                        <TableCell align="center">DepreciationTime</TableCell>
                                        <TableCell align="center">data</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.info.map((infoRow) => (
                                        <TableRow key={infoRow.created_at}>
                                            <TableCell align="center" component="th" scope="row">
                                                {infoRow.created_at}
                                            </TableCell>
                                            <TableCell align="center">{infoRow.DepreciationTime}</TableCell>
                                            <TableCell align="center">{infoRow.data}</TableCell>
                                        </TableRow>
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

export default function RoomManager() {
    const [page, setPage] = React.useState(0);
    const roomList = useSelector((state) => state.room);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    console.log(roomList.RoomList, 'sdfhj');
    const rows = [];
    for (let i = 0; i < roomList.RoomList?.length; i++) {
        rows.push(
            createData(
                roomList.RoomList[i].name,
                roomList.RoomList[i].location,
                formatPrice(roomList.RoomList[i].fixed_price),
                roomList.RoomList[i].investment_price,
                roomList.RoomList[i].depreciation_period,
                roomList.RoomList[i].created_at,
                roomList.RoomList[i].data,
                roomList.RoomList[i].id
            )
        );
    }

    React.useEffect(() => {
        setRowsPerPage(roomList.pagination.limit);
    }, [roomList.pagination.limit]);

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
                            <TableCell align="center">id</TableCell>
                            <TableCell align="center">name</TableCell>
                            <TableCell align="center">location</TableCell>
                            <TableCell align="center">priceMonth</TableCell>
                            <TableCell align="center">priceInvestDate</TableCell>
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
