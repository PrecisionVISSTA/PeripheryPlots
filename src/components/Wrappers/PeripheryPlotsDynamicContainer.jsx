import React, { useEffect } from "react";
import useDimensions from "react-use-dimensions";
import { connect } from "react-redux"; 
import _ from "lodash"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { ACTION_CHANGE_baseWidth } from "../../actions/actions"; 

function PeripheryPlotsDynamicContainer(props) {

    let {   
        containerBackgroundColor,  
        baseWidth, 
        controlScale 
    } = props;

    const [ref, { width }] = useDimensions();

    useEffect(() => {

        // When we are able to measure dimensions of parent container, update global store 
        if (!isNaN(width)) {
            props.ACTION_CHANGE_baseWidth(width); 
            controlScale.range([0, width]); 
        }
        
    }, [width]); 

    let doRender = controlScale.range()[1] > 0 && baseWidth > 0; 

    return (
        <div 
        className="pplot"
        ref={ref} 
        style={{ width: '100%', backgroundColor: containerBackgroundColor }}>
            {doRender ? props.children : null}
        </div>
    ); 

}

const mapStateToProps = ({ 
                            controlScale, 
                            baseWidth, 
                            containerBackgroundColor 
                        }) => 
                        ({ 
                            controlScale, 
                            baseWidth, 
                            containerBackgroundColor 
                        });
    
const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_baseWidth: (baseWidth) => 
    dispatch(ACTION_CHANGE_baseWidth(baseWidth))

}); 

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(PeripheryPlotsDynamicContainer);

