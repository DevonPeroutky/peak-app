import React, {useState} from 'react'
import cn from "classnames";
import "./peak-modal.scss"

export const PeakModal = (props: { isOpen: boolean, onClose: () => void, children, }) => {
    const { isOpen, onClose } = props

    return (
        <div className={cn("peak-modal-mask", isOpen ? "open" : "closed" )} onClick={ e => onClose() }>
            <div className={cn("peak-modal")} onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    )
}
