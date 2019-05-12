const DEFAULT_state = {
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    numContextsPerSide: 1
};

const reducer = (state = DEFAULT_state, action) => {
    
    switch (action.type) {
        case 'CHANGE_timeExtentDomain': 
            return {
                ...state, 
                numContextsPerSide 
            }
        case 'CHANGE_timeDomains': 
            return {
                ...state, 
                numContextsPerSide 
            }
        case 'CHANGE_numContextsPerSide': 
            return {
                ...state, 
                numContextsPerSide 
            }
        default:
            return state;
    }
};

export default reducer;
