import React, {ReactNode} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {useQuery} from "../../utils/urls";

export const InterLoadingAnimation = (props) => {
    const query = useQuery();
    const history = useHistory()
    const loadingAction: string | null = query.get("action")

    // return <Loading callback={navigateCallback} thePromised={} animationData={}/>
    return <div>Loading</div>
}

const deriveProps = (action: string, history) => {
   switch (action) {
       case "switch-accounts":
           return
   }
}

