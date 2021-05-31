import React from "react";
import { Node } from "slate";

export const EstimateReadTime = (props: { body: Node[] }) => {

   const estimatedReadTime = (body: Node[]): number => {
      return Math.max(Math.floor((body.length) * .3), 1)
   }

   const time = estimatedReadTime(props.body)
   return (
       <span>{time} minute{(time === 1) ? "" : "s"}</span>
   )
}