import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const R = require('ramda');

export interface PeakPage {
    id: string
    title: string
}

export interface PeakTopic {
    name: string
    id: string
    color: string
    pages: PeakPage[]
    inserted_at: Date
}
const emptyTopicList: PeakTopic[] = [];

export const topicOrdering = (a: PeakTopic, b: PeakTopic) => {
    return (a.inserted_at <= b.inserted_at) ? -1 : 1
};

export const topicsSlice = createSlice({
    name: 'topics',
    initialState: emptyTopicList,
    reducers: {
        addPageToTopic(state, action: PayloadAction<{topicId:string, page: PeakPage}>) {
            const topic = state.find(topic => topic.id === action.payload.topicId)!;
            const newPages = [...topic.pages, action.payload.page];
            const newTopic = {...topic, pages: newPages};

            return R.sort(topicOrdering, [...state.filter(t => t.id !== topic.id), newTopic]);
        },
        updatePageTitleInSidebar(state, action: PayloadAction<{pageId: string, newTitle: string}>) {
            const topic = state.find(topic => topic.pages.find(p => p.id == action.payload.pageId) != undefined)!;
            const ogPage = topic.pages.find(page => page.id === action.payload.pageId)!;
            const newPage = {...ogPage, title: action.payload.newTitle};
            const newPages = [...topic.pages.filter(p => p.id !== action.payload.pageId), newPage];
            const newTopic = {...topic, pages: newPages};

            return R.sort(topicOrdering,[...state.filter(t => t.id !== topic.id), newTopic]);
        },
        removePageFromTopic(state, action: PayloadAction<{pageId: string}>) {
            const topic = state.find(topic => topic.pages.find(p => p.id == action.payload.pageId) != undefined)!; const newPages = topic.pages.filter(p => p.id !== action.payload.pageId);
            const newTopic = {...topic, pages: newPages};
            return R.sort(topicOrdering,[...state.filter(t => t.id !== topic.id), newTopic]);
        },
        addTopic(state, action: PayloadAction<PeakTopic>) {
            return R.sort(topicOrdering, [...state, action.payload])
        },
        updateTopic(state, action: PayloadAction<PeakTopic>) {
            const newTopic = action.payload
            const ogTopic = state.find(t => t.id === newTopic.id)!
            const newTopicWithPages = {...newTopic, pages: ogTopic.pages}
            return R.sort(topicOrdering,[...state.filter(t => t.id !== newTopic.id), newTopicWithPages]);
        },
        movePage(state, action: PayloadAction<{page: PeakPage, sourceTopicId: string, destTopicId: string}>) {
            const { page, sourceTopicId, destTopicId } = action.payload;
            const sourceTopic: PeakTopic = state.find(topic => topic.id === sourceTopicId)!;
            const destTopic: PeakTopic = state.find(topic => topic.id === destTopicId)!;
            const sourcePages = sourceTopic.pages.filter(p => p.id !== page.id);
            const destPages = [...destTopic.pages, page]
            const newSourceTopic = { ...sourceTopic, pages: sourcePages}
            const newDestTopic = { ...destTopic, pages: destPages}
            return R.sort(topicOrdering,[...state.filter(t => !([sourceTopic.id, destTopic.id].includes(t.id))), newDestTopic, newSourceTopic]);
        },
        setTopics(state, action: PayloadAction<PeakTopic[]>) {
            return R.sort(topicOrdering, action.payload);
        },
        deleteTopic(state, action: PayloadAction<string>) {
            const filteredTopics: PeakTopic[] = state.filter(t => t.id !== action.payload)
            return R.sort(topicOrdering, filteredTopics);
        }
    }
});

export const { addTopic, movePage, setTopics, deleteTopic, addPageToTopic, updatePageTitleInSidebar, removePageFromTopic, updateTopic } = topicsSlice.actions;
export default topicsSlice.reducer;