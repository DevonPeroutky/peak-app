import React from 'react';
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {persistor, store} from "../../redux/store";
import {SaveNoteDrawer, SaveNoteDrawerProps} from "./save-note-modal/SaveNoteDrawer";

function ChromeExtApp(props: SaveNoteDrawerProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={<span>Loading</span>} persistor={persistor}>
                <div id="peak-extension-root">
                    <SaveNoteDrawer {...props} />
                </div>
            </PersistGate>
        </Provider>
    );
}

export default ChromeExtApp;
