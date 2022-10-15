import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import orderApi from '../../../../api/orderApi.js';

export const getRoomOrderList = createAsyncThunk('roomOrder/getAll', async (payload) => {
    //call api
    const data = await orderApi.getAll(payload);
    console.log(data);

    return data;
});

const initialState = {
  RoomOrderList: [],
  pagination: {},
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
        [getRoomOrderList.fulfilled]: (state, action) => {
          state.RoomOrderList = action.payload.data;
          state.pagination = action.payload.pagination;
          
        },
    },
});

const { actions, reducer } = RoomSlice;
export default reducer;