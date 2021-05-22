import React from "react";
import Image from 'next/image'

export const PeakLogo = (props) => {
    return (
        <div className={"flex h-full max-h-full items-center"}>
            <Image
                src="/images/grayscale-with-sun.svg" // Route of the image file
                alt="Kickass Logo"
                width={"50px"}
                height={"50px"}
            />
        </div>
    )
}
