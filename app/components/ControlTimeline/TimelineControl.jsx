import React from "react";
import { connect } from "react-redux"; 
import * as d3 from 'd3';
import { event as d3event } from 'd3';
import _ from "lodash"; 
import { assert } from "chai"; 

import  { computeActionFromSelectionTransition, 
          functionFromAction, 
          performShifts
        } from "./TimelineControlUtility.js";
        
import { CONTROL_CONFIGURATION } from "./TimelineControlConfiguration.js"; 

import { ACTION_CHANGE_timeDomains, 
         ACTION_CHANGE_timeExtentDomain
       } from "../../actions/actions"; 

const {
  MARGIN,
  LOCK_WIDTH, 
  LOCK_HEIGHT,  
  HANDLE_WIDTH, 
  HANDLE_HEIGHT, 
  MIN_CONTEXT_WIDTH, 
  MIN_FOCUS_WIDTH
} = CONTROL_CONFIGURATION;

const tupdif = tup => tup[1] - tup[0]; 

class TimelineControl extends React.Component {

  state = {
    brushes: [],        //collection of d3 brush objects 
    brushIds: [],       // Collection of brush ids for selection 
    brushLocks: [],     // Collection of booleans to indicate whether or not a brush is locked 
    brushLockIds: [],   // Collection of ids to reference brush lock ids 
    numBrushes: 0,      // The total number of brushes 
    brushHeight: 0,     // The vertical height of the brush 
    brushRanges: [],    // The current selected regions for all brushes in pixel space 
    timelineScale: d3.scaleTime(), 
    timelineAxis: d3.axisBottom() 
  }

  constructor(props) {

    super(props); 

    let { height, timeDomains } = this.props; 
    
    // 1 focus + equal number of contexts on both sides 
    assert(timeDomains.length % 2 === 1);

    // Infer the number of brushes 
    this.state.numBrushes = timeDomains.length; 

    // Infer focus index
    this.state.focusIndex = parseInt(this.state.numBrushes / 2); 
    
    let brushIndexList = _.range(0, this.state.numBrushes); 

    // The currently selected brush areas (pixels)
    this.state.brushRanges = this.props.timeDomains.map(domain => domain.map(this.props.controlScale)); 

    // Initialize the brushes 
    this.state.brushes = brushIndexList.map(i => d3.brushX()); 

    // Initialize a collection of ids for the brushes 
    this.state.brushIds = brushIndexList.map(i => `brush-${i}`); 

    // Initialize a collection of ids for the brush clips 
    this.state.clipIds = this.state.brushIds.map(id => `${id}-clip`); 

    // Create numBrushes + 1 lock ids 
    this.state.brushLockIds = _.range(0, this.state.numBrushes + 1).map(i => `lock-${i}`); 

    // Set the initial locked state for all locks to false 
    this.state.brushLocks = this.state.brushLockIds.map(i => false); 

    // Brush height - takes up 75% of vertical space in the container (not including MARGIN)
    this.state.brushHeight = (height - (MARGIN.top + MARGIN.bottom)) * .85; 
    
  }

  ingestProposal = (nextProps) => {

    let { proposal } = nextProps; 
    let { shift, dl, dr } = proposal; 
    let { focusIndex } = this.state; 
    let currentSelections = this.getBrushRanges(); 
    let previousSelections1, previousSelections2, 
        newSelections1, newSelections2, 
        newSelections; 

    // TODO: Remove this when locking is implemented for single handle resizing 
    // let aBrushIsLocked = this.state.brushLocks.reduce((acc,cur) => acc || cur, false); 
    // if (proposal.type === 'zoom' && aBrushIsLocked) 
    //   return; 

    switch (proposal.type) {
      case 'pan': 
        // translate 
        previousSelections1 = currentSelections.slice(); 
        newSelections1 = previousSelections1.slice(); 
        newSelections1[focusIndex] = previousSelections1[focusIndex].map(v => v + shift); 

        newSelections = this.computeAction(focusIndex, newSelections1, previousSelections1); 
        break; 
      case 'zoom': 
        // grow/shrink left 
        previousSelections1 = currentSelections.slice(); 
        newSelections1 = currentSelections.slice(); 
        newSelections1[focusIndex] = [previousSelections1[focusIndex][0] + dl, 
                                      previousSelections1[focusIndex][1]]; 
        
        // grow/shrink right 
        previousSelections2 = this.computeAction(focusIndex, newSelections1, previousSelections1); 
        newSelections2 = previousSelections2.slice(); 
        newSelections2[focusIndex] = [previousSelections2[focusIndex][0], 
                                      previousSelections2[focusIndex][1] + dr]; 

        newSelections = this.computeAction(focusIndex, newSelections2, previousSelections2);
        break; 
    }

    this.updateAll(newSelections); 
  }

