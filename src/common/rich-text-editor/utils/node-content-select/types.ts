import {Editor} from "slate";
import {ReactNode} from "react";

export interface PeakNodeSelectListItem {
    title: string
    label: string
    elementType: string
    description?: string
    customFormat?: (editor: Editor) => void
    hotkeyInstructionArray?: string[]
    icon?: ReactNode,
}

