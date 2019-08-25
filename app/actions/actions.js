export function ACTION_CHANGE_timeExtentDomain(timeExtentDomain) {
    return {
        type: 'CHANGE_timeExtentDomain',
        timeExtentDomain,
    };
};

export function ACTION_CHANGE_timeDomains(timeDomains) {
    return {
        type: 'CHANGE_timeDomains',
        timeDomains,
    };
};

export function ACTION_CHANGE_numContextsPerSide(numContextsPerSide) {
    return {
        type: 'CHANGE_numContextsPerSide',
        numContextsPerSide,
    };
};

export function ACTION_CHANGE_proposal (proposal) {
    return {
        type: 'CHANGE_proposal ',
        proposal ,
    };
};

export function ACTION_CHANGE_baseWidth (baseWidth) {
    return {
        type: 'CHANGE_baseWidth', 
        baseWidth
    }; 
};

export function ACTION_CHANGE_contextWidthRatio (contextWidthRatio) {
    return {
        type: 'CHANGE_contextWidthRatio', 
        contextWidthRatio
    }
};

