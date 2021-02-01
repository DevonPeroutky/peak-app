import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Channel, Socket} from "phoenix";


export interface SocketState {
    connected: boolean;
}

export const INITIAL_SOCKET_STATE: SocketState= {
    connected: false
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState: INITIAL_SOCKET_STATE,
    reducers: {
        connected(state) {
            return {...state, ...{connected: true}}
        },
        disconnected(state) {
            return {...state, ...{connected: false}}
        }
    }
});

export const { connected, disconnected } = socketSlice.actions;
export default socketSlice.reducer;
