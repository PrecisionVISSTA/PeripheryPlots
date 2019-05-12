import React from "react"; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from "./reducers/reducer.js"; 

class VistaDataProviderWrapper extends React.Component {

    state = {
        store: createStore(
            reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    }

    render() {
        <Provider store={this.state.store}>
            {this.props.children}
        </Provider>
    }   

}

export default VistaDataProviderWrapper; 

    