  shouldComponentUpdate(nextProps, nextState) {

    // If change occurred in vista track, we will have a new proposal 
    if (nextProps.proposal.id !== this.props.proposal.id) {
      this.ingestProposal(nextProps); 
    }

    // If container was resized, we need to resize the control axis and brushes 
    if (nextProps.width !== this.props.width && nextProps.width > 0) {

      let { controlScale, containerPadding } = nextProps; 
      let { brushSvgWidth, axisSvgWidth } = this.computeBrushAndAxisSvgWidths(nextProps.width, nextProps.containerPadding); 
      let { timelineScale, timelineAxis } = nextState; 

      // Update the control axis 
      d3.select('#axis-svg').attr('width', axisSvgWidth); 
      let [cr0, cr1] = controlScale.range(); 
      timelineScale.range([cr0 + containerPadding, cr1 - containerPadding]);
      d3.selectAll('.control-axis').call(timelineAxis); 

      // Update the brushes 
      d3.select('#brush-svg').attr('width', brushSvgWidth); 
      
      // Pixel ranges for each brush 
      let brushRanges = nextProps.timeDomains.map(domain => domain.map(nextProps.controlScale)); 

      // Update clipping paths for each brush 
      for (let i = 0; i < nextState.numBrushes; i++) {
        let clipId = nextState.clipIds[i]; 
        let brushSelection = brushRanges[i]; 
        d3.select(`#${clipId}`)
          .attr('width', `${brushSelection[1] - brushSelection[0]}`)
          .attr('transform', `translate(${brushSelection[0]}, 0)`);
      }

      // Update the brushes 
      for (let i = 0; i < nextState.numBrushes; i++) {
        
        // move brush 
        let brushFn = nextState.brushes[i]; 
        let brushId = nextState.brushIds[i]; 
        let brushSelection = brushRanges[i]; 
        let brush = d3.select(`#${brushId}`); 
        brush.call(brushFn.move, brushSelection); 

        // move handles 
        brush.select('.handle-left').attr('transform', `translate(${brushSelection[0]},0)`); 
        brush.select('.handle-right').attr('transform', `translate(${brushSelection[1] - HANDLE_WIDTH},0)`); 
      } 

      // Update the locks 
      for (let i = 0, li = 0; i < this.state.numBrushes; i++) {
        let brushSelection = brushRanges[i]; 
        if (i === 0) {
          d3.select(`#${nextState.brushLockIds[li++]}`).attr('transform', `translate(${brushSelection[0] - LOCK_WIDTH / 2}, 0)`); 
          d3.select(`#${nextState.brushLockIds[li++]}`).attr('transform', `translate(${brushSelection[1]- LOCK_WIDTH / 2}, 0)`); 
        }
        else {
          d3.select(`#${nextState.brushLockIds[li++]}`).attr('transform', `translate(${brushSelection[1]- LOCK_WIDTH / 2}, 0)`);  
        }
      }

      // Update state with newly selected brush ranges
      this.setState({ brushRanges });

    }

    // D3 performs updates in all other cases 
    return false;

  }

  computeBrushAndAxisSvgWidths = (width, containerPadding) => {
    let brushSvgWidth = width - (2 * containerPadding); 
    let axisSvgWidth = width; 
    return { brushSvgWidth, axisSvgWidth }; 
  }

