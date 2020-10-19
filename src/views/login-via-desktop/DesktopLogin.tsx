import React from 'react'
import {useQuery} from "../../utils/urls";
import {useHistory, useParams } from 'react-router-dom';
import {useDispatch} from "react-redux";

export const DesktopLogin = (props: {}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const query = useQuery();
    const broo = useParams();

    console.log(query)
    console.log(broo)

    return (
        <div className={"logged-in-page-container"}>
            <div className={"logged-in-container"}>
                <div>You are logged in!</div>
            </div>
        </div>
    )
};
