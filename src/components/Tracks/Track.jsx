import React from "react"; 
import _ from "lodash"; 
import { axisRight } from 'd3-axis'; 
import { scaleLinear, scaleBand, scaleTime } from 'd3-scale'; 
import { select, selectAll, mouse, event as currentEvent } from 'd3-selection'; 
import { zoom, zoomTransform } from 'd3-zoom'; 
import { extent } from 'd3-array'; 
import { timeFormat } from 'd3-time-format'; 
import { connect } from "react-redux";
import { scaleRangeToBox, padDateRange } from "../../util/util"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 

import { ACTION_CHANGE_proposal } from "../../actions/actions"; 

class Track extends React.Component {

    state = {
        axis: axisRight(), 
        quantitativeScale: scaleLinear(), 
        categoricalScale: scaleBand(), 
        timeScale: scaleTime(), 
        zooms: [], 
        formatter: timeFormat('%B %d, %Y')
    }

    constructor(props) {

        super(props); 
    
        // initialize a single zoom manager per container 
        let numCharts = this.props.numContextsPerSide * 2 + 1;

        this.state.zooms = _.range(0, numCharts).map(i => zoom()); 
        this.state.zoomRefs = _.range(0, numCharts).map(i => null); // populate with refs during render 

    } 

    createZoomCallback = () => {

        let lastX = null; 
        let lastK = null; 

        let zoomed = (index) => {
        
            // ignore zoom-by-brush
            if (currentEvent.sourceEvent && currentEvent.sourceEvent.type === "brush") {
                return;
            }
    
            let { k, x } = zoomTransform(select(this.state.zoomRefs[index]).node());; 

            if (lastX === null || lastK === null) {
                lastK = k; 
                lastX = x; 
            } else {
                let { focusWidth, timeDomains, numContextsPerSide, controlScale } = this.props; 
                let focusZone = timeDomains[numContextsPerSide]; 
                let isPan = lastK === k;      
                let newProposalId = Math.random(); 
                let shift = undefined; 
                let dl = undefined; 
                let dr = undefined; 
                if (isPan) {
                    let dx = lastX - x; 
                    let [d0,d1] = focusZone; 
                    let tdx = (d1.valueOf() - d0.valueOf()) * (dx / focusWidth); 
                    let pleft = controlScale(d0); 
                    let pright = controlScale(new Date(d0.valueOf() + tdx)); 
                    shift = pright - pleft; 
                } else {
                    let zf = k / lastK; 
                    let [d0,d1] = focusZone; 
                    let tdx = d1.valueOf() - d0.valueOf(); 
                    let dnew = new Date(d0.valueOf() + (tdx * zf)); 
                    let pleft = controlScale(d1);
                    let pright = controlScale(dnew);
                    let dzoom = Math.abs(pright - pleft); 
                    if (zf < 1) {
                        // shrink 
                        dl = dzoom; 
                        dr = -dzoom; 
                    } else {
                        // grow
                        dl = -dzoom; 
                        dr = dzoom;  
                    }
                }
                let proposal = { 
                    id: newProposalId, 
                    index: index, 
                    type: isPan ? 'pan' : 'zoom', 
                    shift, 
                    dl, 
                    dr
                }; 
                
                if ((isPan && lastX !== x) || (!isPan && lastK !== k)) {
                    select('#external-proposal').on('zoom.trackZoom')(proposal); 
                    this.updateTooltip();
                }
                lastX = x; 
                lastK = k; 
                
            }

        }

        return zoomed; 

    }

    initZoom() {
        let { numContextsPerSide } = this.props;
        let { zooms, zoomRefs } = this.state; 
        let numCharts = numContextsPerSide * 2 + 1; 
        for (let i = 0; i < numCharts; i++) {
            let zoomCallback = _.partial(this.createZoomCallback(), i); 
            let zoomTarget = select(zoomRefs[i]); 
            let zoomFn = zooms[i]; 
            zoomTarget.call(zoomFn.on('zoom', zoomCallback)).on('wheel.zoom', null); 
        }
    }

    removeZooms() {
        let { numContextsPerSide } = this.props;
        let { zooms, zoomRefs } = this.state; 
        let numCharts = numContextsPerSide * 2 + 1; 
        for (let i = 0; i < numCharts; i++) {
            let zoomTarget = select(zoomRefs[i]); 
            let zoomFn = zooms[i]; 
            zoomTarget.call(zoomFn.on('zoom', null)); 
        }
    }

