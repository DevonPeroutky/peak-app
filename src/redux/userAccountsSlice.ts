import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Peaker, PeakTopicNode} from "./userSlice";

export interface DisplayPeaker {
    id: string,
    peak_user_id: string,
    image_url: string,
    email: string,
    name: string,
    given_name: string,
}

const emptyUserAccountList: DisplayPeaker[] = []

export const userAccountsSlice = createSlice({
    name: 'userAccounts',
    initialState: emptyUserAccountList,
    reducers: {
        setUserAccounts(state, action: PayloadAction<DisplayPeaker[]>) {
            return action.payload;
        },
        addUserAccount(state, action: PayloadAction<DisplayPeaker>) {
            return [...state, action.payload]
        },
    }
});

export const { setUserAccounts, addUserAccount } = userAccountsSlice.actions;
export default userAccountsSlice.reducer;
