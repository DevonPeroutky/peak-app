import React from 'react'
import "./peak-logo.scss"
import {Link} from "react-router-dom";
const logo = require('../../assets/images/logo/grayscale-with-sun.svg');

export const PeakLogo = (props: { }) => (
    <Link to={"/home/journal"}>
        <div className="peak-logo">
            <img src={logo} alt={"Peak"}/>
            <div className="peak-header-logo">Peak</div>
        </div>
    </Link>
);