  componentDidMount() {
    // Code to create the d3 element, using the root container 
    let { width, height, focusColor, contextColor, containerPadding, lockActiveColor, lockInactiveColor } = this.props; 
    
    let root = d3.select(this.ROOT); 

    let { brushSvgWidth } = this.computeBrushAndAxisSvgWidths(width, containerPadding); 
    
    // Create the svg container for the brushes
    let svg = root.append('svg')
                  .attr('id', 'brush-svg')
                  .attr('width', brushSvgWidth)  // padding on left and right 
                  .attr('height', height)
                  .style('padding-left', containerPadding)
                  .style('padding-right', containerPadding)
                  .style('padding-top', containerPadding)

    // Pixel ranges for each brush 
    let brushRanges = this.props.timeDomains.map(domain => domain.map(this.props.controlScale)); 

    // Create a clipping path for each brush  
    for (let i = 0; i < this.state.numBrushes; i++) {

      let clipId = this.state.clipIds[i]; 
      let brushSelection = brushRanges[i]; 

      svg.append('clipPath')
          .attr('id', clipId)
            .append('rect')
            .attr('x', 0)
            .attr('y', MARGIN.top)
            .attr('width', tupdif(brushSelection))
            .attr('height', this.state.brushHeight)
            .attr('transform', `translate(${brushSelection[0]}, 0)`);

    }

    let lockClick = (lockId) => {
        // Determine the lock index of the clicked lock 
        let lockIndex = this.state.brushLockIds.indexOf(lockId); 
        assert(lockIndex >= 0, 'lock doesnt exist'); 

        // Toggle the lock state
        let { brushLocks } = this.state;
        brushLocks[lockIndex] = !brushLocks[lockIndex];
        this.setState({ brushLocks }); 
        
        // Apply an animation to the lock to indicate the change 
        d3.select(`#${lockId}`)
          .transition(d3.transition().duration(300).ease(d3.easeLinear))
          .attr('fill', brushLocks[lockIndex] ? lockActiveColor : lockInactiveColor); 
    }

    let addLock = (x, y, lockId) => {
      // Add a lock object at the given x,y position extending downwards
      svg.append('g')
            .append('rect')
            .attr('id', lockId)
            .attr('x', 0)
            .attr('y', y)
            .attr('width', LOCK_WIDTH)
            .attr('height', LOCK_HEIGHT)
            .attr('transform', `translate(${x - LOCK_WIDTH / 2},0)`)
            .attr('fill', lockInactiveColor)
            .attr('rx', LOCK_HEIGHT / 4)
            .on('click', _.partial(lockClick, lockId)); 
            
    }

    // Creating a locking mechanism for every bi-directional handle 
    let dy = 1; 
    let lockTopY = this.state.brushHeight + dy; // locks are placed right below bottom of brush 
    for (let i = 0, li = 0; i < this.state.numBrushes; i++) {
      let brushSelection = brushRanges[i]; 
      let isFirst = i === 0; 
      if (isFirst) {
        // Add a lock to the beginning and end of the current brush 
        addLock(brushSelection[0], lockTopY, this.state.brushLockIds[li++]); 
        addLock(brushSelection[1], lockTopY, this.state.brushLockIds[li++]); 
      }
      else {
        // Add a lock to the end of the current brush 
        addLock(brushSelection[1], lockTopY, this.state.brushLockIds[li++]);  
      }
    }

    // Create brushes 
    for (let i = 0; i < this.state.numBrushes; i++) {

      let brushFn = this.state.brushes[i]; 
      let brushId = this.state.brushIds[i]; 
      let clipId = this.state.clipIds[i]; 
      let brushSelection = brushRanges[i]; 
      let isFocus = i === parseInt(this.state.numBrushes / 2); 

      // Set the width ; height of the brush, height is retained when future transforms (resize / translate) are applied 
      brushFn.extent([[-10000, MARGIN.top], 
                      [10000, this.state.brushHeight]]); 

      // Add a brush to the svg 
      let userBrushed = _.partial(this.userBrushed, i)
      let brushG = svg.append("g")
                      .attr("id", brushId)
                      .attr('class', 'brush')
                      .attr('clipPath', `url(#${clipId})`)
                      .call(brushFn.on("brush", userBrushed))
                      .call(brushFn.move, brushSelection); 

      // Removes white stroke outline from brush. This looks bad if the user uses a custom style 
      // and the background color clashes with the white 
      brushG.selectAll('rect').attr('stroke', 'none'); 

      // Removes pointer events on overlay which takes up 100% of space in svg container 
      // By doing this, we only capture mouse events that occur over the selection region 
      // of the brush 
      brushG
        .select("rect.overlay")
        .style("pointer-events", "none"); 

      if (isFocus) {
        // Apply styling to the focus brush region
        brushG
          .select("rect.selection")
          .style("fill", focusColor); 
      } else {
        // Apply styling to the context brush region
        brushG
          .select("rect.selection")
          .style("fill", contextColor); 
      }

      // Append custom handles to brush
      brushG.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter()
              .append("g")
              .attr('clipPath', `url(#${clipId})`)
                .append("rect")
                .attr('clipPath', `url(#${clipId})`)
                .attr('x', 0)
                .attr('y', MARGIN.top + this.state.brushHeight / 2 - HANDLE_HEIGHT / 2)
                .attr('width', HANDLE_WIDTH)
                .attr('height', HANDLE_HEIGHT)
                .attr('transform', (d) => (d.type === 'w') ? `translate(${brushSelection[0]},0)` : 
                                                             `translate(${brushSelection[1] - HANDLE_WIDTH},0)`)
                .attr('rx', 3)
                .attr("class", (d) => `handle--custom ${d.type === 'w' ? 'handle-left' : 'handle-right'}`)
                .attr("fill", "#009688")
                .attr("fill-opacity", 0.8)
                .attr("cursor", "ew-resize");

      // Disable existing brushes. Pointer events only active on custom brushes 
      brushG.select('.handle--e').style('pointer-events', 'none')
      brushG.select('.handle--w').style('pointer-events', 'none')

    }

    this.appendTimeline(); 

  }

