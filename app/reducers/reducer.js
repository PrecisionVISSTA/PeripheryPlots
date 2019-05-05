const defaultState = {

};

const reducer = (state = defaultState, action) => {
    
    switch (action.type) {
        case 'ACTION': 
            return {
                ...state, 
                action 
            }
        default:
            return state;
    }
};

export default reducer;
