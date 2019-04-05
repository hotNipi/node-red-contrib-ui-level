# node-red-contrib-ui-level

[![Platform Node-RED](http://b.repl.ca/v1/Platform-Node--RED-red.png)](https://nodered.org/)
[![NPM version][npm-image]][npm-url]
[![CodeFactor](https://www.codefactor.io/repository/github/hotnipi/node-red-contrib-ui-level/badge)](https://www.codefactor.io/repository/github/hotnipi/node-red-contrib-ui-level)

[npm-image]: http://img.shields.io/npm/v/node-red-contrib-self-adjusting-threshold.svg
[npm-url]: https://npmjs.org/package/node-red-contrib-self-adjusting-threshold

Adds a linear Level type widget to the user interface

![node-red-dashboard-ui-level.JPG](img/node-red-dashboard-ui-level.JPG)

Since version 0.0.14 the size of stripes has 3 options 
![node-red-dashboard-ui-level-shapes.JPG](img/node-red-dashboard-ui-level-shapes.JPG)

# Requirements
Node-Red v19.4 or greater
Node-Red-dashboard v2.13.0 or greater
# Configuration and behavior
Widget has 3 different layouts: Single Horizontal, Pair Horizontal and Single Vertical.

Takes the `msg.payload` and displays the value at the top of the level graphics.
For Pair Horizontal layout the `msg.payload` is expected to be an `array`

The node's `Label` is displayed near the value. Leave the label field empty to show value only.
For Pair Horizontal layout the `Label` is not displayed but both `Channels` can be labelled independently.

The node's `Unit` will be displayed near the current value. Exact position of the unit depends on choosed layout. The unit can be any `string`, for example: `lbs psi F°`

The min and max values are customizable within the configuration but cannot be set with a msg.

The segments's values and colors are also customizable within the configuration but cannot be set with a msg.    

You can choose anmations to be `soft` or `reactive` or animations can be turned `off` completely.

You can choose between 3 different stripe shape. Thin, Normal and Thick

