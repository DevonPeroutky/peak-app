/*global chrome*/
import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import "./content.scss";
import 'antd/lib/button/style/index.css';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';
import {SaveNoteDrawer, SaveNoteDrawerProps} from "../components/save-note-modal/SaveNoteModal";

// ---------------------------------------------------
// Mount Drawer to DOM
// ---------------------------------------------------
chrome.storage.sync.get(function (data) {
    const app = document.createElement('div');
    app.id = "my-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        // console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".',
        //     key,
        //     namespace,
        //     storageChange.oldValue,
        //     storageChange.newValue);

        // TODO: Make this tab specific
        if (key === "visible") {
            if (storageChange.newValue) {
                chrome.storage.sync.get(function (data) {
                    console.log(`RERENDERING`)
                    console.log(data)
                    const app = document.getElementById('my-extension-root')
                    ReactDOM.render(<SaveNoteDrawer {...data as SaveNoteDrawerProps} />, app)
                });
            } else {
                console.log(`UNMOUNTING`)
                unmountComponentAtNode(document.getElementById('my-extension-root'))
            }
        }
    }

});
