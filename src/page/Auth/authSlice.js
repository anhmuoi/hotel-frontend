import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import authApi from '../../api/authApi.js';
import storageKeys from '../../constants/storage-key.js';

export const register = createAsyncThunk('user/register', async (payload) => {
    //call api
    const { config } = await authApi.register(payload);
    // save data to localStorage
    // console.log(config.data);
    // const data = JSON.parse(config.data);

    // const dataLogin = {};
    // if (data.email) {
    //     dataLogin.email = data.email;
    //     dataLogin.password = data.password;
    // }
    // // localStorage.setItem(storageKeys.ACCESS_TOKEN, data.api_token);
    // // localStorage.setItem(storageKeys.USER, JSON.stringify(data.user));
    return true;
});

export const login = createAsyncThunk('user/login', async (payload) => {
    //call api
    const { data } = await authApi.login(payload);
    console.log(data);
    // save data to localStorage
    localStorage.setItem(storageKeys.ACCESS_TOKEN, data.api_token);
    localStorage.setItem(storageKeys.USER, JSON.stringify(data));

    // handle expired token here

    return data;
});

const authSlice = createSlice({
    name: 'user',
    initialState: {
        current: JSON.parse(localStorage.getItem(storageKeys.USER)) || {},
        setting: {},
    },
    reducers: {
        logout(state) {
            localStorage.removeItem(storageKeys.ACCESS_TOKEN);
            localStorage.removeItem(storageKeys.USER);

            state.current = {};
        },
    },
    extraReducers: {
        [register.fulfilled]: (state, action) => {
            state.current = action.payload;
        },
        [login.fulfilled]: (state, action) => {
            state.current = action.payload;
        },
    },
});

const { actions, reducer } = authSlice;
export const { logout } = actions;
export default reducer;
