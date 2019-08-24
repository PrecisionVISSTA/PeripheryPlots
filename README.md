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


| Property  | Type | Description |
| ------------- | ------------- | ------------- |
| `trackwiseObservations` | [ [ Object, ... ], ... ] | The set of temporal observations for each track. |
| `trackwiseTimeKeys` | [ String, ... ] | The property used to extract the temporal attribute of an observation. |
| `trackwiseValueKeys` | [ String, ... ] | The property used to extract the value attributre of an observation.  |
| `trackwiseTypes` | [ String, ... ] | The type of data for each track. Can be "continuous" or "discrete". |
| `trackwiseUnits` | [ String OR Null, ... ] | The corresponding unit (if one exists) for each tracks data source. |
| `trackwiseEncodings` | [ React.Component OR [ React.Component, ... ], ... ] | The encoding specification for tracks. |
| `applyEncodingsUniformly` | Boolean | Determines the number of encoding specifications required. |
| `numContextsPerSide` | Integer | The number of context plots on each side of the focus plot. |
| `timeExtentDomain` | [ Date, Date ] | A temporal range including all data observations across all data sources. |
| `timeDomains` | [ [ Date, Date ], ... ] | A set of temporal ranges which correspond to the initially selected brush regions in control component. |
