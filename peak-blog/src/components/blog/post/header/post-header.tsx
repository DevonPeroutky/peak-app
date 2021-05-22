import {PeakLogo} from "../../../logo/peak-logo";
import Link from "next/link";
import React from "react";

export default function PostHeaderBar() {
    return (
        <header className={"flex justify-center w-full leading-normal py-10"}>
            <div className={"flex max-w-3xl w-2/5 justify-between items-center"}>
                <PeakLogo/>
                <Link href={"/"}>
                    <span className={"flex items-center justify-center hover:bg-blue-50 cursor-pointer p-4 h-10 rounded"}>Home</span>
                </Link>
            </div>
        </header>
    )
}
