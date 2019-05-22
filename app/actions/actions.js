export function ACTION_CHANGE_timeExtentDomain(timeExtentDomain) {
    return {
        type: 'CHANGE_timeExtentDomain',
        timeExtentDomain,
    };
}

export function ACTION_CHANGE_timeDomains(timeDomains) {
    return {
        type: 'CHANGE_timeDomains',
        timeDomains,
    };
}

export function ACTION_CHANGE_numContextsPerSide(numContextsPerSide) {
    return {
        type: 'CHANGE_numContextsPerSide',
        numContextsPerSide,
    };
}

export function ACTION_CHANGE_focusMouseX(focusMouseX) {
    return {
        type: 'CHANGE_focusMouseX', 
        focusMouseX
    }
}


export function ACTION_CHANGE_zoomTransform(zoomTransform) {
    return {
        type: 'CHANGE_zoomTransform', 
        zoomTransform
    }
}