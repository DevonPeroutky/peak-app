import * as React from "react";
import "./popup.scss";
import "../../../constants/utilities.scss";
import {PeakLogo} from "../../../common/logo/PeakLogo";
import {BookTwoTone} from "@ant-design/icons/lib";

export const Popup = (props) => {
    return (
        <div className={"popup-container"}>
            <PeakLogo className={"popup-peak-logo"}/>
            <div className={"header-container"}>
                <h1>Welcome to Peak</h1>
                <h3>Save what you read directly to Peak!</h3>
            </div>
            <div className={"hints-container"}>
                <div className={"hint"}>
                    <BookTwoTone className={"success"}/>
                    <div className={"hint-body"}>
                        <h2>Want to save a page to Peak?</h2>
                        <span>Simply press <span className="peak-hotkey-decoration">⌘ + ⇧ + S</span> on any page to save it!</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

