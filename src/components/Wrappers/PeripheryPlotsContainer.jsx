import React, { useEffect } from "react";
import useDimensions from "react-use-dimensions";
import { connect } from "react-redux"; 
import _ from "lodash"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { ACTION_CHANGE_baseWidth } from "../../actions/actions"; 

function PeripheryPlotsContainer(props) {

    let {   
        config,  
        baseWidth, 
        controlScale 
    } = props;

    const [ref, { width }] = useDimensions();

    useEffect(() => {

        // When we are able to measure dimensions of parent container, update global store 
        if (!isNaN(width)) {
            props.ACTION_CHANGE_baseWidth(width); 
            controlScale.domain(config.timeExtentDomain)
                        .range([0, width]); 
        }
        
    }, [width]); 

    let doRender = controlScale.range()[1] > 0 && baseWidth > 0; 
    let containerBackgroundColor = config.containerBackgroundColor === undefined ? '#fff' : config.containerBackgroundColor; 

    return (
        <div 
        ref={ref} 
        style={{ width: '100%', backgroundColor: containerBackgroundColor }}>
            {doRender ? props.children : null}
        </div>
    ); 

}

const mapStateToProps = ({ controlScale, baseWidth }) => ({ controlScale, baseWidth }); 

const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_baseWidth: (baseWidth) => 
    dispatch(ACTION_CHANGE_baseWidth(baseWidth))

}); 

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(PeripheryPlotsContainer);

