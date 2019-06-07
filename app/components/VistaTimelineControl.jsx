import React from "react";
import { connect } from "react-redux"; 
import * as d3 from 'd3';
import { event as d3event } from 'd3';
import _ from "lodash"; 
import { assert } from "chai"; 

// import { getEquilateralTriangleFromCentroid, logicalOrOver } from "../util/util"; 

import { ACTION_CHANGE_timeDomains, 
         ACTION_CHANGE_timeExtentDomain
       } from "../actions/actions"; 

const MARGIN = {
  left: 0, 
  right: 0, 
  top: 0, 
  bottom: 5
}; 
const LOCK_WIDTH = 10; 
const LOCK_HEIGHT = 10; 
const LOCK_ACTIVE_COLOR = "grey"; 
const LOCK_INACTIVE_COLOR = "black"; 
const HANDLE_WIDTH = 12; 
const HANDLE_HEIGHT = 12; 
const MIN_CONTEXT_WIDTH = HANDLE_WIDTH * 2; 
const MIN_FOCUS_WIDTH = HANDLE_WIDTH * 2; 

const tupdif = tup => tup[1] - tup[0]; 

const brushActions = {

  // Possible brush actions
  RESIZE_SHRINK_LEFT: 0, 
  RESIZE_SHRINK_RIGHT: 1, 
  RESIZE_GROW_LEFT: 2, 
  RESIZE_GROW_RIGHT: 3, 
  TRANSLATE_LEFT: 4, 
  TRANSLATE_RIGHT: 5, 

  // If not resize, translate occurred 
  isResize: function(brushAction) {
     return [this.RESIZE_SHRINK_LEFT, 
             this.RESIZE_SHRINK_RIGHT, 
             this.RESIZE_GROW_LEFT, 
             this.RESIZE_GROW_RIGHT].includes(brushAction); 
  }, 

  leftHandleChanged: function(brushAction) {
    return [this.RESIZE_SHRINK_LEFT, 
            this.RESIZE_GROW_LEFT, 
            this.TRANSLATE_LEFT].includes(brushAction);
  }

}; 

