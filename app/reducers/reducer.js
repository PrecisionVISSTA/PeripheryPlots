const defaultState = {
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    numContextsPerSide: 1
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
