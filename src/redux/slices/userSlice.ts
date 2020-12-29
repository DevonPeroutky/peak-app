import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Peaker {
    id: string,
    peak_user_id: string,
    image_url: string,
    email: string,
    name: string,
    given_name: string,
    access_token: string,
    hierarchy: PeakTopicNode[]
}

export interface PeakNode {
    children: PeakStructureNode[],
    title: string,
    path?: string,
    topic_id: string,
    disabled?: boolean
    page_id?: string
    header_id?: string
}

export interface PeakDisplayNode {
    url: string,
    title: string,
    path?: string,
    topic_id?: string
    page_id?: string
    header_id?: string
    header_type: PeakNodeType
}

export type PeakNodeType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "title" | "journal" | "timeline" | string
export interface PeakStructureNode extends PeakNode {
    parent: PeakStructureNode | null
    children: PeakStructureNode[]
    header_id: string
    header_type: PeakNodeType
    title: string
    page_id: string
    topic_id: string
}
export type PeakHierarchy = PeakTopicNode[]
export interface PeakTopicNode {
    children: PeakStructureNode[]
    title: string,
    disabled: boolean,
    topic_id: string
}

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