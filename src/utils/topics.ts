import {batch, useDispatch, useSelector} from "react-redux";
import {AppState} from "../redux";
import {setUserHierarchy} from "../redux/slices/user/userSlice";
import {cloneDeep} from "lodash";
import {useCurrentUser} from "./hooks";
import {message, notification} from "antd";
import {movePage, PeakPage} from "../redux/slices/topicSlice";
import {updatePage} from "./requests";
import {PeakStructureNode, PeakTopicNode} from "../redux/slices/user/types";
import {Peaker} from "../types";

export function useMovePageToNewTopic() {
    const dispatch = useDispatch()

    return (pageId: string, sourceTopicId: string, destTopicId: string, currentUser: Peaker, usableHierarchy: PeakTopicNode[]) => {
        const sourceTopicHierarchy: PeakTopicNode = usableHierarchy.find(t => t.topic_id === sourceTopicId)!
        const destTopicHierarchy: PeakTopicNode = usableHierarchy.find(t => t.topic_id === destTopicId)!
        const pageHierarchy: PeakStructureNode = sourceTopicHierarchy.children.find(p => p.page_id === pageId)

        if (pageHierarchy == undefined) {
            message.warning("Can't move an empty Page")
            return null
        } else {
            const updatedOldTopicPageStructureNodes: PeakStructureNode[] = sourceTopicHierarchy.children.filter(p => p.page_id !== pageId)
            const updatedNewTopicPageStructureNodes: PeakStructureNode[] = [...destTopicHierarchy.children, pageHierarchy]
            const updatedOldTopicHierarchy: PeakTopicNode = {...sourceTopicHierarchy, children: updatedOldTopicPageStructureNodes }
            const updatedNewTopicHierarchy: PeakTopicNode = {...destTopicHierarchy, children: updatedNewTopicPageStructureNodes }
            usableHierarchy.splice(usableHierarchy.indexOf(sourceTopicHierarchy), 1, updatedOldTopicHierarchy)
            usableHierarchy.splice(usableHierarchy.indexOf(destTopicHierarchy), 1, updatedNewTopicHierarchy)
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
