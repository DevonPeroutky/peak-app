import React, {ReactNode} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {DisplayPeaker} from "../../../redux/slices/userAccountsSlice";
import {switchAccountsOutsideOfRouter} from "../../../utils/account";
import {getUserAccount} from "../../../redux/utils";
import loader from '../../../assets/animations/loading.json';
import {Loading} from "../../loading/Loading";
import {useQuery} from "../../../utils/urls";

export const SwitchAccountsAction = (props) => {
    const query = useQuery();
    const history = useHistory();
    const currentUserId: string | null = query.get("curr-user-id")
    const destUserId: string | null = query.get("dest-user-id")

    const desiredPeakAccount: DisplayPeaker = getUserAccount(destUserId)
    const callBack = () => history.push("/#/home")
    const hey = () => switchAccountsOutsideOfRouter(currentUserId, desiredPeakAccount, () => console.log(`Switched Account to ${destUserId}`))

    return <Loading callback={callBack} thePromised={hey} animationData={loader}/>
    // return <div>Loading</div>
}

