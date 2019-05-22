
const DEFAULT_state = {
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    numContextsPerSide: 1, 
    focusColor: '#515151', 
    contextColor: '#aaaaaa', 
    zoomTransform: null
};

const reducer = (state = DEFAULT_state, action) => {
    
    switch (action.type) {
        case 'CHANGE_timeExtentDomain': 
            let { timeExtentDomain } = action; 
            return {
                ...state, 
                timeExtentDomain 
            };
        case 'CHANGE_timeDomains': 
            let { timeDomains } = action; 
            return {
                ...state, 
                timeDomains
            };
        case 'CHANGE_numContextsPerSide': 
            let { numContextsPerSide } = action; 
            return {
                ...state, 
                numContextsPerSide 
            };
        case 'CHANGE_zoomTransform': 
            let { zoomTransform } = action; 
            return {
                ...state, 
                zoomTransform
            };
        default:
            return state;
    }
};

export default reducer;
