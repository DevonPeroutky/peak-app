import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
// TODO
const logo = require('./../../assets/images/logo/grayscale-with-sun.svg');
// import { ReactComponent as Logo } from '../../assets/images/logo/grayscale-with-sun.svg';
// @ts-ignore
// import { che } from '../../assets/images/logo/grayscale-with-sun.svg';
console.log("THE LOGOG")
console.log(logo)

export const PeakLogo = (props: { }) => (
    <Link to={"/home/journal"}>
        <div className="peak-logo">
            <img src={logo} alt={"Peak"}/>
            <div className="peak-header-logo">Peak</div>
        </div>
    </Link>
);