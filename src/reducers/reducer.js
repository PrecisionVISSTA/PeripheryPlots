import { scaleTime } from 'd3-scale'; 

const DEFAULT_state = {

    proposal: { id: -1 }, 
    storeInit: false, 
    controlScale: scaleTime()
    
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
 
const mutations = {

    'CHANGE_timeExtentDomain': (state, action) => {
        let { timeExtentDomain } = action; 
        return { ...state, timeExtentDomain };
    }, 
    'CHANGE_timeDomains': (state, action) =>{
        let { timeDomains } = action; 
        return { ...state, timeDomains };
    }, 
    'CHANGE_numContextsPerSide': (state, action) =>{
        let { numContextsPerSide } = action; 
        let { focusWidth, contextWidth } = computePlotDimensions(numContextsPerSide, 
                                                                 state.contextWidthRatio, 
                                                                 state.baseWidth, 
                                                                 state.containerPadding, 
                                                                 state.axesWidth); 
        return { ...state, numContextsPerSide, focusWidth, contextWidth };
    }, 
    'CHANGE_proposal ': (state, action) =>{
        let { proposal  } = action; 
        return { ...state, proposal };
    }, 
    'CHANGE_baseWidth': (state, action) =>{
        let { baseWidth } = action; 
        let { focusWidth, contextWidth } = computePlotDimensions(state.numContextsPerSide, 
                                                                state.contextWidthRatio, 
                                                                baseWidth, 
                                                                state.containerPadding, 
                                                                state.axesWidth);
        return { ...state, baseWidth, focusWidth, contextWidth }; 
    }, 
    'CHANGE_contextWidthRatio': (state, action) =>{
        let { contextWidthRatio } = action;
        let { focusWidth, contextWidth } = computePlotDimensions(state.numContextsPerSide, 
                                                                contextWidthRatio, 
                                                                state.baseWidth, 
                                                                state.containerPadding, 
                                                                state.axesWidth);
        return { ...state, contextWidthRatio, focusWidth, contextWidth }; 
    },
    'CHANGE_containerPadding': (state, action) => {
        let { containerPadding } = action;
        return { ...state, containerPadding }; 
    },
    'CHANGE_controlTimelineHeight': (state, action) => {
        let { controlTimelineHeight } = action;
        return { ...state, controlTimelineHeight }; 
    },
    'CHANGE_verticalAlignerHeight': (state, action) => {
        let { verticalAlignerHeight } = action;
        return { ...state, verticalAlignerHeight }; 
    },
    'CHANGE_axesWidth': (state, action) => {
        let { axesWidth } = action;
        return { ...state, axesWidth }; 
    },
    'CHANGE_trackHeight': (state, action) => {
        let { trackHeight } = action;
        return { ...state, trackHeight }; 
    },
    'CHANGE_trackSvgOffsetTop': (state, action) => {
        let { trackSvgOffsetTop } = action;
        return { ...state, trackSvgOffsetTop }; 
    },
    'CHANGE_trackSvgOffsetBottom': (state, action) => {
        let { trackSvgOffsetBottom } = action;
        return { ...state, trackSvgOffsetBottom }; 
    }, 
    'CHANGE_tickInterval': (state, action) => {
        let { tickInterval } = action; 
        return { ...state, tickInterval }; 
    },
    'CHANGE_focusColor': (state, action) => {
        let { focusColor } = action; 
        return { ...state, focusColor };
    }, 
    'CHANGE_contextColor': (state, action) => {
        let { contextColor } = action; 
        return { ...state, contextColor };
    }, 
    'CHANGE_lockActiveColor': (state, action) => {
        let { lockActiveColor } = action; 
        return { ...state, lockActiveColor };
    }, 
    'CHANGE_lockInactiveColor': (state, action) => {
        let { lockInactiveColor } = action; 
        return { ...state, lockInactiveColor };
    },
    'CHANGE_dZoom': (state, action) => {
        let { dZoom } = action; 
        return { ...state, dZoom };
    },
    'CHANGE_applyContextEncodingsUniformly': (state, action) => {
        let { applyContextEncodingsUniformly } = action; 
        return { ...state, applyContextEncodingsUniformly };
    },
    'CHANGE_formatTrackHeader': (state, action) => {
        let { formatTrackHeader } = action; 
        return { ...state, formatTrackHeader };
    },
    'CHANGE_msecsPadding': (state, action) => {
        let { msecsPadding } = action; 
        return { ...state, msecsPadding };
    },
    'CHANGE_lockOutlineColor': (state, action) => {
        let { lockOutlineColor } = action; 
        return { ...state, lockOutlineColor };
    },
    'CHANGE_handleOutlineColor': (state, action) => {
        let { handleOutlineColor } = action; 
        return { ...state, handleOutlineColor };
    },
    'CHANGE_brushOutlineColor': (state, action) => {
        let { brushOutlineColor } = action; 
        return { ...state, brushOutlineColor };
    },
    'CHANGE_trackwiseEncodings': (state, action) => {
        let { trackwiseEncodings } = action; 
        return { ...state, trackwiseEncodings };
    },
    'CHANGE_trackwiseAxisTickFormatters': (state, action) => {
        let { trackwiseAxisTickFormatters } = action; 
        return { ...state, trackwiseAxisTickFormatters };
    },
    'CHANGE_trackwiseNumAxisTicks': (state, action) => {
        let { trackwiseNumAxisTicks } = action; 
        return { ...state, trackwiseNumAxisTicks };
    },
    'CHANGE_trackwiseUnits': (state, action) => {
        let { trackwiseUnits } = action; 
        return { ...state, trackwiseUnits };
    },
    'CHANGE_trackwiseTypes': (state, action) => {
        let { trackwiseTypes } = action; 
        return { ...state, trackwiseTypes };
    },
    'CHANGE_trackwiseValueKeys': (state, action) => {
        let { trackwiseValueKeys } = action; 
        return { ...state, trackwiseValueKeys };
    },
    'CHANGE_trackwiseTimeKeys': (state, action) => {
        let { trackwiseTimeKeys } = action; 
        return { ...state, trackwiseTimeKeys };
    },
    'CHANGE_trackwiseObservations': (state, action) => {
        let { trackwiseObservations } = action; 
        return { ...state, trackwiseObservations };
    },
    'CHANGE_trackwiseValueDomainComputers': (state, action) => {
        let { trackwiseValueDomainComputers } = action; 
        return { ...state, trackwiseValueDomainComputers }; 
    },
    'CHANGE_storeInit': (state, action) => {
        let { storeInit } = action; 
        return { ...state, storeInit };
    },
    'CHANGE_lockBounds': (state, action) => {
        let { lockBounds } = action; 
        return { ...state, lockBounds }; 
    }, 
};

const reducer = (state = DEFAULT_state, action) => {

    // We opt for use of a mutator rather than a switch statement 
    // due to weird javascript restrictions on declaring the same 
    // variables with the same name in different cases 
    let mutator = mutations[action.type]; 
    return mutator === undefined ? state : mutator(state, action); 
    
};

export default reducer;