  appendTimeline = () => {

    let root = d3.select(this.ROOT); 
    let { controlScale, containerPadding, height, width, tickInterval } = this.props; 
    let { timelineScale, timelineAxis } = this.state; 
    let { axisSvgWidth } = this.computeBrushAndAxisSvgWidths(width, containerPadding); 

    let [cr0, cr1] = controlScale.range(); 
    timelineScale.domain(controlScale.domain())
                 .range([cr0 + containerPadding, cr1 - containerPadding]); 

    let axisSvg = root.append('svg')
                        .attr('id', 'axis-svg')
                        .attr('height', height)
                        .attr('width', axisSvgWidth)
                        .attr('pointer-events', 'none')
                        .style('position', 'absolute') 
                        .style('top', containerPadding)
                        .style('left', 0)
                        .style('backgroundColor', 'rgba(0,0,0,0)');

    // Create a timeline 
    let axisGenerator = timelineAxis.scale(timelineScale).ticks(tickInterval); 

    axisSvg .append("g")
            .attr('class', 'control-axis')
            .call(axisGenerator) 
              .selectAll('text')
              .classed('pplot-control-timeline-text', true);

  }

  _updateBrushSelections = (newSelections) => {
    for (let i = 0; i < this.state.numBrushes; i++) {
      // if (!_.isEqual(oldSelections[i], newSelections[i])) {
        d3.select(`#${this.state.brushIds[i]}`)
          .call(this.state.brushes[i].move, newSelections[i]); 
      // }
    }
  }

