
const DEFAULT_state = {
    
    // Component logical properties (dynamic)
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 

    // Component styling properties (static)
    focusColor: '#515151', 
    contextColor: '#aaaaaa', 

    // Component dimension properties (static)
    numContextsPerSide: 1, 
    axesWidth: 40, 
    contextWidth: 100, 
    trackWidth: 700, 
    controlTimelineHeight: 60, 
    baseWidth: 700, 
    trackHeight: 60, 
    trackPaddingTop: 10, 
    trackPaddingBottom: 3, 
    verticalAlignerHeight: 30, 
    padding: 12

};

// Derivation of derived default properties 
DEFAULT_state['focusWidth'] = (function() {
    let { trackWidth, contextWidth, numContextsPerSide, axesWidth, padding } = this; 
    let focusWidth = trackWidth - contextWidth * 2 * numContextsPerSide - axesWidth - padding;
    return focusWidth; 
}).bind(DEFAULT_state)()

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
        default:
            return state;
    }
};

export default reducer;
