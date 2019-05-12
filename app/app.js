import React from "react"; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from "react-dom";

import reducer from "./reducers/reducer.js"; 
import FocusMultiContextBrushControl from "./components/FocusMultiContextBrushControl.jsx";

// Initiate Redux store with reducer and add redux dev-tool extension
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Wrap <App/> with redux Provider, exposing store to all components within.
ReactDOM.render(<Provider store={store}>
                    <FocusMultiContextBrushControl
                    width={500}
                    height={100}/>
                </Provider>, document.getElementById('ROOT'));