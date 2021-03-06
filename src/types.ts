import {PeakTopicNode} from "./redux/slices/user/types";

export interface PeakTag {
    id: string
    title: string
    inserted_at?: string
    label?: string
    color?: string
}

export interface Peaker {
    id: string,
    peak_user_id: string,
    image_url: string,
    email: string,
    family_name: string,
    given_name: string,
    access_token: string,
    hierarchy: PeakTopicNode[]
}

export enum RELOAD_REASON {
    recover= "recover",
    switch_accounts = "switch_accounts",
    default = "default"
}

