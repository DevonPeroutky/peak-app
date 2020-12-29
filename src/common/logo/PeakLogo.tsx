import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
import cn from "classnames";
const peak = require('../../assets/logos/peak.svg');

export const PeakLogo = (props: { className?: string }) => {
    const specifiedClassName: string = (props.className) ? props.className : ""
    return (
        <Link
            to={"/home/journal"}
            className={cn("peak-logo-wrapper", )}
            children={<img className={cn("peak-logo-img", specifiedClassName)} src={peak} alt={"Peak"}/>}/>
    )
};
