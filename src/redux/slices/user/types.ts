import {Moment} from "moment";

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
    icon_url?: string
    topic_id?: string
    page_id?: string
    header_id?: string
    updated_at?: number
    header_type: PeakNodeType
}

export type PeakNodeType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "title" | "journal" | "timeline" | "peak_web_note" | "peak_book_note" | string | "learning"
export interface PeakStructureNode extends PeakNode {
    parent: PeakStructureNode | null
    children: PeakStructureNode[]
    header_id: string
    header_type: PeakNodeType
    updated_at: number
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

