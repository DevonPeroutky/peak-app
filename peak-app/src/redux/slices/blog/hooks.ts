import {useSelector} from "react-redux";
import {AppState} from "../../index";
import {BlogConfiguration} from "./types";

export function useBlog() {
    return useSelector<AppState, null | BlogConfiguration>(state => state.blogConfiguration);
}
