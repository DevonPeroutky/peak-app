import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Peaker} from "../../../types";
import {PeakTopicNode} from "./types";

export const UNAUTHED_USER: Peaker = {
    id: "-1",
    peak_user_id: "-1",
    image_url: "",
    email: "",
    name: "",
    given_name: "",
    access_token: "",
    hierarchy: []
};

export function isAuthenticated(user: Peaker): boolean {
    return user.id !== "-1"
}

export const userSlice = createSlice({
    name: 'currentUser',
    initialState: UNAUTHED_USER,
    reducers: {
        setUser(state, action: PayloadAction<Peaker>) {
            return action.payload
        },
        setUserHierarchy(state, action: PayloadAction<PeakTopicNode[]>) {
            return { ...state, hierarchy: action.payload }
        }
    }
});

export const { setUser, setUserHierarchy } = userSlice.actions;
export default userSlice.reducer;