
const DEFAULT_state = {
    
    // Component logical properties (dynamic)
    timeExtentDomain: [new Date("06/22/1997"), new Date("06/22/2020")], 
    timeDomains: [
        [new Date("06/22/1997"), new Date("06/22/2000")],
        [new Date("06/23/2000"), new Date("06/22/2010")],
        [new Date("06/23/2010"), new Date("06/22/2013")]
    ], 
    proposal: { id: -1 },  
    dZoom: 4,    

    // Computed dynamically at runtime 
    baseWidth: null,       

    // Required properties from user configuration 
    numContextsPerSide: null, 
    contextWidthRatio: null, 
    tickInterval: null, 

    // Appearance / layout properties with sensible defaults 
    focusColor: '#515151', 
    contextColor: '#aaaaaa',
    lockActiveColor: 'black', 
    lockInactiveColor: 'grey', 

    containerPadding: 12, 
    controlTimelineHeight: 60, 
    verticalAlignerHeight: 30, 
    axesWidth: 40, 
    trackHeight: 60, 
    trackSvgOffsetTop: 10, 
    trackSvgOffsetBottom: 10

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
        },
        'CHANGE_containerPadding': () => {
            let { containerPadding } = action;
            return { ...state, containerPadding }; 
        },
        'CHANGE_controlTimelineHeight': () => {
            let { controlTimelineHeight } = action;
            return { ...state, controlTimelineHeight }; 
        },
        'CHANGE_verticalAlignerHeight': () => {
            let { verticalAlignerHeight } = action;
            return { ...state, verticalAlignerHeight }; 
        },
        'CHANGE_axesWidth': () => {
            let { axesWidth } = action;
            return { ...state, axesWidth }; 
        },
        'CHANGE_trackHeight': () => {
            let { trackHeight } = action;
            return { ...state, trackHeight }; 
        },
        'CHANGE_trackSvgOffsetTop': () => {
            let { trackSvgOffsetTop } = action;
            return { ...state, trackSvgOffsetTop }; 
        },
        'CHANGE_trackSvgOffsetBottom': () => {
            let { trackSvgOffsetBottom } = action;
            return { ...state, trackSvgOffsetBottom }; 
        }, 
        'CHANGE_tickInterval': () => {
            let { tickInterval } = action; 
            return { ...state, tickInterval }; 
        },
        'CHANGE_focusColor': () => {
            let { focusColor } = action; 
            return { ...state, focusColor };
        }, 
        'CHANGE_contextColor': () => {
            let { contextColor } = action; 
            return { ...state, contextColor };
        }, 
        'CHANGE_lockActiveColor': () => {
            let { lockActiveColor } = action; 
            return { ...state, lockActiveColor };
        }, 
        'CHANGE_lockInactiveColor': () => {
            let { lockInactiveColor } = action; 
            return { ...state, lockInactiveColor };
        },
        'CHANGE_dZoom': () => {
            let { dZoom } = action; 
            return { ...state, dZoom };
        },
    };

    let mutator = mutations[action.type]; 
    return mutator === undefined ? state : mutator(); 
    
};

export default reducer;
