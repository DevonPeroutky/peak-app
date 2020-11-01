import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
import cn from "classnames";
const logo = require('./../../assets/images/logo/grayscale-with-sun.svg');
const peak = require('../../assets/images/logo/peak.svg');

export const PeakLogo = (props: { className?: string }) => {
    const specifiedClassName: string = (props.className) ? props.className : ""
    return (
        <div className={cn("peak-logo-container", specifiedClassName)}>
            <Link
                to={"/home/journal"}
                className={cn("peak-logo-wrapper", specifiedClassName)}
                children={<img className={"peak-logo-img"} src={peak} alt={"Peak"}/>}/>
        </div>
    )
};