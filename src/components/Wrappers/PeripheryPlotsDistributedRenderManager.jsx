import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux"; 
import _ from "lodash"; 
import PeripheryPlotContext from "../../context/periphery-plot-context"; 
import { ACTION_CHANGE_baseWidth } from "../../actions/actions";  

function PeripheryPlotsDistributedRenderManager(props) {

    /* 
    Monitors changes in fixedWidth when distributed rendering is active 
    */

    let { controlScale, fixedWidth, storeInit } = props;

    useEffect(() => {

        props.ACTION_CHANGE_baseWidth(fixedWidth); 
        controlScale.range([0, fixedWidth]); 
        
    }, [fixedWidth]); 

    // Render when width is nonzero 
    return storeInit ? <div className="pplot">{props.children}</div> : null;  

}

const mapStateToProps = ({ controlScale, storeInit }) => ({ controlScale, storeInit }); 

const mapDispatchToProps = dispatch => ({

    ACTION_CHANGE_baseWidth: (baseWidth) => 
    dispatch(ACTION_CHANGE_baseWidth(baseWidth))

}); 

export default connect(mapStateToProps, mapDispatchToProps, null, { context: PeripheryPlotContext })(PeripheryPlotsDistributedRenderManager);

PeripheryPlotsDistributedRenderManager.propTypes = {

    fixedWidth: function(props, propName) { 
        if (!(!isNaN(props[propName]) && props[propName] >= 0)) {
            return new Error('Running in distributed mode but no fixed width');
        };
    }

}