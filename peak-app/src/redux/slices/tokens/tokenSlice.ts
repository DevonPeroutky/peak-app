import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PeakAccessToken} from "../../../client/tokens";

const emptyTokenList: PeakAccessToken[] = []
export const tokenSlice = createSlice({
    name: 'tags',
    initialState: emptyTokenList,
    reducers: {
        setTokens(state, action: PayloadAction<PeakAccessToken[]>) {
            return action.payload;
        },
        addToken(state, action: PayloadAction<PeakAccessToken>) {
            return [...state.filter(token => token.token_type != action.payload.token_type), action.payload]
        },
    }
});

export const { addToken, setTokens } = tokenSlice.actions;
export default tokenSlice.reducer;
