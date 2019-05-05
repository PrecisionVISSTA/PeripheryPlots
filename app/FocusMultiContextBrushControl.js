import React from "react";
import * as d3 from 'd3';
import { event as d3event } from 'd3';
import _ from "lodash"; 
import { connect } from "react-redux"; 
import { assert } from "chai"; 

const LOCK_ACTIVE_COLOR = "grey"; 
const LOCK_INACTIVE_COLOR = "white"; 
const CONTEXT_SELECTION_COLOR = "#bfbfbf"; 
const MIN_CONTEXT_WIDTH = 5; //minimum width of the context brushes in pixels
const MIN_FOCUS_WIDTH = 5; //minimum width of the focus brush in pixels

const tupdif = tup => tup[1] - tup[0]; 

class FocusMultiContextBrushControl extends React.Component {

  state = {
    brushes: [], //collection of d3 brush objects 
    brushSelections: [], // The collection of most recent brush selections
    brushIds: [], // Collection of brush ids for selection 
    brushLocks: [], // Collection of booleans to indicate whether or not a brush is locked 
    numBrushes: 0, // The total number of brushes 
    width: 0, // The width of the brush container 
    height: 0, // The height of the brush container 
    containerScale: d3.scaleLinear() // Maps time points to a corresponding x coordinate within the container 
  }

  constructor(props) {
    super(props); 

    let { width, height, timeDomains, timeExtentDomain } = this.props; 

    this.state.width = width; 
    this.state.height = height; 
    this.state.containerScale.domain(timeExtentDomain).range([0, width]); 

    // 1 focus + equal number of contexts on both sides 
    assert(timeDomains.length % 2 === 1); 

    // Initialize brush selection states 
    this.state.brushSelections = timeDomains.map(domain => domain.map(this.state.containerScale)); 

    // Initialize the brushes 
    this.state.brushes = _.range(0, numBrushes).map(i => d3.brushX()); 

    // Initialize a collection of ids for the brushes 
    this.state.brushIds = _.range(0, numBrushes).map(i => `brush${i}`); 

    // Infer the number of brushes 
    this.state.numBrushes = timeDomains.length; 

    // Set the initial lock state for all brushes to false 
    this.state.brushLocks = _.range(0, numBrushes).map(i => false); 
    
  }

  shouldComponentUpdate() {
    // Let d3 perform updates 
    return false; 
  }

  componentDidMount() {
    // Code to create the d3 element, using the root container 
    let { width, height } = this.props; 
    let root = d3.select(this.ROOT); 
    
    // Create the svg container for the brushes
    let svg = root.append('svg')
                  .attr('width', width) 
                  .attr('height', height);

    // Create brushes 
    for (let i = 0; i < this.state.numBrushes; i++) {

      let brushFn = this.state.brushes[i]; 
      let brushId = this.state.brushIds[i]; 
      let brushSelection = this.state.brushSelections[i]; 
      let isFocus = i === parseInt(this.state.numBrushes / 2); 

      let brushG = svg.append("g")
                      .attr("id", brushId)
                      .attr('class', 'brush')
                      .call(brushFn.on("brush", _.partial(this.brushed, isFocus, i)))
                      .call(brushFn.move, brushSelection); 

      brushG
        .select("rect.overlay")
        .style("pointer-events", "none"); 

      if (!isFocus) {
        brushG
          .select("rect.selection")
          .style("fill", CONTEXT_SELECTION_COLOR); 
      }
    }

  }

  updateBrushStates(brushSelections) {
    this.setState({ brushSelections }); 
  }

  getBrushSelections() {
    return this.state.brushIds.map(id => d3.brushSelection(d3.select(`#${id}`).node())); 
  }

  brushed = (isFocus, index) => {
    /*
    Brush behavior: Grow / Shrink to right / left
    */ 

   if (!d3.select(this.state.brushIds[index]).node() || 
      (d3event.sourceEvent && d3event.sourceEvent.type === "brush")) return; 

    // Get the current and previous selections for all brushes 
    let brushSelections = this.getBrushSelections(); 
    let previousBrushSelections = this.state.brushSelections; 

    // Get the current and previous selections for the evnet target brush 
    let preS = previousBrushSelections[index]; 
    let curS = brushSelections[index]; 

    let brushActions = {
      SHRINK_LEFT: 0, 
      SHRINK_RIGHT: 1, 
      GROW_LEFT: 2, 
      GROW_RIGHT: 3
    }; 

    // Determine which of the possible brush actions occurred based on current and previous state 
    let currentAction = (preS[0] < curS[0]) ? brushActions.SHRINK_LEFT : 
                        (preS[1] > curS[1]) ? brushActions.SHRINK_RIGHT : 
                        (preS[0] > curS[0]) ? brushActions.GROW_LEFT : 
                        (preS[1] < curS[1]) ? brushActions.GROW_RIGHT : null; 

    assert(currentAction !== null); 

    switch(currentAction) {
      case brushActions.SHRINK_LEFT: 
      case brushActions.SHRINK_RIGHT: 
      case brushActions.GROW_LEFT: 
      case brushActions.GROW_RIGHT:
      default: 
        // This will never happen as we already ensure (assert statement) the currentAction is a valid brushAction 
        break; 
    }



  }

  render() {  
    return <div id="ROOT" ref={ref => this.ROOT = ref} />
  }
}

const mapStateToProps = ({ timeDomains, timeExtentDomain }) => 
                        ({ timeDomains, timeExtentDomain }); 

export default connect(mapStateToProps, null)(FocusMultiContextBrushControl); 