    updateAxes() {

        let { axis, quantitativeScale, categoricalScale } = this.state; 
        let { trackHeight, trackSvgOffsetTop, trackSvgOffsetBottom, type, numAxisTicks, axisTickFormatter, valueDomainComputer } = this.props; 

            if (axisTickFormatter) {
                axis.tickFormat(axisTickFormatter); 
            }
            let scale; 
            let applyScaleToAxis; 
            switch (type) {
                case 'discrete': 
                    scale = categoricalScale; 
                    applyScaleToAxis = scale => axis.scale(scale);
                    break; 
                case 'continuous': 
                    scale = quantitativeScale; 
                    applyScaleToAxis = scale => axis.scale(scale.nice()).ticks(numAxisTicks ? numAxisTicks : 4); 
                    break; 
                case 'other': 
                    scale = categoricalScale; 
                    applyScaleToAxis = scale => axis.scale(scale);
                    break; 
    
            }

            let valueDomain = valueDomainComputer ? valueDomainComputer() : this.computeValueDomain(this.props); 
            
            applyScaleToAxis(
                scale.domain(valueDomain)
                        .range([trackHeight - trackSvgOffsetBottom - 1, trackSvgOffsetTop])
            ); 
            select(this.AXES_REF)
                .call(axis)
                    .selectAll('text').classed('pplot-track-axis-text', true);


    }

    updateTooltip = () => {

        let { focusWidth, numContextsPerSide, timeDomains } = this.props;
        let { formatter, timeScale } = this.state;  

        let [x,y] = mouse(this.FOCUS_REF); 
        selectAll('.focus-time-bar')
          .attr('transform', `translate(${x},0)`); 

        let currentDate = timeScale
                            .domain(timeDomains[numContextsPerSide])
                            .range([0, focusWidth])
                            .invert(x);

        let dateString = formatter(currentDate); 
        let containerNode = select(this.FOCUS_REF).node();

        selectAll('.focus-time-text').each(function(d,i) {
            let parentNode = this.parentNode; 
            if (parentNode.isEqualNode(containerNode)) {
                let textS = select(this).text(dateString); 
                let textBbox = this.getBBox();
                let textW = textBbox.width; 
                let propBbox = [x - textW / 2, x + textW / 2]; 
                if (propBbox[0] < 0) {
                    propBbox = propBbox.map(v => v + -propBbox[0]); 
                } else if (propBbox[1] > focusWidth) {
                    propBbox = propBbox.map(v => v + -(propBbox[1] - focusWidth)); 
                } 
                let newX = (propBbox[1] + propBbox[0]) / 2; 
                textS
                    .attr('display', 'block')
                    .attr('transform', `translate(${newX},10)`)
            }
        }); 

    }

    removeTooltip = () => {
        selectAll('.focus-time-bar')
            .attr('transform', `translate(${-1},0)`);
            
        selectAll('.focus-time-text')
            .attr('display', 'none') 
    }

    mousemove = () => {
        this.updateTooltip(); 
    }

    mouseleave = () => {
        this.removeZooms(); 
        this.removeTooltip();
    }

    mouseenter = () => {
        this.initZoom(); 
    }

    componentDidMount() {

        this.updateAxes(); 

        select(this.FOCUS_REF).on('mouseenter', this.mouseenter); 
        select(this.FOCUS_REF).on('mousemove', this.mousemove); 
        select(this.FOCUS_REF).on('mouseleave', this.mouseleave); 

    }

    componentDidUpdate(prevProps, prevState) {
        this.updateAxes(); 
    }

    computeValueDomain(props) {
        let { observations, valueDomainComputer, valueKey, type } = props; 

        let computeContinuousValueDomain = (observations) => {
            // returns [0, max value]
            let [e0,e1] = extent(observations.map(o => o[valueKey])); 
            return [0, e1]
        }

        let computeDiscreteValueDomain = (observations) => {
            // gets all categorical values for discrete domain 
            return _.sortBy(_.uniq(observations.map(o => o[valueKey])), d => d); 
        }

        let valueDomain =   valueDomainComputer ?   valueDomainComputer(observations) : 
                            type === 'continuous' ? computeContinuousValueDomain(observations) : 
                            type === 'discrete' ?   computeDiscreteValueDomain(observations) : 
                            null; 
        return valueDomain; 
    }