  _updateBrushExtras(newSelections) {

    // update left handles 
    let leftHandles = d3.selectAll(".handle-left"); 
    let leftNodes = leftHandles.nodes(); 
    _.sortBy(leftNodes.map(node => parseInt(node.attributes.nodeValue))
                      .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => d3.select(leftNodes[hi])
                       .attr('transform', `translate(${newSelections[bi][0]},0)`)); 

    // update right handles 
    let rightHandles = d3.selectAll(".handle-right"); 
    let rightNodes = rightHandles.nodes(); 
    _.sortBy(rightNodes.map(node => parseInt(node.attributes.nodeValue))
                        .map((pos,hi) => ({ pos, hi })), 
             obj => obj.pos)
    .map(({ hi }) => hi)
    .map((hi, bi) => d3.select(rightNodes[hi])
                       .attr('transform', `translate(${newSelections[bi][1] - HANDLE_WIDTH}, 0)`)); 

    // update clip positions 
    _.range(0, this.state.numBrushes).map(i => 
      d3.select(`#${this.state.clipIds[i]} > rect`)
        .attr('transform', `translate(${parseInt(newSelections[i][0])}, 0)`)
        .attr('width', tupdif(newSelections[i]))
    )

    // update lock positions
    for (let i = 0; i < this.state.numBrushes; i++) {
      if (i === 0) {
        d3.select(`#${this.state.brushLockIds[i]}`).attr('transform', `translate(${newSelections[i][0] - LOCK_WIDTH / 2},0)`);  
        d3.select(`#${this.state.brushLockIds[i+1]}`).attr('transform', `translate(${newSelections[i][1] - LOCK_WIDTH / 2},0)`);
      } else {
        d3.select(`#${this.state.brushLockIds[i+1]}`).attr('transform', `translate(${newSelections[i][1] - LOCK_WIDTH / 2},0)`);
      }
    }
    
  }

  getLockBounds(brushIndex) {

    // Determine the closest brush to the left of the current brush that is either left or right locked
    // this can possibly be the current brush 
    let leftLockedBrushIndex = -1; 
    for (let i = brushIndex - 1; i >= 0; i--) {
      let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(i); 
      if (leftHandleLocked || rightHandleLocked) {
        leftLockedBrushIndex = i; 
        break; 
      }
    }

    // Determine the closest brush to the right of the current brush that is either left or right locked
    // this can possibly be the current brush 
    let rightLockedBrushIndex = -1; 
    for (let i = brushIndex + 1; i < this.state.numBrushes; i++) {
      let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(i); 
      if (leftHandleLocked || rightHandleLocked) {
        rightLockedBrushIndex = i; 
        break; 
      }
    }


    return [leftLockedBrushIndex, rightLockedBrushIndex]; 
  }

  computeActionProperties = (index, currentSelections=null, previousSelections=null) => {
    // Compute a set of properties related to the current action 

    currentSelections = currentSelections === null ? this.getBrushRanges() : currentSelections.slice(); 
    previousSelections = previousSelections === null ? this.state.brushRanges.slice() : previousSelections.slice(); 

    let isFocus = index === this.state.focusIndex;  
    let preS = previousSelections[index]; 
    let preW = tupdif(preS); 
    let curS = currentSelections[index]; 
    let [leftHandleLocked, rightHandleLocked] = this.isBrushLocked(index); 
    let isLocked = leftHandleLocked || rightHandleLocked; 
    let leftIndexRange = [0, index];
    let rightIndexRange = [Math.min(this.state.numBrushes, index + 1), this.state.numBrushes]; 
    let minWidth = this.state.focusIndex === index ? MIN_FOCUS_WIDTH : MIN_CONTEXT_WIDTH; 
    let curWidth = curS[1] - curS[0]; 
    let tooSmall = curWidth < minWidth;
    let brushLockBounds = this.getLockBounds(index);
    let [leftLockIndex, rightLockIndex] = brushLockBounds; 
    let lockedToLeft = brushLockBounds[0] !== -1; 
    let lockedToRight = brushLockBounds[1] !== -1; 
    let leftLockBoundS = lockedToLeft ? currentSelections[leftLockIndex] : null; 
    let rightLockBoundS = lockedToRight ? currentSelections[rightLockIndex] : null; 
    let leftOverlappedRight = preS[1] === curS[0]; 
    let rightOverlappedLeft = preS[0] === curS[1]; 
    let overlapped = leftOverlappedRight || rightOverlappedLeft; 
    let isFirst = index === 0; 
    let isLast = index === numBrushes - 1; 
    let shiftSet = []; 
    let { numBrushes } = this.state; 
    let action = computeActionFromSelectionTransition(preS, curS); 
    assert(action !== null, 'invalid brush action');
    return { 
      isFocus,
      action, 
      currentSelections, 
      previousSelections, 
      preS, 
      preW, 
      curS, 
      numBrushes, 
      overlapped, 
      leftHandleLocked, 
      rightHandleLocked, 
      isLocked, 
      leftIndexRange, 
      rightIndexRange, 
      minWidth, 
      curWidth, 
      tooSmall,
      brushLockBounds, 
      lockedToLeft, 
      lockedToRight, 
      leftLockIndex, 
      rightLockIndex, 
      leftLockBoundS, 
      rightLockBoundS, 
      leftOverlappedRight, 
      rightOverlappedLeft, 
      shiftSet, 
      isFirst, 
      isLast
    }; 
  }

