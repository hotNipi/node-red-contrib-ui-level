# node-red-contrib-ui-level
Adds a linear Level type widget to the user interface
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

The min amd max values are customizable within the configuration but cannot be set with a msg.

The segments's values and colors are also customizable within the configuration but cannot be set with a msg.    

You can choose anmations to be `soft` or `reactive` or animations can be turned `off` completely.

