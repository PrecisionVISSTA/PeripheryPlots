# Periphery Plots

Patterns in temporal data are often across different scales, such as days, weeks, and months, making effective visualization of time-based data challenging. _Periphery Plots_ are a new approach for providing focus and context in time-based charts to enable interpretation of patterns across heterogeneous time scales. Our approach employs a focus zone with a time axis and a second axis, that can either represent quantities or categories, as well as a set of adjacent periphery plots that aggregate data along the time dimension, value dimension, or both. This repository contains a prototype implementation of Periphery Plots as a React component as well as demo of the technique.

![](pplots-gif.gif)

## How to Use

1. Live [demo](https://precisionvissta.github.io/PeripheryPlots/) of the app visualizing a sample dataset of weather in seattle over multiple years. 

2. Local install from github:
> Requires the latest version of [NodeJS](https://nodejs.org/en/).
>
> 1. `git clone https://github.com/PrecisionVISSTA/PeripheryPlots.git`
> 2. `cd PeripheryPlots`
> 3. `npm i`
> 4. `npm i react react-dom`
>     * These are [peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/)
> 5. `npm start`
>     * App is now using webpack-dev-server running at _http://localhost:8080_

3. Install into an existing project via npm: 
> Requires the latest version of [NodeJS](https://nodejs.org/en/).
> 
> 1. npm i periphery-plots
> 2. npm i react react-dom 
>     * Only complete step 2 if you do not already have compatible versions of react and react-dom in your project already. See the reasoning [here](hhttps://stackoverflow.com/a/30454133).  

## Preprint

A preprint describing the periphery plot data visualization approach in detail is available on arxiv: https://arxiv.org/abs/1906.07637.

Winner of the **Best Short Paper award at IEEE VIS 2019**. 

## Component Configuration 

The PeripheryPlots React component takes a single configuration object as input. Properties that are __bolded__ are required while all others are optional with sensible defaults. The React based [prop-types](https://www.npmjs.com/package/prop-types) library is used to validate the configuration object.  

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| __`trackwiseObservations`__ | [ [ Object, ... ], ... ] | The set of temporal observations for each track. |
| __`trackwiseTimeKeys`__ | [ String, ... ] | Key used to index temporal attribute from observation objects. |
| __`trackwiseValueKeys`__ | [ String, ... ] | Key used to index value attribute from observation objects.  |
| __`trackwiseTypes`__ | [ String, ... ] | Data type for each track. Can be "continuous",  "discrete", or "other". |
| __`trackwiseUnits`__ | [ String OR Null, ... ] | Unit for each track. |
| __`trackwiseNumAxisTicks`__ | [ Integer+ OR Null, ... ] | The number of ticks for each track axis. |
| __`trackwiseAxisTickFormatters`__ | [ d3.format OR Null, ... ] | Tick formatter for each track axis. |
| __`trackwiseEncodings`__ | [ [ [ React.Component, ... ], ... ] ... ] | Layered encoding specification for each track. |
| __`applyEncodingsUniformly`__ | Boolean | Determines the number of encoding specifications required for each track. |
| `contextWidthRatio` | Float in range [0.0, 1.0] <br> **default:** .2 | Fraction of available space (whithin tracks) allocated to each context plot. |
| `numContextsPerSide` | Integer+ <br> **default:** 1 | The number of context zones on each side of the focus zone. |
| __`timeExtentDomain`__ | [ Date, Date ] | A temporal range including all data observations across all data sources. |
| __`timeDomains`__ | [ [ Date, Date ], ... ] | Temporal ranges corresponding to initially selected brush regions for the control timeline. |
| __`tickInterval`__ | [d3.interval](https://github.com/d3/d3-time) | The interval for tick placement for the control timeline axis. |
| `dZoom` | Integer+ <br> **default:** 5 | Speed of track generated zoom events for control timeline. For wide screens, it may be necessary to increase this value |
| `containerBackgroundColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#ffffff" | Background color for the component container. |
| `focusColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#576369" | Color of focus brush and focus plot borders. |
| `contextColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#9BB1BA" | Color of context brush and context plot borders.|
| `lockActiveColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#00496E" | Color of control timeline locks when active. |
| `lockInactiveColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "Grey" | Color of control timeline locks when inactive. |
| `containerPadding` | Integer+ <br> **default:** 10 | Component padding in pixels that surrounds tracks and control timeline. |
| `controlTimelineHeight` | Integer+ <br> **default:** 50 | The height of the control timeline in pixels. |
| `verticalAlignerHeight` | Integer+ <br> **default:** 30 | The height of the vertical alignment component in pixels. |
| `axesWidth` | Integer+ <br> **default:** 40 | The width of the axis for each track in pixels. |
| `trackHeight` | Integer+ <br> **default:** 50 | The width of each track in pixels. |
| `trackSvgOffsetTop` | Integer+ <br> **default:** 10 | The offset from top of svg plot containers defining top bound on drawable space. |
| `trackSvgOffsetBottom` | Integer+ <br> **default:** 5 | The offset from bottom of svg plot containers defining bottom bound on drawable space. |
| `trackSvgOffsetBottom` | Integer+ <br> **default:** 5 | The offset from bottom of svg plot containers defining bottom bound on drawable space. |
| `formatTrackHeader` | Function(`valueKey`, `unit`) <br> **default:** removes underscores and adds a space between valueKey and unit. | Function to format header string for each track receiving `valueKey` and `unit` as inputs | 
| `msecsPadding` | Integer <br> **default:** 0 | When determining the observations bound to an individual plot, we expand the plot's bound time domain by `msecsPadding` time units on both sides. This property is helpful for encodings like line charts, which may appear discontinuous near the boundaries of the container if only the data points within the interval are visualized. | 
| `lockOutlineColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#000000" | The outline color for timeline control locks. |
| `handleOutlineColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#000000" | The outline color for timeline control handles. |
| `brushOutlineColor` | Valid input to [d3.color](https://github.com/d3/d3-color) <br> **default:** "#000000" | The outline color for timeline control brushes. |

Some of the descriptions in the table above are sufficient, but some properties are more complex and must satisfy specific criteria to be considered valid.

We describe these properties in further detail as they relate to the two core subcomponents of the PeripheryPlots framework: 

* Tracks 
* Control Timeline 

### Tracks 

Tracks are vertically aligned containers that house multiple focus and context plots. The plots are horizontally organized along the temporal axis. The focus plot is always in the middle and there are an equal number of context plots on both sides of the focus plot. 

All properties that begin with the word 'trackwise' are arrays and they must have equal lengths. The *ith* value in each of these arrays corresponds to some property for the *ith* track. 

*`trackwiseObservations`* 
> Each individual set of observations is an array of objects. Each object is a temporal observation with a temporal attribute and one or more value attributes. 

*`trackwiseTypes`*
> We broadly group data into three classes:
<br>* Continuous (assumed to be numeric)
<br>* Discrete (can be numeric or of some other form)
<br>* Other
> These enumerative types are used to determine what type of axis is used for each track. 

*`trackwiseUnits`* 
> If specified, the unit is displayed alongside the track name (or rather, the valueKey used to index observations). 

*`trackwiseEncodings`* 
> For each track we specify a collection of encoding schemas. The dimensions of `trackwiseEncodings` is determined by `applyContextEncodingsUniformly` and `numContextsPerSide`. 
> * if `applyContextEncodingsUniformly` === true: 
>   * `trackwiseEncodings[i]` is of the form:
> <br> [ <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to all left contexts plots \*/ ], <br> &nbsp; &nbsp; [ /\* encoding schema for focus plot \*/ ], <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to all right contexts plots \*/ ] <br> ]
> * if `applyContextEncodingsUniformly` === false:
>   * `trackwiseEncodings[i]` is of the form: <br> [ <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to the `1st` left context plot \*/ ], <br> &nbsp; &nbsp; ... <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to the `numContextsPerSide-th` left context plot \*/ ], <br> &nbsp; &nbsp; [ /\* encoding schema for focus plot \*/ ], <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to the `1st` right context plot \*/ ], <br> &nbsp; &nbsp; ... <br> &nbsp; &nbsp; [ /\* encoding schema to be applied to the `numContextsPerSide-th` right context plot \*/ ] <br> ]
>
> Each encoding schema, represented by `trackwiseEncodings[i][j]` is an array where each element is a React.Component (can be class, function, or any other kind). Each possible value of `trackwiseEncodings[i][j]` is bound to some plot within the interface (as described above). After this binding occurs, the elements of `trackwiseEncodings[i][j]` are rendered into the plot (svg) they are bound to in the order they are specified. 
> * ex: if `trackwiseEncodings[i][j]` = [BarChart, AverageLineGroup], then some plot within some track will be populated with a bar chart visualization with an average line annotation layered over top. You can see an example of this in the 'precipitation' track in the .gif demo at the top of this page. 

### Control Timeline

The control timeline is a set of multiple linked brushes which allow users to dynamically configure focus and context zones, temporal regions to be viewed and summarized at varying visual resolutions. 

The ith brush (from left to right) in the control timeline determines the temporal period bound to the ith subplot (from left to right) across all tracks in the interface. 

*`timeExtentDomain`*
> A temporal range containing all points. This should almost always be as small as possible, so there is no temporal subrange for which there is no data. 

*`timeDomains`*
> The initial temporal ranges of analysis. There should be `(numContextsPerSide * 2) + 1` timeDomains specified. There should be no temporal distance between two adjacent temporal ranges (i.e. where `timeDomains[i]` ends, `timeDomains[i+1]` should begin). 


## Component Styling via CSS

Many of the internal style properties for the component must be specified through the configuration object to ensure only certain style properties of sub-components are changed. 

One area where this is not as much of a problem is styling the text that appears within the component. We have given the text elements within the component special class names to allow for custom styling via CSS. 


| Class | Description |
| ------------- | ------------- |
| `pplot-control-timeline-text` | Control timeline axis labels. |
| `pplot-track-header-text` | Header text for each track. |
| `pplot-track-header-text-container` | Container (div) for header text for each track. This container can control the text-alignment of the track label. |
| `pplot-track-axis-text` | Axis text for each track. |

## Creating Custom Encodings 

You can create your own custom encodings for use with the PeripheryPlots component. Simply write a React component, import it, and include it somewhere in `trackwiseEncodings`. All components in `trackwiseEncodings` will recieve a object called `pplot` which contains a number of properties that can be used to plot data within a corresponding plot. 

| Property | Type | Description |
| ------------- | ------------- | ------------- |
| `observations` | [ Object, ... ] | all observations within `timeDomain`. |
| `timeKey` | String | The temporal index into each individual observation object. | 
| `valueKey` | String | The value index into each individual observation object. |
| `timeDomain` | [Date, Date] | The temporal range for the plot. | 
| `valueDomain` | [ Number, Number ] OR [ Object, ... ] OR Null | Range of possible values across all observations. |
| `xRange` | [ Number, Number ] | Plottable range in x dimension. | 
| `yRange` | [ Number, Number ] | Plottable range in y dimension. |
| `scaleRangeToBox` | Function ([d3.scale](https://github.com/d3/d3-scale), [d3.scale](https://github.com/d3/d3-scale)) | Binds input d3.scale objects to plottable ranges (x and/or y). | 
| `isLeft` | Boolean | Whether or not the encoding is bound to a left context plot. |
| `isFocus` | Boolean | Whether or not the encoding is bound to focus plot. |
| `getAllObservations` | Function() | Escape hatch that allows an encoding bound to any plot to access all observations, not just observations within a set time domain. This should only be used for encodings that require knowledge of other data points to generate their own visual representation (for performance reasons). An example would be a 21 day moving average encoding. |

We describe some of these properties in more detail below. 

*`valueDomain`*
> The value of `valueDomain` depends on the type of the current track (specified in `trackwiseTypes` in the configuration object)
> * if `type` === "continuous": 
>   * `valueDomain` is of the form [ Number, Number ] and represents the minimum and maximum numerical values seen across all observations. 
> * if `type` === "discrete": 
>   * `valueDomain` is of the form [ Object, ... ] and represents all unique values seen across all observations. 
> * if `type` === "other": 
>   * `valueDomain` is Null. 

*`scaleRangeToBox`*
> a function that takes two [d3.scale](https://github.com/d3/d3-scale) objects as input. Sets the range of the first scale to the `xRange` and sets the range of the second scale to `yRange`. Either scale input can be omitted (Null value) if the encoding only requires a single scale to have its range set. 
>
>This can be done manually by the programmer but since the operation is so common we still provide this utility function. 

*`isLeft`* and *`isFocus`* 
> These two Boolean values can be used to determine what kind of plot the encoding is bound to. There are sometimes cases where this information is useful. 
>
> For example, when using either the QuantitativeTracePlot or NominalTracePlot encodings that come packaged with the framework, we often want to flip the encoding about the y axis to preserve symmetry relative to the focus plot. You can see an example of this in the 'temp max' and 'weather' tracks in the gif demo at the top of this page. 

*`yRange`* and *`yRange`*
> It's important to note that both *`yRange`* and *`yRange`* are monotonically increasing ranges (i.e. range[1] > range[0]). As is typical in computer graphics, the y-coordinate system begins from the top of the container and extends towards the bottom of the container as the y-coordinate increases. If you want your custom encoding to use a coordinate system where (0, 0) is in the lower left corner of the plot and (width, height) is in the upper right hand corner of the plot, you can flip the yRange before setting it as the range for your scale. 

## Default Encodings 

The PeripheryPlots framework has a number of encodings implemented by default. 

Any one of these default encodings can be used as a reference template when developing custom encodings. 

**BarGroup** - Quantitative bar chart. 

**EventGroup** - Categorical event timeline where each event is a rectangle. Rectangles are colored by event type. 

**LineGroup** - Quantitative line chart. 

**MovingAverageEnvelopeGroup** - Envelope computed using 10 day moving average. 

**ScatterGroup** - Quantitative scatter chart. 

**AverageLineGroup** - Average line annotation. 

**NominalTraceGroup** - Categorical sideways histogram. 

**QuantitativeTraceGroup** - Quantitative sideways histogram. 

## Custom Encoding Example 

Here is an example of what a line plot encoding might look like using the new React Hooks API.  

```javascript
import React, { useState } from "react";
import { line, curveMonotoneX } from 'd3-shape'; 
import { scaleLinear, scaleTime } from 'd3-scale'; 

export default function LineGroup(props) {

    let [line, setLine] = useState(() => line().curve(curveMonotoneX)); 
    let [timeScale, setTimeScale] = useState(() => scaleTime()); 
    let [valueScale, setValueScale] = useState(() => scaleLinear()); 

    let { pplot } = props; 
    let { timeKey, valueKey, timeDomain, valueDomain, observations, scaleRangeToBox } = pplot; 

    let scales = scaleRangeToBox(timeScale, valueScale); 
    timeScale = scales.xScale; 
    valueScale = scales.yScale; 

    timeScale.domain(timeDomain); 
    valueScale.domain(valueDomain); 

    line.x(d => timeScale(d[timeKey]))
        .y(d => valueScale(d[valueKey]));

    return (
        <g>
            {/* Line */}
            <path d={line(observations)} fill="none" stroke="steelblue"/>
        </g>
    ); 

}
```
