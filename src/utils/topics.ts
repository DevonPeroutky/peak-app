import {batch, useDispatch, useSelector} from "react-redux";
import {AppState} from "../redux";
import {PeakStructureNode, PeakTopicNode, setUserHierarchy} from "../redux/slices/userSlice";
import {cloneDeep} from "lodash";
import {useCurrentUser} from "./hooks";
import {message, notification} from "antd";
import {movePage, PeakPage} from "../redux/slices/topicSlice";
import {updatePage} from "./requests";

export function useMovePageToNewTopic() {
    const currentHierarchy = useSelector<AppState, PeakTopicNode[]>(state => state.currentUser.hierarchy);
    const usableHierarchy: PeakTopicNode[] = cloneDeep(currentHierarchy)
    const dispatch = useDispatch()
    const currentUser = useCurrentUser()

    return (pageId: string, sourceTopicId: string, destTopicId: string) => {
        const oldTopicHierarchy: PeakTopicNode = usableHierarchy.find(t => t.topic_id === sourceTopicId)!
        const newTopicHierarchy: PeakTopicNode = usableHierarchy.find(t => t.topic_id === destTopicId)!
        const pageHierarchy: PeakStructureNode = oldTopicHierarchy.children.find(p => p.page_id === pageId)

        if (pageHierarchy == undefined) {
            message.warning("Can't move an empty Page")
            return null
        } else {
            const updatedOldTopicPageStructureNodes: PeakStructureNode[] = oldTopicHierarchy.children.filter(p => p.page_id !== pageId)
            const updatedNewTopicPageStructureNodes: PeakStructureNode[] = [...newTopicHierarchy.children, pageHierarchy]
            const updatedOldTopicHierarchy: PeakTopicNode = {...oldTopicHierarchy, children: updatedOldTopicPageStructureNodes }
            const updatedNewTopicHierarchy: PeakTopicNode = {...newTopicHierarchy, children: updatedNewTopicPageStructureNodes }
            usableHierarchy.splice(usableHierarchy.indexOf(oldTopicHierarchy), 1, updatedOldTopicHierarchy)
            usableHierarchy.splice(usableHierarchy.indexOf(newTopicHierarchy), 1, updatedNewTopicHierarchy)
            return updatePage(currentUser.id, pageId, { topicId: destTopicId }, usableHierarchy)
                .then((res) => {
                    const newHierarchy: PeakTopicNode[] = res.data.hierarchy
                    const newPage: PeakPage = res.data.page
                    console.log(newPage)
                    batch(() => {
                        dispatch(setUserHierarchy(newHierarchy))
                        dispatch(movePage({
                            page: newPage,
                            sourceTopicId: sourceTopicId,
                            destTopicId: destTopicId,
                        }));
                    })
                }).catch((err) => {
                    console.log(err)
                    notification.error({message: "Failed to move the page. Please try again or let Devon know it failed"})
                })

        }
    }
}
