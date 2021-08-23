/* eslint-disable eqeqeq */
/* eslint-disable no-tabs */
/*
MIT License

Copyright (c) 2019 hotNipi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
module.exports = function (RED) {
	var path = require('path')

	function HTML(config) {
		var configAsJson = JSON.stringify(config)
		var styles = String.raw`
		<style>
			.txt-{{unique}} {	
				font-size:` + config.fontoptions.normal + `em;			
				fill: ${config.fontoptions.color};											
			}
			.txt-{{unique}}.val{
				font-size:` + config.fontoptions.big + `em;
				font-weight: bold;
			}
			.txt-{{unique}}.medium{
				font-size:` + config.fontoptions.normal * 0.9 + `em;						
			}				
			.txt-{{unique}}.small{
				font-size:` + config.fontoptions.small + `em;
			}			
		</style>`
		var ipgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="100%" y2="0%">
			<stop offset="5%" stop-color="` + config.colorNormal + `" />
			<stop offset="50%" stop-color="` + config.colorWarn + `" />		
			<stop offset="95%" stop-color="` + config.colorHi + `" />
		</linearGradient>`
		var verticalipgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="0%" y2="100%">
			<stop offset="5%" stop-color="` + config.colorHi + `" />
			<stop offset="50%" stop-color="` + config.colorWarn + `" />		
			<stop offset="95%" stop-color="` + config.colorNormal + `" />
		</linearGradient>`
		var regulargradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="100%" y2="0%">
			<stop offset="` + config.gradient.warn + '%" stop-color="' + config.colorNormal + `" />
			<stop offset="` + config.gradient.warn + '%" stop-color="' + config.colorWarn + `" />
			<stop offset="` + config.gradient.high + '%" stop-color="' + config.colorWarn + `" />
			<stop offset="` + config.gradient.high + '%" stop-color="' + config.colorHi + `" />
		</linearGradient>`
		var verticalgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="0%" y2="100%">
			<stop offset="` + (100 - config.gradient.high) + '%" stop-color="' + config.colorHi + `" />
			<stop offset="` + (100 - config.gradient.high) + '%" stop-color="' + config.colorWarn + `" />
			<stop offset="` + (100 - config.gradient.warn) + '%" stop-color="' + config.colorWarn + `" />
			<stop offset="` + (100 - config.gradient.warn) + '%" stop-color="' + config.colorNormal + `" />
		</linearGradient>`
		var gradienttype
		if (config.colorschema == 'rainbow') {
			gradienttype = config.layout == 'sv' ? verticalipgradient : ipgradient
		} else {
			if (config.colorschema == 'fixed') {
				gradienttype = config.layout == 'sv' ? verticalgradient : regulargradient
			} else {
				gradienttype = ''
			}
		}
		var filltype = config.colorschema == 'valuedriven' ? String.raw`fill="` + config.colorOff + '"' : String.raw`fill="url(#level_gradi_{{unique}})"`
		var level_single_h = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(` + configAsJson + `)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="` + config.stripe.step + '" height="' + config.stripe.height + `" patternUnits="userSpaceOnUse">
						<rect x="0" width="` + config.stripe.width + '" height="' + config.stripe.height + `" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_{{unique}}">
						<rect x="0" y="` + config.stripe.y0 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_0_{{unique}}" maskUnits="userSpaceOnUse">
						<rect  id="level_mask_0_{{unique}}" x="0" y="` + config.stripe.y0 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="` + config.stripe.y0 + `"
					width="` + config.lastpos + '" height="' + config.stripe.height + `" 
					style="stroke:none"; 
					fill="` + config.colorOff + `" 
					mask="url(#level_bgr_{{unique}})"
				/>
				<g ng-if="${config.peakmode == true}" mask="url(#level_bgr_{{unique}})">
					<rect ng-if="${config.peakmode == true}" id="level_peak_0_{{unique}}" x="0" y=${config.stripe.y0
			} 
						width="` + config.stripe.width + '" height="' + config.stripe.height + `"	
						style="stroke:none; display:inline"
						fill="` + config.colorOff + `"															
					/>
				</g>
				<rect id="level_stripe_0_{{unique}}" x="0" y="` + config.stripe.y0 + `" 
					width="` + config.lastpos + '" height="' + config.stripe.height + `"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"
				/>			
				<text class="txt-{{unique}}" text-anchor="middle" dominant-baseline="baseline" x=` + config.lastpos / 2 + ` y=${config.textpos}><tspan id=level_title_{{unique}}>` + config.label + `</tspan> <tspan ng-if="${config.hideValue ==
			false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="baseline">
						{{msg.payload[0]}}
						</tspan>
						<tspan ng-if="${config.unit !=
			''}" class="txt-{{unique}} small" dominant-baseline="baseline">
						` + config.unit + `
						</tspan>					
				</text>
				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="baseline" x="0" y=${config
				.stripe.y0 - 2}>` + config.min + `</text>
				<text ng-if="${config.tickmode != 'off'}" ng-repeat="x in [].constructor(${config.interticks.length
			}) track by $index" id=level_tick_{{unique}}_{{$index}} 
				class="txt-{{unique}} small" text-anchor="middle" dominant-baseline="baseline"
				 y=${config.stripe.y0 - 2}></text>	
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="end" dominant-baseline="baseline" ng-attr-x=` + config.lastpos + `px y=${config.stripe.y0 - 2}>` + config.max + `</text>			
			</svg>`
		var level_single_v = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(` + configAsJson + `)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="` + config.stripe.height + '" height="' + config.stripe.step + `" patternUnits="userSpaceOnUse">
						<rect x="0" width="` + config.stripe.height + '" height="' + config.stripe.width + `" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_{{unique}}">
						<rect x="0" y="0" width="` + config.stripe.height + '" height="' + config.lastpos + `" fill="url(#level_square_{{unique}})"
							transform="scale(1,-1) translate(0,` + config.lastpos * -1 + `)"
						/>
					</mask>
					<mask id="level_fgr_0_{{unique}}">
						<rect id="level_mask_0_{{unique}}" x="0" y="0" width="` + config.stripe.height + '" height="' + config.lastpos + `" fill="url(#level_square_{{unique}})"
							transform="scale(1,-1) translate(0,` + config.lastpos * -1 + `)"
						/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="0"
					width="` + config.stripe.height + '" height="' + config.lastpos + `" 
					style="stroke:none"; 
					fill="` + config.colorOff + `" 
					mask="url(#level_bgr_{{unique}})"
					
				/>
				<g ng-if="${config.peakmode ==
			true}" mask="url(#level_bgr_{{unique}})" transform="scale(1,-1) translate(0,` + config.lastpos * -1 + `)">
					<rect ng-if="${config.peakmode ==
			true}" id="level_peak_0_{{unique}}" x="0" y="0" 
						width="` + config.stripe.height + '" height="' + config.stripe.width + `"	
						style="stroke:none"
						fill="` + config.colorOff + `"											
					/>
				</g>
				<rect id="level_stripe_0_{{unique}}" x="0" y="0" 
					width="` + config.stripe.height + '" height="' + config.lastpos + `"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"				
				/>				
				<text ng-if="${config.width > 1}" id=level_textgroup_{{unique}}>
					<tspan id=level_title_{{unique}} class="txt-{{unique}}" text-anchor="middle" dominant-baseline="hanging" x=` + config.exactwidth / 2 + ` dx="12" y="0">
						` + config.label + `
					</tspan>
					<tspan ng-if="${config.hideValue ==
			false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="middle" text-anchor="middle" x=` + config.exactwidth / 2 + ` dx="12" y="50%">
							{{msg.payload[0]}}											
					</tspan>
					<tspan ng-if="${config.unit !=
			''}" id=level_value_unit_{{unique}} class="txt-{{unique}} small" dominant-baseline="hanging"	text-anchor="middle" x=` + config.exactwidth / 2 + ' dx="8"  y="50%" dy="' + config.fontoptions.big * 0.6 + `em">					
						` + config.unit + `											
					</tspan>					
				</text>				
				<text ng-if="${config.width == 1}" transform="translate(25, ${config.lastpos -
			15}) rotate(270)" text-orientation="upright" id=level_title_{{unique}} class="txt-{{unique}} medium" text-anchor="start" dominant-baseline="baseline" x="0" y="0">` + config.label + ` <tspan ng-if="${config.hideValue ==
			false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} medium" dominant-baseline="baseline">
						{{msg.payload[0]}}
						</tspan>
						<tspan ng-if="${config.unit !=
			''}" class="txt-{{unique}} medium" dominant-baseline="baseline">
						` + config.unit + `
						</tspan>					
				</text>				
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="hanging" x="15" y="0">` + config.max + `</text>
				<text ng-if="${config.tickmode != 'off'}" ng-repeat="x in [].constructor(${config.interticks.length
			}) track by $index" id=level_tick_{{unique}}_{{$index}} 
				class="txt-{{unique}} small" text-anchor="start" dominant-baseline="middle"
				x="15"></text>		
				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="baseline" x="15" ng-attr-y=` + config.lastpos + 'px>' + config.min + `</text>			
			</svg>`
		var level_pair_h = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(` + configAsJson + `)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="` + config.stripe.step + '" height="' + config.stripe.height + `" patternUnits="userSpaceOnUse">
						<rect x="0" width="` + config.stripe.width + '" height="' + config.stripe.height + `" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_0_{{unique}}">
						<rect x="0" y="` + config.stripe.y0 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_bgr_1_{{unique}}">
						<rect x="0" y="` + config.stripe.y1 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_0_{{unique}}">
						<rect id="level_mask_0_{{unique}}" x="0" y="` + config.stripe.y0 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_1_{{unique}}">
						<rect id="level_mask_1_{{unique}}" x="0" y="` + config.stripe.y1 + '" width="' + config.lastpos + '" height="' + config.stripe.height + `" fill="url(#level_square_{{unique}})"/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="` + config.stripe.y0 + `"
					width="` + config.lastpos + '" height="' + config.stripe.height + `" 
					style="stroke:none"; 
					fill="` + config.colorOff + `" 
					mask="url(#level_bgr_0_{{unique}})"
				/>
				<g ng-if="${config.peakmode == true}" mask="url(#level_bgr_0_{{unique}})">
					<rect ng-if="${config.peakmode ==
			true}" id="level_peak_0_{{unique}}" x="0" y="` + config.stripe.y0 + `" 
						width="` + config.stripe.width + '" height="' + config.stripe.height + `"	
						style="stroke:none"
						fill="` + config.colorOff + `"														
					/>
				</g>
				<rect id="level_stripe_0_{{unique}}" x="0" y="` + config.stripe.y0 + `" 
					width="` + config.lastpos + '" height="' + config.stripe.height + `"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"
				/>				
				<rect id="level_stripeoff_1_{{unique}}" x="0" y="` + config.stripe.y1 + `"
					width="` + config.lastpos + '" height="' + config.stripe.height + `" 
					style="stroke:none"; 
					fill="` + config.colorOff + `" 
					mask="url(#level_bgr_1_{{unique}})"
				/>
				<g ng-if="${config.peakmode == true}" mask="url(#level_bgr_1_{{unique}})">
					<rect ng-if="${config.peakmode ==
			true}" id="level_peak_1_{{unique}}" x="0" y="` + config.stripe.y1 + `" 
						width="` + config.stripe.width + '" height="' + config.stripe.height + `"	
						style="stroke:none"
						fill="` + config.colorOff + `"								
					/>
				</g>
				<rect id="level_stripe_1_{{unique}}" x="0" y="` + config.stripe.y1 + `" 
					width="` + config.lastpos + '" height="' + config.stripe.height + `"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_1_{{unique}})"
				/>								
				<text id=level_channel_0_{{unique}} class="txt-{{unique}}" text-anchor="start" dominant-baseline="hanging" x="0" y="0">` + config.channelA + `
					<tspan ng-if="${config.unit !=
			''}" class="txt-{{unique}} small" dominant-baseline="hanging">
					` + config.unit + `
					</tspan>
				</text>
				<text ng-if="${config.hideValue ==
			false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="hanging"
				text-anchor="end" x="100%" y="0">
						{{msg.payload[0]}}											
				</text>
				
				<text id=level_channel_1_{{unique}} class="txt-{{unique}}" text-anchor="start" dominant-baseline="baseline" x="0" y=` + config.exactheight + '>' + config.channelB + `
					<tspan ng-if="${config.unit !=
			''}" class="txt-{{unique}} small" dominant-baseline="baseline">
					` + config.unit + `
					</tspan>
				</text>
				<text ng-if="${config.hideValue ==
			false}" id=level_value_channel_1_{{unique}} class="txt-{{unique}} val" dominant-baseline="baseline"
				text-anchor="end" x="100%" y=` + config.exactheight + `>
						{{msg.payload[1]}}											
				</text>

				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="middle" x="0" y="50%">` + config.min + `</text>
				<text ng-if="${config.tickmode != 'off'}" ng-repeat="x in [].constructor(${config.interticks.length
			}) track by $index" id=level_tick_{{unique}}_{{$index}} 
				class="txt-{{unique}} small" text-anchor="middle" dominant-baseline="middle"
				y="50%"></text>		
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="end" dominant-baseline="middle" ng-attr-x=` + config.lastpos + 'px y="50%">' + config.max + `</text>
				
			</svg>`
		var layout
		if (config.layout === 'sh') {
			layout = level_single_h
		}
		if (config.layout === 'sv') {
			layout = level_single_v
		}
		if (config.layout === 'ph') {
			layout = level_pair_h
		}
		// var scripts = String.raw`<script src="ui-level/js/gsap.min.js"></script>`
		var html = String.raw`
		${styles}		
		${layout}`
		return html
	}

	function checkConfig(node, conf) {
		if (!conf || !conf.hasOwnProperty('group')) {
			node.error(RED._('ui_level.error.no-group'))
			return false
		}
		return true
	}
	var ui = undefined

	function LevelNode(config) {
		try {
			var node = this
			if (ui === undefined) {
				ui = RED.require('node-red-dashboard')(RED)
			}
			RED.nodes.createNode(this, config)
			var done = null
			var range = null
			var stripecount = null
			var site = null
			var dimensions = null
			var updateControl = null
			var exactPosition = null
			var ensureNumber = null
			var getSiteProperties = null
			var msgFormat = null
			var difference = null
			var interTicks = null
			var evenly = null
			var validateEdges = null
			var initSectorValues = null
			var showStatus = null
			if (checkConfig(node, config)) {
				ensureNumber = function (input, dets) {
					if (input === undefined) {
						return config.min
					}
					if (typeof input !== 'number') {
						var inputString = input.toString()
						input = dets !== 0 ? parseFloat(inputString) : parseInt(inputString)
						if (isNaN(input)) {
							node.warn('msg.payload does not contain numeric value')
							return config.min
						}
					}
					if (dets > 0) {
						input = parseFloat(input.toFixed(dets))
					} else {
						input = parseInt(input)
					}
					if (isNaN(input)) {
						node.warn('msg.payload does not contain numeric value')
						input = config.min
					}
					return input
				}
				getSiteProperties = function () {
					var opts = {}
					opts.sizes = {
						sx: 48,
						sy: 48,
						gx: 4,
						gy: 4,
						cx: 4,
						cy: 4,
						px: 4,
						py: 4
					}
					opts.theme = {
						'widget-textColor': {
							value: '#eeeeee'
						}
					}
					if (typeof ui.getSizes === 'function') {
						if (ui.getSizes()) {
							opts.sizes = ui.getSizes()
						}
						if (ui.getTheme()) {
							opts.theme = ui.getTheme()
						}
					}
					return opts
				}
				range = function (n, p, r) {
					var divisor = p.maxin - p.minin
					n = n > p.maxin ? p.maxin - 0.00001 : n
					n = n < p.minin ? p.minin : n
					n = ((((n - p.minin) % divisor) + divisor) % divisor) + p.minin
					n = ((n - p.minin) / (p.maxin - p.minin)) * (p.maxout - p.minout) + p.minout
					if (!r) {
						return Math.round(n)
					}
					return n
				}
				showStatus = function (v) {
					var status = config.label+': '+v[0]+config.unit

					if (config.layout == 'ph') {
						status = config.channelA+': '+v[0]+' | '+config.channelB+': '+v[1]
					}
					node.status({
						fill: 'green',
						shape: 'dot',
						text: status
					});
				}
				stripecount = function () {
					var w = config.layout.indexOf('v') != -1 ? config.exactheight : config.exactwidth
					var cw = 0
					var c = 0
					while (cw <= w) {
						cw += config.stripe.width
						c += 0.5
					}
					c = Math.round(c)
					while (c * config.stripe.step > w) {
						c--
					}
					if (c & (1 !== 1)) {
						c--
					}
					return c
				}
				dimensions = function (direction) {
					var ret = 0
					switch (direction) {
						case 'w':
							{
								if (config.layout == 'sh') {
									ret = 6
								}
								if (config.layout == 'ph') {
									ret = 6
								}
								if (config.layout == 'sv') {
									ret = 3
								}
								break
							}
						case 'h':
							{
								if (config.layout == 'sh') {
									ret = 1
								}
								if (config.layout == 'ph') {
									ret = 2
								}
								if (config.layout == 'sv') {
									ret = 4
								}
								break
							}
					}
					return ret
				}
				updateControl = function (uicontrol) {
					var applies = false
					var updatesectors = false
					var updatetics = config.tickmode != 'off'
					sectorupdate = []
					tickupdate = []
					var mi = config.min
					var ma = config.max
					var input
					if (uicontrol.label != undefined) {
						config.label = uicontrol.label						
						applies = true						
					}
					if (uicontrol.min != undefined) {
						input = parseFloat(uicontrol.min)
						if (!isNaN(input)) {
							mi = input
							applies = true
						}
					}
					if (uicontrol.max != undefined) {
						input = parseFloat(uicontrol.max)
						if (!isNaN(input)) {
							ma = input
							applies = true
						}
					}
					if (uicontrol.seg1 != undefined) {
						input = parseFloat(uicontrol.seg1)
						if (!isNaN(input)) {
							config.sectorwarn = input
							applies = true
							updatesectors = true
						}
					}
					if (uicontrol.seg2 != undefined) {
						input = parseFloat(uicontrol.seg2)
						if (!isNaN(input)) {
							config.sectorhigh = input
							applies = true
							updatesectors = true
						}
					}
					config.min = mi
					config.max = ma
					config.reverse = mi > ma
					if (applies) {
						if (updatesectors) {
							if (config.colorschema == 'fixed' || config.colorschema == 'valuedriven') {								
								var high = (config.gradient.high = exactPosition(config.sectorhigh, config.min, config.max, config.reverse, config.lastpos).p)
								var warn = (config.gradient.warn = exactPosition(config.sectorwarn, config.min, config.max, config.reverse, config.lastpos).p)
								if (config.layout == 'sv') {
									warn = 100 - warn
									high = 100 - high
									sectorupdate = [high, high, warn, warn]
								} else {
									sectorupdate = [warn, warn, high, high]
								}
							}
							
						}
						if (updatetics) {
							tickupdate = interTicks()
						}
						configsent = false
					}
				}
				difference = function (a, b) {
					return Math.abs(a - b)
				}
				evenly = function (len, fixed) {
					var a = Math.abs(config.max - config.min) / (len + 1)
					var b = config.reverse ? config.max : config.min
					var ret = []
					var check = []
					var legal = true
					var j
					for (j = 0; j < len; j++) {
						b = b + a
						ret.push(parseFloat(b.toFixed(fixed)))
					}
					for (j = 1; j < ret.length; j++) {
						check.push(difference(ret[j], ret[j - 1]))
					}
					for (j = 1; j < check.length; j++) {
						if (difference(check[j], check[j - 1]) > 0.2) {
							legal = false
							break
						}
					}
					if (legal == false) {
						return evenly(len, fixed + 1)
					}
					return ret
				}
				validateEdges = function (arr, vert) {
					if (arr.length == 0) {
						return arr
					}
					var mi = config.min.toString().length * config.stripe.step
					var ma = config.lastpos - config.max.toString().length * config.stripe.step
					if (vert) {
						mi = config.lastpos - 10
						ma = 10
						if (mi < parseFloat(arr[0].pos) || difference(mi, parseFloat(arr[0].pos)) < 10) {
							arr[0].val = ''
						}
						if (ma > parseFloat(arr[arr.length - 1].pos) || difference(ma, parseFloat(arr[arr.length - 1].pos)) < 10) {
							arr[arr.length - 1].val = ''
						}
					} else {
						if (mi > parseFloat(arr[0].pos) || difference(mi, parseFloat(arr[0].pos)) < 10) {
							arr[0].val = ''
						}
						if (ma < parseFloat(arr[arr.length - 1].pos) || difference(ma, parseFloat(arr[arr.length - 1].pos)) < 10) {
							arr[arr.length - 1].val = ''
						}
					}
					return arr
				}
				interTicks = function () {
					var ret = []
					if (config.tickmode == 'off') {
						return ret
					}
					var vert = config.layout.indexOf('v') != -1
					var count = vert ? config.height : config.width - 1
					if (count <= 0) {
						return ret
					}
					var fixed = decimals.fixed > 0 ? 1 : 0
					if (Math.abs(config.max - config.min) > 10) {
						fixed = 0
					}
					var pos
					var calc
					if (config.tickmode == 'segments') {
						var w = parseFloat(config.sectorwarn.toFixed(1))
						var h = parseFloat(config.sectorhigh.toFixed(1))
						if (count == 1) {
							calc = [w]
						} else {
							calc = [w, h]
						}
					} else {
						calc = evenly(count, fixed)
					}
					for (var i = 0; i < calc.length; i++) {
						if (vert) {
							pos = exactPosition(calc[i], config.max, config.min, !config.reverse, config.lastpos + config.stripe.width, true)
						} else {
							pos = exactPosition(calc[i], config.min, config.max, config.reverse, config.lastpos, true)
						}
						ret.push({
							val: calc[i],
							pos: pos.px + 'px'
						})
					}
					ret = validateEdges(ret, vert)
					return ret
				}
				exactPosition = function (target, mi, ma, r, dir, noround) {
					var min = r ? ma : mi
					var max = r ? mi : ma
					var p = r ? {
						minin: min,
						maxin: max + 0.00001,
						minout: 100,
						maxout: 1
					} : {
							minin: min,
							maxin: max + 0.00001,
							minout: 1,
							maxout: 100
						}
					var c
					if (noround == true) {
						c = ((dir * range(target, p, true)) / 100 / config.stripe.width) * config.stripe.width
					} else {
						c = Math.round((dir * range(target, p)) / 100 / config.stripe.width) * config.stripe.width
					}
					var ret = c / dir
					var ep
					if (ret > 1) {
						ret = 1
					}
					if (ret < 0) {
						ret = 0
					}
					if (noround == true) {
						ep = ((ret * dir) / config.stripe.width) * config.stripe.width
					} else {
						ep = Math.round((ret * dir) / config.stripe.width) * config.stripe.width
					}
					return {
						px: ep,
						p: ret * 100
					}
				}
				initSectorValues = function () {
					var max = config.reverse ? config.min : config.max
					var def = config.reverse ? {
						sh: 0.7,
						sw: 0.85
					} : {
							sh: 0.85,
							sw: 0.7
						}
					config.sectorhigh = isNaN(parseFloat(config.segHigh)) ? parseFloat((max * def.sh).toFixed(decimals.fixed)) : parseFloat(config.segHigh)
					config.sectorwarn = isNaN(parseFloat(config.segWarn)) ? parseFloat((max * def.sw).toFixed(decimals.fixed)) : parseFloat(config.segWarn)
				}
				msgFormat = function (m, value) {
					if (value === undefined) {
						value = config.min
					}
					if (Array.isArray(value) === true) {
						if (value.length < 2) {
							value.push(null)
						}
						var v
						m.payload = []
						for (var i = 0; i < 2; i++) {
							v = value[i]
							if (v !== null) {
								v = ensureNumber(v, decimals.fixed)
							}
							m.payload.push(v)
						}
					} else {
						value = ensureNumber(value, decimals.fixed)
						m.payload = [value, null]
					}
					return m
				}
				var group = RED.nodes.getNode(config.group)
				var site = getSiteProperties()
				if (config.width == 0) {
					config.width = parseInt(group.config.width) || dimensions('w')
				}
				if (config.height == 0) {
					config.height = parseInt(group.config.height) || dimensions('h')
				}
				config.width = parseInt(config.width)
				config.height = parseInt(config.height)
				config.exactwidth = parseInt(site.sizes.sx * config.width + site.sizes.cx * (config.width - 1)) - 12
				config.exactheight = parseInt(site.sizes.sy * config.height + site.sizes.cy * (config.height - 1)) - 12
				var strh = Math.floor(config.exactheight / 3)
				if (strh > 12) {
					strh = 12
				}
				if (strh < 4) {
					strh = 4
				}
				var y_0 = config.exactheight - strh + (12 - strh)
				var y_1 = 0
				if (config.layout === 'ph') {
					y_0 = config.exactheight / 3 - 6
					y_1 = -1 + (config.exactheight / 3) * 2
				}
				config.stripe = {
					step: parseInt(config.shape) * 2,
					width: parseInt(config.shape),
					height: strh,
					y0: y_0,
					y1: y_1
				}
				config.reverse = parseFloat(config.min) > parseFloat(config.max)
				config.min = parseFloat(config.min)
				config.max = parseFloat(config.max)
				config.peaktime = config.peaktime == 'infinity' ? -1 : isNaN(parseInt(config.peaktime)) ? 3000 : parseInt(config.peaktime)
				config.count = stripecount()
				config.hideValue = config.hideValue || false
				config.lastpos = config.count * config.stripe.step - config.stripe.width
				config.colorOff = config.colorOff || 'gray'
				config.colorNormal = config.colorNormal || 'green'
				config.colorWarn = config.colorWarn || 'orange'
				config.colorHi = config.colorHi || 'red'
				config.colorschema = config.colorschema || 'fixed'
				var opc = [
					config.colorOff,
					config.colorNormal,
					config.colorWarn,
					config.colorHi
				]
				var decimals = (config.decimals = isNaN(parseFloat(config.decimals)) ? {
					fixed: 1,
					mult: 0
				} : {
						fixed: parseInt(config.decimals),
						mult: Math.pow(10, parseInt(config.decimals))
					})
				initSectorValues()
				config.gradient = {
					warn: exactPosition(config.sectorwarn, config.min, config.max, config.reverse, config.lastpos).p,
					high: exactPosition(config.sectorhigh, config.min, config.max, config.reverse, config.lastpos).p
				}
				config.interticks = interTicks()
				var defaultFontOptions = {
					sh: {
						normal: 1,
						small: 0.65,
						big: 1.03,
						color: 'currentColor'
					},
					sv: {
						normal: 1,
						small: 0.65,
						big: 2.5,
						color: 'currentColor'
					},
					ph: {
						normal: 1,
						small: 0.65,
						big: 1.2,
						color: 'currentColor'
					}
				}
				config.fontoptions = defaultFontOptions[config.layout]
				if (config.textoptions !== 'default') {
					var opt = parseFloat(config.fontLabel)
					if (!isNaN(opt)) {
						config.fontoptions.normal = opt
					}
					opt = parseFloat(config.fontValue)
					if (!isNaN(opt)) {
						config.fontoptions.big = opt
					}
					opt = parseFloat(config.fontSmall)
					if (!isNaN(opt)) {
						config.fontoptions.small = opt
					}
					if (config.colorFromTheme == false) {
						opt = config.colorText
						if (opt != '') {
							config.fontoptions.color = opt
						}
					}
				}
				config.textpos = config.stripe.y0 - 2
				if (config.layout == 'sh' && config.tickmode != 'off') {
					config.textpos -= 16 * config.fontoptions.small
				}
				config.padding = {
					hor: '6px',
					vert: site.sizes.sy / 16 + 'px'
				}
				var tickupdate = []
				var sectorupdate = []
				config.property = config.property || 'payload'
				var configsent = false
				var html = HTML(config)
				done = ui.addWidget({
					node: node,
					order: config.order,
					group: config.group,
					width: config.width,
					height: config.height,
					format: html,
					templateScope: 'local',
					emitOnlyNewValues: false,
					forwardInputMessages: true,
					storeFrontEndInputAsState: true,
					beforeEmit: function (msg) {
						if (msg.control) {
							updateControl(msg.control)
						}
						var fem = {}
						if (msg.peakreset) {
							fem.peakreset = msg.peakreset
						}
						if (!configsent) {
							fem.config = {}
							fem.config.min = config.min
							fem.config.max = config.max
							if (sectorupdate.length > 0) {
								fem.config.sectors = sectorupdate
							}
							if (tickupdate.length > 0) {
								fem.config.ticks = tickupdate
							}
							fem.config.label = config.label
							configsent = true
						}
						var val = RED.util.getMessageProperty(msg, config.property)
						if (val === undefined || val === null) {
							return {
								msg: fem
							}
						}
						fem = msgFormat(fem, val)
						if (config.layout === 'ph') {
							if (fem.payload[1] === null) {
								fem.payload[1] = config.min
							}
						}
						showStatus(fem.payload)
						var pos = [
							exactPosition(fem.payload[0], config.min, config.max, config.reverse, config.lastpos, false),
							null
						]
						if (config.layout === 'ph') {
							pos[1] = exactPosition(fem.payload[1], config.min, config.max, config.reverse, config.lastpos, false)
						}
						fem.position = [pos[0].px, null]
						if (config.layout === 'ph') {
							fem.position[1] = pos[1].px
						}
						if (config.colorschema == 'valuedriven' || config.peakmode == true) {
							var peakpos
							var col
							col = pos[0].p <= config.gradient.warn ? opc[1] : pos[0].p <= config.gradient.high ? opc[2] : opc[3]
							if (config.colorschema == 'valuedriven') {
								col = fem.payload[0] <= config.sectorwarn ? opc[1] : fem.payload[0] <= config.sectorhigh ? opc[2] : opc[3]
								fem.color = [col, null]
							}
							if (config.peakmode == true) {
								peakpos = Math.floor(
									(pos[0].px - config.stripe.width) / config.stripe.step) * config.stripe.step
								fem.peak = [{
									px: peakpos,
									c: col
								}, null]
							}
							if (pos[1] != null) {
								col = pos[1].p <= config.gradient.warn ? opc[1] : pos[1].p <= config.gradient.high ? opc[2] : opc[3]
								if (config.colorschema == 'valuedriven') {
									col = fem.payload[1] <= config.sectorwarn ? opc[1] : fem.payload[1] <= config.sectorhigh ? opc[2] : opc[3]
									fem.color[1] = col
								}
								if (config.peakmode == true) {
									peakpos = Math.floor(
										(pos[1].px - config.stripe.width) / config.stripe.step) * config.stripe.step
									fem.peak[1] = {
										px: peakpos,
										c: col
									}
								}
							}
						}
						return {
							msg: fem
						}
					},
					initController: function ($scope) {
						$scope.unique = $scope.$eval('$id')
						$scope.peaklock = [false, false]
						$scope.hold = [null, null]
						$scope.peaktoreset = [null, null]
						$scope.tickmode = false
						$scope.interticks = null
						$scope.padding = null
						$scope.waitingmessage = null
						$scope.inited = false
						$scope.timeout = null
						$scope.retried = 0
						$scope.init = function (config) {
							if (!document.getElementById('greensock-gsap-3')) {
								loadScript('greensock-gsap-3', 'ui-level/js/gsap.min.js')
							}
							$scope.padding = config.padding
							$scope.lastpeak = [{
								px: 0,
								c: config.colorNormal
							}, {
								px: 0,
								c: config.colorNormal
							}]
							$scope.d = config.decimals
							$scope.prop = config.layout === 'sv' ? {
								dir: 'height',
								pos: 'y'
							} : {
									dir: 'width',
									pos: 'x'
								}
							$scope.len = config.layout === 'ph' ? 2 : 1
							$scope.animate = {
								g: config.animations,
								t: config.textAnimations,
								peak: config.peaktime
							}
							$scope.speed = $scope.animate.g == 'rocket' ? {
								ms: 100,
								s: 0.1
							} : $scope.animate.g == 'reactive' ? {
								ms: 300,
								s: 0.3
							} : {
										ms: 800,
										s: 0.8
									}
							if ($scope.animate.g == 'off') {
								$scope.speed = {
									ms: 20,
									s: 0
								}
							}
							if (config.tickmode != 'off') {
								$scope.interticks = config.interticks
								$scope.tickmode = config.tickmode
								setTicks()
							}
							updateContainerStyle()
							update(config)
						}
						var loadScript = function (id, path) {
							// console.log('loadscript',path)
							var head = document.getElementsByTagName('head')[0]
							var script = document.createElement('script')
							script.type = 'text/javascript'
							script.id = id
							script.src = path
							head.appendChild(script)
							script.onload = function () {
								try {
									gsap.config({
										nullTargetWarn: false
									})
								} catch (error) {
									// console.log('gsap configuration not changed')
								}
							}
						}
						var setTicks = function () {
							if ($scope.tickmode == false) {
								return
							}
							var j
							var tick
							$("[id*='level_tick_" + $scope.unique + "']").text('')
							for (j = 0; j < $scope.interticks.length; j++) {
								tick = document.getElementById('level_tick_' + $scope.unique + '_' + j)
								if (tick) {
									$(tick).text($scope.interticks[j].val)
									$(tick).attr($scope.prop.pos, $scope.interticks[j].pos)
								}
							}
						}
						var peakpixel
						var resetPeak = function () {
							if ($scope.animate.peak != -1) {
								return
							}
							try {
								var j
								for (j = 0; j < $scope.len; j++) {
									peakpixel = document.getElementById('level_peak_' + j + '_' + $scope.unique)
									if (peakpixel) {
										var pixel = $(peakpixel)
										if ($scope.peaktoreset[j] != null) {
											gsap.to(pixel, {
												[$scope.prop.pos]: $scope.peaktoreset[j].px,
												duration: 0
											})
											gsap.to(pixel, {
												fill: $scope.peaktoreset[j].c,
												duration: 0
											})
											$scope.lastpeak[j] = $scope.peaktoreset[j]
										}
									}
								}
							} catch (error) {
								// do nothing
							}
						}
						var animatePeak = function (j, data) {
							if (!data) {
								return
							}
							try {
								peakpixel = document.getElementById('level_peak_' + j + '_' + $scope.unique)
								if (peakpixel) {
									var pixel = $(peakpixel)
									if (data.px > $scope.lastpeak[j].px) {
										if ($scope.hold[j] != null) {
											window.clearInterval($scope.hold[j])
											$scope.hold[j] = null
										}
										gsap.to(pixel, {
											[$scope.prop.pos]: data.px,
											duration: $scope.speed.s
										})
										gsap.to(pixel, {
											fill: data.c,
											duration: $scope.speed.s
										})
										pixel.mask = document.getElementById('url(#level_bgr_' + $scope.unique + '')
										$scope.lastpeak[j] = data
										$scope.peaklock[j] = false
									} else {
										if ($scope.peaktoreset[j] == null || $scope.peaktoreset[j].px > data.px) {
											$scope.peaktoreset[j] = data
										}
										if ($scope.animate.peak == -1) {
											$scope.peaklock[j] = true
											return
										}
										if ($scope.peaklock[j] == false) {
											$scope.peaklock[j] = true
											var cb = function () {
												$scope.peaklock[j] = false
												gsap.to(pixel, {
													[$scope.prop.pos]: $scope.peaktoreset[j].px,
													duration: $scope.speed.s * 2
												})
												gsap.to(pixel, {
													fill: $scope.peaktoreset[j].c,
													duration: $scope.speed.s * 2
												})
												$scope.lastpeak[j] = $scope.peaktoreset[j]
											}
											$scope.hold[j] = window.setInterval(function () {
												window.clearInterval($scope.hold[j])
												$scope.hold[j] = null
												cb()
											}, $scope.animate.peak)
										} else {
											$scope.peaktoreset[j] = data
										}
									}
								}
							} catch (error) {
								// do nothing
							}
						}
						var updateConfig = function (config) {
							var txt = document.getElementById('level_min_' + $scope.unique)
							$(txt).text(config.min)
							txt = document.getElementById('level_max_' + $scope.unique)
							$(txt).text(config.max)
							txt = document.getElementById('level_title_' + $scope.unique)
							$(txt).text(config.label)
							if (config.sectors) {
								var gradient = document.getElementById('level_gradi_' + $scope.unique)
								if (gradient) {
									for (var i = 0; i < config.sectors.length; i++) {
										var stop = gradient.children[i]
										if (stop) {
											$(stop).attr({
												offset: config.sectors[i] + '%'
											})
										}
									}
								}
							}
							if (config.ticks) {
								$scope.interticks = config.ticks
								setTicks()
							}
							
						}
						var updateLevel = function (data) {
							var stripe
							var mask
							var j
							var valfield
							for (j = 0; j < $scope.len; j++) {
								mask = document.getElementById('level_mask_' + j + '_' + $scope.unique)
								if (mask) {
									if (parseInt(mask.style[$scope.prop.dir]) != data.position[j]) {
										if (data.peak) {
											animatePeak(j, data.peak[j])
										}
										var stripeUpdate = function () {
											if (mask.style[$scope.prop.dir]) {
												$(mask).attr(
													[$scope.prop.dir], parseInt(mask.style[$scope.prop.dir]))
											}
										}
										try {
											if ($scope.animate.g !== 'off') {
												gsap.to(mask, {
													[$scope.prop.dir]: data.position[j],
													duration: $scope.speed.s,
													onUpdate: stripeUpdate
												})
											} else {
												mask.style[$scope.prop.dir] = data.position[j] + 'px'
											}
										} catch (error) {
											//console.log('gsap fails to mask ', $scope.unique, mask, $scope.prop.dir, j, data)
											$scope.waitingmessage = data
											update(null)
										}
									}
								} else {
									// console.log('no mask found ',$scope.unique)
								}
								if (data.color) {
									stripe = document.getElementById('level_stripe_' + j + '_' + $scope.unique)
									if (stripe && data.color[j] != null) {
										try {
											if ($scope.animate.g !== 'off') {
												if (stripe.style.fill != data.color[j]) {
													gsap.to(stripe, {
														fill: data.color[j],
														duration: $scope.speed.s
													})
												}
											} else {
												stripe.style.fill = data.color[j]
											}
										} catch (error) {
											stripe.style.fill = data.color[j]
										}
									}
								}
								valfield = document.getElementById('level_value_channel_' + j + '_' + $scope.unique)
								if (valfield) {
									try {
										if ($scope.animate.g !== 'off' && $scope.animate.t == true) {
											var updateHandler = function (t) {
												$(t.field).text(
													(Math.ceil(t.val * $scope.d.mult) / $scope.d.mult).toFixed($scope.d.fixed))
											}
											var nob = {
												val: 0,
												field: valfield,
												from: parseFloat($(valfield).text())
											}
											gsap.fromTo(nob, {
												val: nob.from
											}, {
												val: data.payload[j],
												duration: $scope.speed.s,
												onUpdate: updateHandler,
												onUpdateParams: [nob]
											})
										} else {
											$(valfield).text(data.payload[j].toFixed($scope.d.fixed))
										}
									} catch (error) {
										$(valfield).text(data.payload[j].toFixed($scope.d.fixed))
									}
								}
							}
						}
						var updateContainerStyle = function () {
							var el = document.getElementById('level_svg_' + $scope.unique)
							if (!el) {
								setTimeout(updateContainerStyle, 40)
								return
							}
							el = el.parentElement
							if (el && el.classList.contains('nr-dashboard-template')) {
								if ($(el).css('paddingLeft') == '0px') {
									el.style.paddingLeft = el.style.paddingRight = $scope.padding.hor
									el.style.paddingTop = el.style.paddingBottom = $scope.padding.vert
								}
							}
						}
						var update = function (data) {
							//console.log('update', $scope.unique, 'R:', $scope.retried, $scope.waitingmessage != null, data)
							if (data === null) {
								if ($scope.retried > 5) {
									$scope.waitingmessage = null
									$scope.retried = 0
									return
								}
								$scope.retried++
							}
							$scope.inited = true
							$scope.timeout = null
							if ($scope.waitingmessage != null) {
								var d = {}
								Object.assign(d, $scope.waitingmessage)
								$scope.waitingmessage = null
								// console.log('ui-level ',$scope.unique,': reinit for waiting msg ')
								$scope.timeout = setTimeout(() => {
									update(d)
								}, 50)
								return
							}
							if (data === null) {
								return
							}
							if (data.config) {
								updateConfig(data.config)
							}
							if (data.peakreset) {
								resetPeak()
							}
							if (data.payload) {
								updateLevel(data)
								setTicks()
							}
						}
						$scope.$watch('msg', function (msg) {
							if (!msg) {
								return
							}
							var id = 'level_mask_0_' + $scope.unique
							var stripe = document.getElementById(id)
							if (!$scope.inited || stripe == null) {
								$scope.waitingmessage = msg
							}
							update(msg)
						})
						$scope.$on('$destroy', function () {
							if ($scope.hold) {
								for (var i = 0; i < 2; i++) {
									if ($scope.hold[i] != null) {
										clearInterval($scope.hold[i])
									}
								}
							}
						})
					}
				})
			}
		} catch (e) {
			console.log(e)
		}
		node.on('close', function () {
			if (done) {
				done()
			}
		})
	}
	RED.nodes.registerType('ui_level', LevelNode)
	var uipath = 'ui'
	if (RED.settings.ui) {
		uipath = RED.settings.ui.path
	}
	var fullPath = path.join('/', uipath, '/ui-level/*').replace(/\\/g, '/')
	RED.httpNode.get(fullPath, function (req, res) {
		var options = {
			root: __dirname + '/lib/',
			dotfiles: 'deny'
		}
		res.sendFile(req.params[0], options)
	})
}
