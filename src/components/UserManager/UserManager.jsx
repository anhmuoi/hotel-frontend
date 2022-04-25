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
import './UserManager.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RoomApi from '../../api/RoomApi.js';
import storageKeys from '../../constants/storage-key.js';
import { useHistory } from 'react-router-dom';
import orderApi from '../../api/orderApi.js';
import userApi from '../../api/userApi.js';
import { useSnackbar } from 'notistack';

function createData(id, name, email, phone, location, created_at, data, type) {
    return {
        id,
        name,
        email,
        type,
        info: [
            {
                location: location,
                created_at: created_at,
                data: data,
                phone: phone,
            },
        ],
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    // get userId in localstorage
    const userId = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

    const handleClickRemove = async () => {
        try {
            const data = await userApi.delete({ user: userId }, row.id);
            window.location.reload();
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };
    const handleClickUpdate = () => {
        history.push(`/user-manager/${row.id}`);
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
                <TableCell align="center">{row.name}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell width={200} align="center">
                    <Button
                        onClick={() => handleClickUpdate()}
                        disabled={row.id !== userId || JSON.parse(localStorage.getItem(storageKeys.USER)).data.type === 'user'}
                        color="success"
                        variant="outlined"
                    >
                        Update
                    </Button>
                    <Button
                        onClick={() => handleClickRemove()}
                        color="error"
                        disabled={JSON.parse(localStorage.getItem(storageKeys.USER)).data.type === 'user'}
                        variant="outlined"
                    >
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
                                        <TableCell align="center">phone</TableCell>

                                        <TableCell align="center">location</TableCell>
                                        <TableCell align="center">create_at</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {row.info.map((infoRow) => (
                                        <>
                                            <TableRow key={infoRow.created_at}>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.phone}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.location}
                                                </TableCell>
                                                <TableCell align="center" component="th" scope="row">
                                                    {infoRow.created_at}
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                                <br />
                                <br />
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function UserManager({ userList }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const rows = [];
    for (let i = 0; i < userList?.length; i++) {
        rows.push(
            createData(
                userList[i].id,
                userList[i].name,
                userList[i].email,
                userList[i].phone,
                userList[i].location,
                userList[i].created_at,
                userList[i].data,
                userList[i].type
            )
        );
    }

    // React.useEffect(() => {
    //     setRowsPerPage(userList.pagination.limit);
    // }, [userList.pagination.limit]);

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
                            <TableCell align="center">name</TableCell>
                            <TableCell align="center">email</TableCell>
                            <TableCell align="center">type</TableCell>

                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
