import {createSlice} from "@reduxjs/toolkit";

export interface LoadingState {
    finished: boolean
}

export const INITIAL_STATE: LoadingState = {
    finished: false
};

export const loadingStateSlice = createSlice({
    name: 'loadingState',
    initialState: INITIAL_STATE,
    reducers: {
        startLoading() {
            return { finished: true }
        },
        finishLoading() {
            return { finished: true }
        }
    }
});

export const { startLoading, finishLoading } = loadingStateSlice.actions;
export default loadingStateSlice.reducer;