import {Editor} from "slate";
import {ReactNode} from "react";

export interface PeakNodeSelectListItem {
    title: string
    label: string
    bookId?: string
    author?: string
    iconUrl?: string
    coverId?: number
    elementType: string
    knowledgeNodeId?: string
    description?: string
    customFormat?: (editor: Editor) => void
    hotkeyInstructionArray?: string[]
    icon?: ReactNode,
}

