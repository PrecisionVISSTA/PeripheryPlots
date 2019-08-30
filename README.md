# Periphery Plots

Patterns in temporal data are often across different scales, such as days, weeks, and months, making effective visualization of time-based data challenging. _Periphery Plots_ are a new approach for providing focus and context in time-based charts to enable interpretation of patterns across heterogeneous time scales. Our approach employs a focus zone with a time axis and a second axis, that can either represent quantities or categories, as well as a set of adjacent periphery plots that aggregate data along the time dimension, value dimension, or both. This repository contains a prototype implementation of Periphery Plots as a React component as well as demo of the technique.

![](peripheryplots-preview.png)

## Running the Demo

This implementation requires the latest version of [NodeJS](https://nodejs.org/en/) to install package dependencies and to run the demo.

  1. Clone the repo.
  1. Enter the directory `PeripheryPlots`.
  1. Install package dependencies by running `npm install`.
  1. Build and launch the app via `npm start`.
  1. Open _http://localhost:8080_ in your web browser.

## Preprint

A preprint describing the periphery plot data visualization approach in detail is available on arxiv: https://arxiv.org/abs/1906.07637.

## Component Configuration 

The PeripheryPlots React component takes a single configuration object as input. This object encapsulates the data model and initial state of the componet. 

| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| __`trackwiseObservations`__ | [ [ Object, ... ], ... ] | The set of temporal observations for each track. |
| `trackwiseTimeKeys` | [ String, ... ] | Key used to index temporal attribute from observation objects. |
| `trackwiseValueKeys` | [ String, ... ] | Key used to index value attribute from observation objects.  |
| `trackwiseTypes` | [ String, ... ] | Data type for each track. Can be "continuous",  "discrete", or "other". |
| `trackwiseUnits` | [ String OR Null, ... ] | Unit for each track. |
| `trackwiseNumAxisTicks` | [ Integer OR Null, ... ] | The number of ticks for each track axis. |
| `trackwiseAxisTickFormatters` | [ d3.format OR Null, ... ] | Tick formatter for each track axis. |
| `trackwiseEncodings` | [ [ React.Component, ... ], ... ] | Layered encoding specification for each track. |
| `applyEncodingsUniformly` | Boolean | Determines the number of encoding specifications required for each track. |
| `contextWidthRatio` | Float in range [0.0, 1.0] | Fraction of available space allocated to each context plot. |
| `numContextsPerSide` | Integer | The number of context zones on each side of the focus zone. |
| `timeExtentDomain` | [ Date, Date ] | A temporal range including all data observations across all data sources. |
| `timeDomains` | [ [ Date, Date ], ... ] | Temporal ranges corresponding to initially selected brush regions for the control timeline. |
| `tickInterval` | d3.CountableTimeInterval | The interval for tick placement for the control timeline axis. |
| `dZoom` | Integer+ | Speed of track generated zoom events for control timeline. |
| `containerBackgroundColor` | Valid input to d3.color constructor | Background color for the component container. |
| `focusColor` | Valid input to d3.color constructor | Color of focus brush and focus plot borders. |
| `contextColor` | Valid input to d3.color constructor | Color of context brush and context plot borders.|
| `lockActiveColor` | Valid input to d3.color constructor | Color of control timeline locks when active. |
| `lockInactiveColor` | Valid input to d3.color constructor | Color of control timeline locks when inactive. |
| `containerPadding` | Integer+ | Component padding in pixels that surrounds tracks and control timeline. |
| `controlTimelineHeight` | Integer+ | The height of the control timeline in pixels. |
| `verticalAlignerHeight` | Integer+ | The height of the vertical alignment component in pixels. |
| `axesWidth` | Integer+ | The width of the axis for each track in pixels. |
| `trackHeight` | Integer+ | The width of each track in pixels. |
| `trackSvgOffsetTop` | Integer+ | The offset from top of svg plot containers defining top bound on drawable space. |
| `trackSvgOffsetBottom` | Integer+ | The offset from bottom of svg plot containers defining bottom bound on drawable space. |

Some of the descriptions in the table above are sufficient, but some properties are more complex and must satisfy specific criteria to be considered valid.

We describe these properties in further detail as they relate to the two core subcomponents of the parent PeripheryPlot component: 

* Tracks 
* Control Timeline 

### Tracks 

Tracks are vertically aligned containers that house multiple focus and context plots. The plots are horizontally organized along the temporal axis. The focus plot is always in the middle and there are an equal number of context plots on both sides of the focus plot. 

All properties that begin with the word 'trackwise' are arrays and they must have equal lengths. The *ith* value in each of these arrays corresponds to some property for the *ith* track. 

*`trackwiseObservations`* 
> Each individual set of observations is an array of objects. Each object is a temporal observation with a temporal attribute and one or more value attributes. 

*`trackwiseTypes`*
> We broadly group data into two main classes:
<br>* Continuous (assumed to be numeric)
<br>* Discrete (can be numeric or of some other form)

*`trackwiseUnits`* 
> This information is used to display optional labels.

*`trackwiseEncodings`* 
> Each track has is bound to an array of encodings. The individual elements in an encodings array can be 
> * A React component
>   * A single view is bound to a single plot. 
> * An array where each element is a React component 
>   * Multiple views are bound to a single plot. The views are rendered in the order they are specified, stacking on top of previously rendered views. 
>     * ex: [BarChart, AverageLine] would result in a bar chart with an average line rendered on top. You can see an example of this in the 'precipitation' track in the teaser image located near the top of the README. 
>
> The value of `applyEncodingsUniformly` influences the length of the encoding specification for each track. 
> * when `true`: 
>   * Each encoding array must have a length of 3. First element describes the encodings to be applied to all left contexts. The second element describes the encodings to apply to the focus. The third element describes the encodings to be applied to all right contexts. 
> * when `false`: 
>   * Each encoding array must have a length equal to `(numContextsPerSide * 2) + 1`. Encodings are individually described for each focus and context plot. 

### Control Timeline

The control timeline is a set of multiple linked brushes which allow users to dynamically configure focus and context zones, temporal regions to be viewed and summarized at varying visual resolutions. 

The ith brush (from left to right) in the control timeline determines the temporal period bound to the ith subplot (from left to right) across all tracks in the interface. 

*`timeExtentDomain`*
> A temporal range containing all points. This should almost always be as small as possible, so there is no temporal subrange for which there is no data. 

*`timeDomains`*
> The initial temporal ranges of analysis. There should be `(numContextsPerSide * 2) + 1` timeDomains specified. There should be no temporal distance between two adjacent temporal ranges (i.e. where `timeDomains[i]` ends, `timeDomains[i+1]` should begin). 