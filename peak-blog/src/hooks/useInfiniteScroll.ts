import {useBottomScrollListener} from "react-bottom-scroll-listener/dist";

export default function useInfiniteScroll({ enabled = true, fetchMore }) {
    useBottomScrollListener(async () => {
        if (!enabled) {
            return
        }
        fetchMore()
    });
}