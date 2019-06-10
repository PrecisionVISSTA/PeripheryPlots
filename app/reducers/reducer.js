
const DEFAULT_state = {
    
    // Component logical properties (dynamic)
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        ['01/01/2012', '09/01/2012'].map(dateStr => new Date(dateStr)),
        ['09/02/2012', '11/01/2013'].map(dateStr => new Date(dateStr)),
        ['11/02/2013', '05/01/2014'].map(dateStr => new Date(dateStr)),
        ['05/02/2014', '11/01/2014'].map(dateStr => new Date(dateStr)),
        ['11/02/2014', '4/05/2015'].map(dateStr => new Date(dateStr))
    ], 
    proposal: { id: -1 },

    // Component styling properties (static)
    focusColor: '#515151', 
    contextColor: '#aaaaaa', 

    // Component dimension properties (static)
    numContextsPerSide: 2, 
    axesWidth: 40, 
    contextWidth: 100, 
    trackWidth: 700, 
    controlTimelineHeight: 60, 
    baseWidth: 700, 
    trackHeight: 60, 
    trackPaddingTop: 10, 
    trackPaddingBottom: 10, 
    verticalAlignerHeight: 30, 
    padding: 12, 

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
        case 'CHANGE_proposal ': 
            let { proposal  } = action; 
            return {
                ...state, 
                proposal  
            };
        default:
            return state;
    }
};

export default reducer;
