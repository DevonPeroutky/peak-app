import React, {useState} from 'react'
import cn from "classnames";
import "./peak-modal.scss"

export const PeakModal = (props: { isOpen: boolean, onClose: () => void, children, }) => {
    const { isOpen, onClose } = props

    // TODO --> useEffect to instantly close out modal

    return (
        <div className={cn("peak-modal-mask", isOpen ? "open" : "closed" )} onClick={ e => {
            console.log(`MASK WAS CLICKED`)
            onClose()
        }} >
            <div className={cn("peak-modal")} onClick={e => {
                e.stopPropagation()
            }}>
                {props.children}
            </div>
        </div>
    )
}
