import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
import cn from "classnames";
const logo = require('./../../assets/images/logo/grayscale-with-sun.svg');

export const PeakLogo = (props: { className?: string }) => {
    const specifiedClassName: string = (props.className) ? props.className : ""
    return (
        <Link to={"/home/journal"} className={"peak-logo-container"}>
            <div className={cn("peak-logo", specifiedClassName)}>
                <img src={logo} alt={"Peak"}/>
                <div className="peak-header-logo">Peak</div>
            </div>
        </Link>
    )
};