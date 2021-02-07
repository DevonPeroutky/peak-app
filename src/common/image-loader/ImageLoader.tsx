import {Img, useImage} from "react-image";
import React from "react";
import {Spin} from "antd";

export const ImageLoader = (props: { iconClassName?: string, className?: string, url: string | string[], fallbackElement: JSX.Element }) => {
    const { url, className, fallbackElement } = props
    const the_loader = <Spin className={className}/>
    const {src, error, isLoading} = useImage({
        srcList: url,
        useSuspense: false
    })

    console.log(`BRAHHH ${url}`)
    console.log(error)
    console.log(isLoading)
    console.log(src)

    if (isLoading) {
        return <Spin className={className}/>
    }

    if (error || src === undefined) {
        return fallbackElement
    }

    return <img className={className} src={src}/>

    // return (
    //     <Img
    //         className={className}
    //         src={url}
    //         loader={the_loader}
    //         unloader={
    //             <ReadOutlined className={"inline-select-item-icon"}/>
    //         }/>
    // )
}