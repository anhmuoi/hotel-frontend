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
import { useSnackbar } from 'notistack';

function createData(name, priceMonth, priceInvestDate, description, created_at, id) {
    // if (typeof DepreciationTime === 'string' || DepreciationTime instanceof String) {
    //     DepreciationTime = JSON.parse(DepreciationTime);
    // }
    return {
        name,

        priceMonth,
        priceInvestDate,
        id,
        info: [
            {
                created_at: created_at,
                description: description,
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
            const data = await RoomApi.delete(row.id);
            const action = getRoomList({ page: 1, limit: 10 });
            const resultAction = await dispatch(action);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
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

                <TableCell align="center">{row.priceMonth}</TableCell>
                <TableCell align="center">{row.priceInvestDate}</TableCell>
                <TableCell width={200} align="center">
                    <Button
                        onClick={() => handleClickUpdate()}
                        disabled={JSON.parse(localStorage.getItem(storageKeys.USER)).type === 'user'}
                        color="success"
                        variant="outlined"
                    >
                        Update
                    </Button>
                    <Button
                        onClick={() => handleClickRemove()}
                        color="error"
                        disabled={JSON.parse(localStorage.getItem(storageKeys.USER)).type === 'user'}
                        variant="outlined"
                    >
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
                                        <TableCell align="center">description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.info.map((infoRow) => (
                                        <TableRow key={infoRow.created_at}>
                                            <TableCell align="center" component="th" scope="row">
                                                {infoRow.created_at}
                                            </TableCell>
                                            <TableCell align="center">{infoRow.description}</TableCell>
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
    console.log(roomList);

    const rows = [];
    for (let i = 0; i < roomList.RoomList?.length; i++) {
        rows.push(
            createData(
                roomList.RoomList[i].name,

                formatPrice(roomList.RoomList[i].fixed_price),
                roomList.RoomList[i].investment_price,
                roomList.RoomList[i].description,
                roomList.RoomList[i].created_at,
                roomList.RoomList[i].id
            )
        );
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">id</TableCell>
                            <TableCell align="center">name</TableCell>

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
