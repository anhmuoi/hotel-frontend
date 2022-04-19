import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../page/Auth/authSlice.js';
import roomReducer from '../features/RoomList/components/RoomCard/RoomCardSlice.js';
import orderReducer from '../features/RoomOrderList/components/RoomOrderCard/RoomOrderSlice.js';

export const store = configureStore({
    reducer: {
        user: userReducer,
        room: roomReducer,
        order: orderReducer,
    },
});