    render() {

        let { 
            unit, 
            observations, 
            timeKey, 
            valueKey, 
            timeDomains, 
            numContextsPerSide, 
            trackHeight, 
            trackSvgOffsetTop,
            trackSvgOffsetBottom, 
            axesWidth, 
            focusColor, 
            contextColor, 
            containerPadding, 
            focusWidth, 
            contextWidth, 
            baseWidth, 
            applyContextEncodingsUniformly, 
            type, 
            formatTrackHeader, 
            msecsPadding,
            encodings, 
            valueDomainComputer
        } = this.props; 

        let { zoomRefs } = this.state; 

        // utility functions 
        let valueInDomain = (value, domain) => value >= domain[0] && value <= domain[1]; 
        let observationsInDomain = domain => observations.filter(o => valueInDomain(o[timeKey], domain)); 

        // Indices for zoom and ref objects 
        let leftIndices = _.range(0, numContextsPerSide); 
        let focusIndex = numContextsPerSide; 
        let rightIndices = _.range(numContextsPerSide + 1, numContextsPerSide * 2 + 1); 

        // partitioned domains 
        let leftContextTimeDomains = timeDomains.slice(0, numContextsPerSide);
        let focusTimeDomain = timeDomains[numContextsPerSide]; 
        let rightContextTimeDomains = timeDomains.slice(numContextsPerSide + 1, timeDomains.length);
        
        // partitioned encodings
        let leftContextEncodings = applyContextEncodingsUniformly ? [encodings[0]] : encodings.slice(0, numContextsPerSide); 
        let FocusEncoding = encodings[Math.floor(encodings.length / 2)]; 
        let rightContextEncodings = applyContextEncodingsUniformly ? [encodings[2]] : encodings.slice(numContextsPerSide + 1, encodings.length); 

        // partitioned observations
        let padDomain = _.partial(padDateRange, msecsPadding); 
        let leftContextObservations = leftContextTimeDomains.map(padDomain).map(observationsInDomain);
        let focusObservations = observationsInDomain(padDomain(focusTimeDomain)); 
        let rightContextObservations = rightContextTimeDomains.map(padDomain).map(observationsInDomain); 

        let contextXRange = [0, contextWidth];
        let contextYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];  
        let focusXRange = [0, focusWidth]; 
        let focusYRange = [trackHeight - trackSvgOffsetBottom, trackSvgOffsetTop];
        let contextScaleRangeToBox = _.partial(scaleRangeToBox, contextXRange, contextYRange); 
        let focusScaleRangeToBox = _.partial(scaleRangeToBox, focusXRange, focusYRange); 

        let tHeight = trackHeight - trackSvgOffsetTop - trackSvgOffsetBottom; 

        let valueDomain = this.computeValueDomain(this.props); 

        let getAllObservations = () => observations; 

        // namespace for periphery plot properties 
        let pplot = {
            timeKey,
            valueKey,
            valueDomain, 
            getAllObservations, 
            unit 
        };
        
