import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
import cn from "classnames";
import {isChromeExtension} from "../../utils/environment";
const peak = require('../../assets/logos/peak-spicy.svg');

export const PeakLogo = (props: { className?: string }) => {
    const specifiedClassName: string = (props.className) ? props.className : ""
    if (isChromeExtension) {
        const baseUrl = chrome.runtime.getURL("../../assets/logos/grayscale-with-sun.svg")
        return (
            <img className={cn("chrome-peak-logo-img animate__animated animate__fadeIn", specifiedClassName)} src={baseUrl} alt={"Peak"}/>
        )
    } else {
        return (
            <Link
                to={"/home"}
                className={cn("peak-logo-wrapper", )}
                children={<img className={cn("peak-logo-img", specifiedClassName)} src={peak} alt={"Peak"}/>}/>
        )
    }
};
