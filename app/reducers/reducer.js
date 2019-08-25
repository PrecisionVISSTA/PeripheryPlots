
const DEFAULT_state = {
    
    // Component logical properties (dynamic)
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    proposal: { id: -1 },

    // Component styling properties (static)
    focusColor: '#515151', 
    contextColor: '#aaaaaa', 

    // Properties from user configuration
    numContextsPerSide: null, 
    contextWidthRatio: null, 

    // Component dimension properties
    baseWidth: 0,                   // computed dynamically at runtime. component fills all available space
    axesWidth: 40, 
    controlTimelineHeight: 60, 
    trackHeight: 60, 
    trackPaddingTop: 10, 
    trackPaddingBottom: 10, 
    verticalAlignerHeight: 30, 
    containerPadding: 12, 


};

function computePlotDimensions(numContextsPerSide, contextWidthRatio, baseWidth, containerPadding, axesWidth) {
    
    // The width for all focus + context plots within one track 
    let svgWidth = baseWidth - (2 * containerPadding) - axesWidth; 

    // The width for individual focuc and context plots 
    let contextWidth = svgWidth * contextWidthRatio; 
    let focusWidth = svgWidth - (contextWidth * numContextsPerSide * 2);
    
    return {
        contextWidth, 
        focusWidth
    }; 
}

 

const reducer = (state = DEFAULT_state, action) => {

    const mutations = {
        'CHANGE_timeExtentDomain': () => {
            let { timeExtentDomain } = action; 
            return { ...state, timeExtentDomain };
        }, 
        'CHANGE_timeDomains': () => {
            let { timeDomains } = action; 
            return { ...state, timeDomains };
        }, 
        'CHANGE_numContextsPerSide': () => {
            let { numContextsPerSide } = action; 
            let { focusWidth, contextWidth } = computePlotDimensions(numContextsPerSide, 
                                                                     state.contextWidthRatio, 
                                                                     state.baseWidth, 
                                                                     state.containerPadding, 
                                                                     state.axesWidth); 
            return { ...state, numContextsPerSide, focusWidth, contextWidth };
        }, 
        'CHANGE_proposal ': () => {
            let { proposal  } = action; 
            return { ...state, proposal };
        }, 
        'CHANGE_baseWidth': () => {
            let { baseWidth } = action; 
            let { focusWidth, contextWidth } = computePlotDimensions(state.numContextsPerSide, 
                                                                    state.contextWidthRatio, 
                                                                    baseWidth, 
                                                                    state.containerPadding, 
                                                                    state.axesWidth);
            return { ...state, baseWidth, focusWidth, contextWidth }; 
        }, 
        'CHANGE_contextWidthRatio': () => {
            let { contextWidthRatio } = action;
            let { focusWidth, contextWidth } = computePlotDimensions(state.numContextsPerSide, 
                                                                    contextWidthRatio, 
                                                                    state.baseWidth, 
                                                                    state.containerPadding, 
                                                                    state.axesWidth);
            return { ...state, contextWidthRatio, focusWidth, contextWidth }; 
        }
    }

    let mutator = mutations[action.type]; 
    return mutator === undefined ? state : mutator(); 
    
};

export default reducer;
