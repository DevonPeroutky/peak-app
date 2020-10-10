import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
// TODO
// Try changing const pic = require('PATH') to import pic from 'PATH'
// Try url-loader instead of file-loader
const logo = require('../../assets/images/logo/grayscale-with-sun.svg');
// import logo2 from '../../assets/images/logo/grayscale-with-sun.svg';
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