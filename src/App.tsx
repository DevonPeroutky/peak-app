import React, {ReactNode, useEffect} from 'react';
import './App.scss';
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./redux/store";
import ProvidedApp from "./ProvidedApp";
import { Socket } from 'phoenix';

function App() {
  return (
      <Provider store={store}>
          <PersistGate loading={<span>Loading</span>} persistor={persistor}>
              <ProvidedApp/>
          </PersistGate>
      </Provider>
  );
}

export default App;
