import {useTags} from "../client/tags";

export function useLoadTags(tagIds: string[]) {
    const tags = useTags()

    return tagIds.map(id => tags.find(t => t.id == id)).filter(t => t !== undefined)
}