        return (
        <div style={{ width: baseWidth, paddingLeft: containerPadding, paddingRight: containerPadding, boxSizing: 'content-box' }}>

            {/* Track Label */}
            <div 
            className={'pplot-track-header-text-container'}
            style={{ width: "100%", display: "block" }}>
                <p className={'pplot-track-header-text'}>
                    {formatTrackHeader(valueKey, unit)}
                </p>
            </div>

            {/* Axis */}
            <svg 
            className="pplot-axis"
            ref={ref => this.AXES_REF = ref} 
            style={{ width: axesWidth, height: trackHeight, float: 'left', background: '#fff' }}/>

            {/* Left Contexts */}
            {leftContextTimeDomains.map((timeDomain, i) => {

                let LeftContextEncoding = applyContextEncodingsUniformly ? leftContextEncodings[0] : leftContextEncodings[i]; 
                let clipId = `left-clip-${i}`; 
                let pplotLeft = Object.assign({}, pplot); 
                let observations = leftContextObservations[i]; 
                let index = leftIndices[i]; 
                pplotLeft = Object.assign(pplotLeft, { observations, timeDomain, xRange: contextXRange, yRange: contextYRange, isLeft: true, scaleRangeToBox: contextScaleRangeToBox }); 

                return (
                    <svg 
                    key={`left-${i}`}
                    clipPath={`url(#${clipId})`}
                    style={{ width: contextWidth, height: trackHeight, display: 'inline-block', float: 'left', background: '#fff'  }}>

                        {/* Clipping */}
                        <defs>
                            <clipPath id={clipId}>
                                <rect 
                                x={0} 
                                y={trackSvgOffsetTop} 
                                width={contextWidth} 
                                height={tHeight}/>
                            </clipPath>
                        </defs>

                        {/* Border */}
                        <rect 
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        {/* Encodings */}
                        {LeftContextEncoding.map((LayeredEncoding, j) => 
                            <LayeredEncoding
                            key={`left-${i}-${j}-inner`}
                            pplot={pplotLeft}/>
                        )}

                        {/* zoom target */}
                        <rect 
                        ref={ref => zoomRefs[index] = ref}
                        className={`zoom`}
                        pointerEvents="none"
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        fill='none'/>

                    </svg>
                ); 
            })}

            {/* Focus */}
            <svg 
            className="periphery-plots-focus"
            ref={ref => this.FOCUS_REF = ref}
            style={{ width: focusWidth, height: trackHeight, display: 'inline-block', float: 'left', background: '#fff'  }}>

                {/* Clipping */}
                <defs>
                    <clipPath id="focus-clip">
                        <rect 
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={focusWidth} 
                        height={tHeight}/>
                    </clipPath>
                </defs>

                {/* Apply clipping to all elements within visualization space */}
                <g clipPath={`url(#focus-clip)`}>

                    {/* Focus Border */}
                    <rect 
                    x={0} 
                    y={trackSvgOffsetTop} 
                    width={focusWidth} 
                    height={tHeight} 
                    stroke={focusColor} 
                    fill='none'/>

                    {/* Current time point hover bar */}
                    <rect
                    className="focus-time-bar"
                    x={0}
                    y={trackSvgOffsetTop + 1}
                    width={.1}
                    height={tHeight - 2}
                    stroke="#515151"/>

                    {/* Focus visualization(s) */}
                    {FocusEncoding.map((LayeredEncoding,j) => 
                        <LayeredEncoding
                        key={`focus-${j}`}
                        pplot={Object.assign(Object.assign({}, pplot), { observations: focusObservations, timeDomain: focusTimeDomain, xRange: focusXRange, yRange: focusYRange, scaleRangeToBox: focusScaleRangeToBox, isFocus: true })}/>
                    )}

                    {/* zoom target */}
                    <rect 
                    ref={ref => zoomRefs[focusIndex] = ref}
                    className={`zoom`}
                    pointerEvents="all"
                    x={0} 
                    y={trackSvgOffsetTop} 
                    width={focusWidth} 
                    height={tHeight} 
                    fill='none'/>

                </g>

                {/* Current time tooltip (only visible when mouse in container) exists outside clip */}
                <text
                className="focus-time-text"
                x={0}
                y={-2}
                fontFamily={'Helvetica'}
                fill={'black'}
                stroke={'white'}
                strokeWidth={.2}
                fontSize={8}
                textAnchor="middle"/>

            </svg>

            {/* Right Contexts */}
            {rightContextTimeDomains.map((timeDomain, i) => {
                
                let RightContextEncoding = applyContextEncodingsUniformly ? rightContextEncodings[0] : rightContextEncodings[i]; 
                let clipId = `right-clip-${i}`; 
                let observations = rightContextObservations[i]; 
                let pplotRight = Object.assign({}, pplot);
                let index = rightIndices[i]; 
                pplotRight = Object.assign(pplot, { observations, timeDomain, xRange: contextXRange, yRange: contextYRange, scaleRangeToBox: contextScaleRangeToBox }); 
                
                return (
                    <svg 
                    key={`right-${i}`}
                    clipPath={`url(#${clipId})`}
                    style={{ width: contextWidth, height: trackHeight, display: 'inline-block', float: 'left', background: '#fff'  }}>
                        
                        {/* Clipping */}
                        <defs>
                            <clipPath id={clipId}>
                                <rect 
                                x={0} 
                                y={trackSvgOffsetTop} 
                                width={contextWidth} 
                                height={tHeight}/>
                            </clipPath>
                        </defs>
                        
                        {/* Border */}
                        <rect 
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        stroke={contextColor} 
                        fill='none'/>

                        {/* Encodings */}
                        {RightContextEncoding.map((LayeredEncoding, j) => 
                            <LayeredEncoding
                            key={`right-${i}-${j}-inner`}
                            pplot={pplotRight}/>
                        )}       

                        {/* zoom target */}
                        <rect 
                        ref={ref => zoomRefs[index] = ref}
                        className={`zoom`}
                        pointerEvents="none"
                        x={0} 
                        y={trackSvgOffsetTop} 
                        width={contextWidth} 
                        height={tHeight} 
                        fill='none'/>

                    </svg>
                );
            })}
        </div>
        );
    }

}; 

const mapStateToProps = ({ 
    timeDomains, 
    focusColor, 
    contextColor, 
    containerPadding, 
    focusWidth, 
    contextWidth, 
    trackWidth, 
    trackHeight, 
    trackSvgOffsetTop, 
    trackSvgOffsetBottom, 
    axesWidth, 
    numContextsPerSide, 
    baseWidth, 
    dZoom, 
    applyContextEncodingsUniformly, 
    formatTrackHeader, 
    msecsPadding, 
    controlScale
}) => ({ 
    timeDomains, 
    focusColor, 
    contextColor, 
    containerPadding,
    focusWidth, 
    contextWidth, 
    trackWidth, 
    trackHeight, 
    trackSvgOffsetTop, 
    trackSvgOffsetBottom, 
    axesWidth, 
    numContextsPerSide, 
    baseWidth, 
    dZoom, 
    applyContextEncodingsUniformly,
    formatTrackHeader, 
    msecsPadding, 
    controlScale
}); 
                        
const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_proposal: (proposal) => 
        dispatch(ACTION_CHANGE_proposal(proposal))

})

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(Track); 