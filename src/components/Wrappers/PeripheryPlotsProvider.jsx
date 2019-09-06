import React from "react"; 
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import reducer from "../../reducers/reducer.js"; 

class PeripheryPlotsProvider extends React.Component {

    state = {
        store: createStore(
            reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    }

    render() {
        return (
            <Provider context={PeripheryPlotContext} store={this.state.store}>
                {this.props.children}
            </Provider>
        ); 
    }   

}

export default PeripheryPlotsProvider; 

    
