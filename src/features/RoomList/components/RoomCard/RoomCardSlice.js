import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RoomApi from "../../../../api/RoomApi.js";


export const getRoomList = createAsyncThunk('room/getAll', async (payload) => {
    //call api
    const data = await RoomApi.getAll(payload);

    return data;
});

const initialState = {
  RoomList: [],
  pagination: {}
};

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: { 
    // addFromCart(state, action) {
    //   const newItem = action.payload;
    //   const index = state.RoomCardList.findIndex((x) => x.id === newItem.id);
    //   if (index >= 0) {
    //     state.RoomCardList[index].quantity += newItem.quantity;
    //   } else {
    //     state.RoomCardList.push(newItem);
    //   }
    // },
    // setQuantity(state, action) {
    //   const { id, quantity } = action.payload;
    //   const index = state.RoomCardList.findIndex((x) => x.id === id);
    //   if (index >= 0) {
    //     state.RoomCardList[index].quantity = quantity;
    //   }
    // },
    // removeFromCart(state, action) {
    //   const idNeedRemove = action.payload;
    //   state.RoomCardList = state.RoomCardList.filter((x) => x.id !== idNeedRemove);
    // },
  },
  extraReducers: {
        [getRoomList.fulfilled]: (state, action) => {
            state.RoomList = action.payload.data;
            state.pagination = action.payload.pagination;
        },
    },
});

const { actions, reducer } = RoomSlice;
export default reducer;