  isBrushLeftLocked = (brushIndex) => this.state.brushLocks[brushIndex] 

  isBrushRightLocked = (brushIndex) => this.state.brushLocks[brushIndex+1]

  isBrushLocked = (brushIndex) => [this.isBrushLeftLocked(brushIndex), this.isBrushRightLocked(brushIndex)]

  getBrushRanges = () => (
    // Returns an array of two element lists, each representing the current selected pixel 
    // region of all of the brushes 
    this.state.brushIds
        .map(id => d3.select(`#${id}`).node())
        .map(d3.brushSelection)
  )

  computeAndPerformAction = (index, currentSelections) => this.updateAll(this.computeAction(index, currentSelections))

  userBrushed = (index) => (this.isUserGeneratedBrushEvent(index) && this.computeAndPerformAction(index))

  isUserGeneratedBrushEvent = (index) => !(
    // Ensure the current event was a user brush interaction 
    // We do not perform updates on zooms of via calls to brush.move 
    (!d3.select(`#${this.state.brushIds[index]}`).node()) || 
    (!d3event.sourceEvent) ||
    (d3event.sourceEvent && d3event.sourceEvent.type === 'brush') || 
    (d3event.sourceEvent && d3event.sourceEvent.type === 'zoom')
  )

  computeAction(index, currentSelections=null, previousSelections=null) {

      let actionProperties = this.computeActionProperties(index, currentSelections, previousSelections); 
      let newSelections; 
      if (actionProperties.overlapped) {
        newSelections = actionProperties.previousSelections; 
      } else {
        let actionExecutor = functionFromAction(actionProperties.action);
        let res = actionExecutor(index, actionProperties);  
        newSelections = res.currentSelections; 
        for (let shiftObj of res.shiftSet) {
          let { shift, shiftIndices } = shiftObj; 
          newSelections = performShifts(newSelections, shiftIndices, shift); 
        }
      }

      return newSelections
  }

  updateAll = (newSelections) => {
    this._updateBrushSelections(newSelections); 
    this._updateBrushExtras(newSelections);
    this.setState({ brushRanges: newSelections }); 
    this.props.ACTION_CHANGE_timeDomains(newSelections.map(s => s.map(this.props.controlScale.invert).map(t => new Date(t)))); 
  }

  render() {  
    return <div style={{ position: 'relative' }} ref={ref => this.ROOT = ref}/>
  }

}

const mapStateToProps = ({ timeDomains, timeExtentDomain, focusColor, contextColor, containerPadding, proposal, tickInterval }) => 
                        ({ timeDomains, timeExtentDomain, focusColor, contextColor, containerPadding, proposal, tickInterval });

const mapDispatchToProps = dispatch => ({

  ACTION_CHANGE_timeDomains: (timeDomains) => 
    dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 

  ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
    dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain))
    
}); 

export default connect(mapStateToProps, mapDispatchToProps)(TimelineControl);