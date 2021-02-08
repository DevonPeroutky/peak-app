import {Editor} from "slate";
import {ReactNode} from "react";

export interface PeakNodeSelectListItem {
    title: string
    label: string
    author?: string
    iconUrl?: string
    elementType: string
    knowledgeNodeId?: string
    description?: string
    customFormat?: (editor: Editor) => void
    hotkeyInstructionArray?: string[]
    icon?: ReactNode,
}