const computeAction = (preS, curS) => {
  return  (preS[0] < curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_SHRINK_LEFT : 
          (preS[0] > curS[0] && preS[1] === curS[1]) ? brushActions.RESIZE_GROW_LEFT :
          (preS[1] > curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_SHRINK_RIGHT : 
          (preS[1] < curS[1] && preS[0] === curS[0]) ? brushActions.RESIZE_GROW_RIGHT :           
          (preS[0] > curS[0] && preS[1] > curS[1]) ?   brushActions.TRANSLATE_LEFT : 
          (preS[0] < curS[0] && preS[1] < curS[1]) ?   brushActions.TRANSLATE_RIGHT : 
          null;
}

const action = {
  perform_RESIZE_SHRINK_LEFT: (index, actionProperties) => {

    // Unpack properties 
    let { 
      leftHandleLocked, 
      tooSmall, 
      preS, 
      curS, 
      minWidth, 
      leftLockIndex, 
      leftLockBoundS, 
      shift, 
      leftIndexRange, 
      shiftIndices, 
      lockedToLeft, 
      currentSelections
    } = actionProperties; 

    // Perform action 
    if (leftHandleLocked) {
      currentSelections[index] = preS;
    } else {
      if (tooSmall) {
        currentSelections[index] = [preS[1] - minWidth, preS[1]];
        shift = currentSelections[index][0] - preS[0];
      } else {
        shift = curS[0] - preS[0]; 
      }
      if (lockedToLeft) {
        currentSelections[leftLockIndex] = [leftLockBoundS[0],
                                        leftLockBoundS[1] + shift]; 
        shiftIndices = _.range(leftIndexRange[0] + 1, leftIndexRange[1]); 
      } else {
        shiftIndices = _.range(...leftIndexRange); 
      }
    }

    // Return new state 
    return { shift, shiftIndices, currentSelections }; 
  },
  perform_RESIZE_SHRINK_RIGHT: (index, actionProperties) => {

    let { 
      rightHandleLocked, 
      currentSelections, 
      preS, 
      curS, 
      tooSmall, 
      minWidth, 
      shift, 
      lockedToRight, 
      rightLockBoundS, 
      shiftIndices, 
      rightIndexRange, 
      rightLockIndex 
    } = actionProperties; 

    if (rightHandleLocked) {
      currentSelections[index] = preS;
    } else {
      if (tooSmall) {
        currentSelections[index] = [preS[0], preS[0] + minWidth];
        shift = currentSelections[index][1] - preS[1];   
      } else {
        shift = curS[1] - preS[1];  
      }
      if (lockedToRight) {
        currentSelections[rightLockIndex] = [rightLockBoundS[0], 
                                          rightLockBoundS[1] + shift];
        shiftIndices = _.range(index + 1, rightLockIndex); 
      } else {
        shiftIndices = _.range(...rightIndexRange);
      }
    }

    return { shift, shiftIndices, currentSelections }; 
  },
  perform_RESIZE_GROW_LEFT: (index, actionProperties) => {

    let { 
      leftHandleLocked, 
      currentSelections, 
      preS, 
      shift, 
      curS, 
      shiftIndices, 
      leftIndexRange
    } = actionProperties; 

    if (leftHandleLocked) {
      currentSelections[index] = preS; 
    } else {
      shift = curS[0] - preS[0]; 
      shiftIndices = _.range(...leftIndexRange); 
    }

    return { shift, shiftIndices, currentSelections }; 
  },
  perform_RESIZE_GROW_RIGHT: (index, actionProperties) => {

    let { 
      rightHandleLocked, 
      currentSelections, 
      preS, 
      curS, 
      shift, 
      shiftIndices, 
      rightIndexRange
    } = actionProperties; 

    if (rightHandleLocked) {
      currentSelections[index] = preS; 
    } else {
      shift = curS[1] - preS[1]; 
      shiftIndices = _.range(...rightIndexRange); 
    }

    return { shift, shiftIndices, currentSelections }; 
  },
  perform_TRANSLATE_LEFT: (index, actionProperties) => {

    let { 
      isLocked, 
      currentSelections, 
      preS, 
      curS, 
      shift, 
      shiftIndices, 
      numBrushes
    } = actionProperties; 

    if (isLocked) {
      currentSelections[index] = preS; 
    } else {
      shift = curS[0] - preS[0]; 
      shiftIndices = _.range(0, numBrushes).filter(i => i !== index);
    }

    return { shift, shiftIndices, currentSelections }; 
  },
  perform_TRANSLATE_RIGHT: (index, actionProperties) => {

    let { 
      isLocked, 
      currentSelections, 
      preS, 
      curS, 
      shift, 
      shiftIndices, 
      numBrushes
    } = actionProperties; 

    if (isLocked) {
      currentSelections[index] = preS; 
    } else {
      shift = curS[0] - preS[0]; 
      shiftIndices = _.range(0, numBrushes).filter(i => i !== index);
    }

    return { shift, shiftIndices, currentSelections };  
  }
};

const functionFromAction = (currentAction) => {
  switch (currentAction) {
    case brushActions.RESIZE_SHRINK_LEFT:   return action.perform_RESIZE_SHRINK_LEFT;
    case brushActions.RESIZE_SHRINK_RIGHT:  return action.perform_RESIZE_SHRINK_RIGHT;
    case brushActions.RESIZE_GROW_LEFT:     return action.perform_RESIZE_GROW_LEFT; 
    case brushActions.RESIZE_GROW_RIGHT:    return action.perform_RESIZE_GROW_RIGHT; 
    case brushActions.TRANSLATE_LEFT:       return action.perform_TRANSLATE_LEFT;
    case brushActions.TRANSLATE_RIGHT:      return action.perform_TRANSLATE_RIGHT; 
    default:                                return null; 
  }
}

class VistaTimelineControl extends React.Component {

  state = {
    brushes: [], //collection of d3 brush objects 
    brushIds: [], // Collection of brush ids for selection 
    brushLocks: [], // Collection of booleans to indicate whether or not a brush is locked 
    brushLockIds: [], // Collection of ids to reference brush lock ids 
    numBrushes: 0, // The total number of brushes 
    brushHeight: 0, // The vertical height of the brush 
    brushRanges: [] // The current selected regions for all brushes in pixel space 
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

  shouldComponentUpdate(nextProps, nextState) {

    let newProposal = nextProps.proposal.id !== this.props.proposal.id; 
    if (newProposal) {
      let { proposal } = nextProps; 
      let { shift, dl, dr } = proposal; 
      let { focusIndex } = this.state; 
      let currentSelections = this.getBrushRanges(); 
      let previousSelections1, previousSelections2, 
          newSelections1, newSelections2, 
          newSelections; 
      switch (proposal.type) {
        case 'pan': 

          if (shift === 0) break; 

          previousSelections1 = currentSelections.slice(); 
          newSelections1 = previousSelections1.slice(); 
          newSelections1[focusIndex] = previousSelections1[focusIndex].map(v => v + shift); 

          newSelections = this.computeAction(focusIndex, newSelections1, previousSelections1).newSelections;
          this.updateAll(newSelections.map(e => 0), newSelections); 

          break; 
        case 'zoom': 

          previousSelections1 = currentSelections.slice(); 
          newSelections1 = currentSelections.slice(); 
          newSelections1[focusIndex] = [previousSelections1[focusIndex][0] + dl, 
                                        previousSelections1[focusIndex][1]]; 

          previousSelections2 = this.computeAction(focusIndex, newSelections1, previousSelections1).newSelections; 
          newSelections2 = previousSelections2.slice(); 
          newSelections2[focusIndex] = [previousSelections2[focusIndex][0], 
                                        previousSelections2[focusIndex][1] + dr]; 

          newSelections = this.computeAction(focusIndex, newSelections2, previousSelections2).newSelections;
          this.updateAll(newSelections.map(e => 0), newSelections); 

          break; 
      }
    }

    return true;

  }

  componentDidMount() {
    // Code to create the d3 element, using the root container 
    let { width, height, focusColor, contextColor, padding, controlScale } = this.props; 
    
    let root = d3.select(this.ROOT); 
    
    // Create the svg container for the brushes
    let svg = root.append('svg')
                  .attr('width', width) 
                  .attr('height', height)
                  .style('padding-left', padding)
                  .style('padding-right', padding)
                  .style('padding-top', padding)

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
          .attr('fill', brushLocks[lockIndex] ? LOCK_ACTIVE_COLOR : LOCK_INACTIVE_COLOR); 
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
            .attr('fill', LOCK_INACTIVE_COLOR)
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
      brushG.select('.handle--e', ).style('pointer-events', 'none')
      brushG.select('.handle--w', ).style('pointer-events', 'none')

    }

    let controlScaleRange = controlScale.range(); 
    let timelineScale = d3.scaleTime().domain(controlScale.domain())
                                      .range([controlScaleRange[0] + padding, controlScaleRange[1] + padding]); 

    let axisSvg = root.append('svg')
                        .attr('height', height + 2 * padding)
                        .attr('width', width + 2 * padding)
                        .attr('pointer-events', 'none')
                        .style('position', 'absolute') 
                        .style('top', padding + 1)
                        .style('left', 0)
                        .style('backgroundColor', 'rgba(0,0,0,0)');

    // Create a timeline 
    let yearAxis = d3.axisBottom()
                    .scale(timelineScale)
                    .ticks(d3.timeYear.every(1));

    let monthAxis = d3.axisBottom()
                      .scale(timelineScale)
                      .ticks(d3.timeMonth.every(3)); 
    
    axisSvg.append("g")
       .call(yearAxis)
        .selectAll('text')
        .attr('font-size', 8)
        .attr('font-weight', 'bold'); 

    axisSvg.append("g")
       .call(monthAxis) 
        .selectAll('text')
        .attr('font-size', 8)

  }

  _updateBrushSelections = (oldSelections, newSelections) => {
    for (let i = 0; i < this.state.numBrushes; i++) {
      if (!_.isEqual(oldSelections[i], newSelections[i])) {
        d3.select(`#${this.state.brushIds[i]}`)
          .call(this.state.brushes[i].move, newSelections[i]); 
      }
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

  isBrushLeftLocked(brushIndex) {
      // Returns true if the brush at brushIndex has its left handle locked 
    return this.state.brushLocks[brushIndex]; 
  }

  isBrushRightLocked(brushIndex) {
    // Returns true if the brush at brushIndex has its right handle locked 
    return this.state.brushLocks[brushIndex+1]; 
  }

  isBrushLocked = (brushIndex) => {
    // Returns an array of the form [boolean, boolean] which indicates 
    // whether or not the left and right handles of the current brush are locked 
    return [this.isBrushLeftLocked(brushIndex), this.isBrushRightLocked(brushIndex)]; 
  }

  areAnyBrushesLocked(start, end) {
    /*
    Returns true if any brushes in the index range [start, end) are locked on either handle 
    */ 
    for ( ; start < end; start++) {
      if (this.isBrushLeftLocked(start) || this.isBrushRightLocked(end)) {
        return true; 
      }
    }
    return false;  
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

  getBrushRanges() {
    // Returns an array of two element lists, each representing the current selected pixel 
    // region of all of the brushes 
    return this.state.brushIds
                .map(id => d3.select(`#${id}`).node())
                .map(d3.brushSelection); 
  }

  selectionsCanShift(selections, shift) {
    /*
    Test if a collection of selections can be shifted 'shift' units and remain within the 
    bounds of the container. Returns true if selections is empty 
    */
    let [smin, smax] = [0 + MARGIN.left, this.props.width - MARGIN.right]; 
    for (let i = 0; i < selections.length; i++) {
      let [s0,s1] = selections[i]; 
      let canShift = s0 + shift >= smin && s1 + shift < smax;  
      if (!canShift) {
        return false; 
      }
    }
    return true; 
  }

  computeActionProperties = (index, currentSelections=null, previousSelections=null) => {
    // Compute a set of properties related to the current action 

    currentSelections = currentSelections === null ? this.getBrushRanges() : currentSelections.slice(); 
    previousSelections = previousSelections === null ? this.state.brushRanges.slice() : previousSelections; 

    let preS = previousSelections[index]; 
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
    let shift = 0; 
    let shiftIndices = []; 
    let { numBrushes } = this.state; 
    let action = computeAction(preS, curS); 
    if (action === null) {
      debugger; 
    }
    assert(action !== null, 'invalid brush action');
    return { 
      action, 
      currentSelections, 
      previousSelections, 
      preS, 
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
      shift, 
      shiftIndices
    }; 
  }

  perform_SHIFTS = (selections, shiftIndices, shift) => {
    return shift !== 0 ?  selections.map((s,i) => shiftIndices.includes(i) ? s.map(e => e + shift) : s) : 
                          selections; 
  }

  isUserGeneratedBrushEvent = (index) => {
    // Ensure the current event was a user brush interaction 
    // We do not perform updates on zooms of via calls to brush.move 
    return !(
      !d3.select(`#${this.state.brushIds[index]}`).node() || 
      !d3event.sourceEvent ||
      (d3event.sourceEvent && d3event.sourceEvent.type === 'brush') || 
      (d3event.sourceEvent && d3event.sourceEvent.type === 'zoom')
    );  
  }

  computeAction(index, currentSelections=null, previousSelections=null) {
      // Compute properties associated with the current action
      let actionProperties = this.computeActionProperties(index, currentSelections, previousSelections); 

      let newSelections; 
      if (actionProperties.overlapped) {
        // True if brush handles overlapped, this action is disallowed so revert to previous valid state 
        newSelections = actionProperties.previousSelections; 
      } else {
        // Get the function required to perform the action 
        let res = functionFromAction(actionProperties.action)(index, actionProperties);  
        // Many actions result in a shift to a subset of all indices. Perform this shift if necessary 
        newSelections = this.perform_SHIFTS(res.currentSelections, res.shiftIndices, res.shift); 
      }

      previousSelections = actionProperties.previousSelections; 

      return { previousSelections, newSelections }; 
  }

  computeAndPerformAction = (index, currentSelections) => {
    // Compute properties associated with the current action
    let { previousSelections, newSelections } = this.computeAction(index, currentSelections); 
    this.updateAll(previousSelections, newSelections); 
  }

  userBrushed = index => (this.isUserGeneratedBrushEvent(index) && 
                          this.computeAndPerformAction(index))

  updateAll = (previousSelections, newSelections) => {
    this._updateBrushSelections(previousSelections, newSelections); 
    this._updateBrushExtras(newSelections);
    this.setState({ brushRanges: newSelections }); 
    this.props.ACTION_CHANGE_timeDomains(newSelections.map(s => s.map(this.props.controlScale.invert).map(t => new Date(t)))); 
  }

  render() {  
    let { width, height, padding } = this.props; 
    width += 2 * padding; 
    height += padding + 2; 
    return <div style={{ height, width, position: 'relative' }} ref={ref => this.ROOT = ref}/>
  }

}

const mapStateToProps = ({ timeDomains, timeExtentDomain, focusColor, contextColor, padding, proposal }) => 
                        ({ timeDomains, timeExtentDomain, focusColor, contextColor, padding, proposal });

const mapDispatchToProps = dispatch => ({

  ACTION_CHANGE_timeDomains: (timeDomains) => 
    dispatch(ACTION_CHANGE_timeDomains(timeDomains)), 

  ACTION_CHANGE_timeExtentDomain: (timeExtentDomain) => 
    dispatch(ACTION_CHANGE_timeExtentDomain(timeExtentDomain))
    
}); 

export default connect(mapStateToProps, mapDispatchToProps)(VistaTimelineControl); 