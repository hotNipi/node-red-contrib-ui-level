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
	function HTML(config) {
		var configAsJson = JSON.stringify(config);
		var styles = String.raw`
		<style>
			.txt-{{unique}} {	
				font-size:`+config.fontoptions.normal+`em;			
				fill: ${config.fontoptions.color};											
			}
			.txt-{{unique}}.val{
				font-size:`+config.fontoptions.big+`em;
				font-weight: bold;
			}
			.txt-{{unique}}.medium{
				font-size:`+config.fontoptions.normal*0.9+`em;						
			}				
			.txt-{{unique}}.small{
				font-size:`+config.fontoptions.small+`em;
			}			
		</style>`
		
		var ipgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="100%" y2="0%">
			<stop offset="5%" stop-color="`+config.colorNormal+`" />
			<stop offset="50%" stop-color="`+config.colorWarn+`" />		
			<stop offset="95%" stop-color="`+config.colorHi+`" />
		</linearGradient>`
		var verticalipgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="0%" y2="100%">
			<stop offset="5%" stop-color="`+config.colorHi+`" />
			<stop offset="50%" stop-color="`+config.colorWarn+`" />		
			<stop offset="95%" stop-color="`+config.colorNormal+`" />
		</linearGradient>`
		
		var regulargradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="100%" y2="0%">
			<stop offset="`+config.gradient.warn+`%" stop-color="`+config.colorNormal+`" />
			<stop offset="`+config.gradient.warn+`%" stop-color="`+config.colorWarn+`" />
			<stop offset="`+config.gradient.high+`%" stop-color="`+config.colorWarn+`" />
			<stop offset="`+config.gradient.high+`%" stop-color="`+config.colorHi+`" />
		</linearGradient>`
		var verticalgradient = String.raw`
		<linearGradient id="level_gradi_{{unique}}" x2="0%" y2="100%">
			<stop offset="`+(100-config.gradient.high)+`%" stop-color="`+config.colorHi+`" />
			<stop offset="`+(100-config.gradient.high)+`%" stop-color="`+config.colorWarn+`" />
			<stop offset="`+(100-config.gradient.warn)+`%" stop-color="`+config.colorWarn+`" />
			<stop offset="`+(100-config.gradient.warn)+`%" stop-color="`+config.colorNormal+`" />
		</linearGradient>`
		
		var gradienttype
		if(config.colorschema == 'rainbow'){
			gradienttype = config.layout == 'sv' ? verticalipgradient : ipgradient
		}
		else{
			if(config.colorschema == 'fixed'){
				gradienttype =  config.layout == 'sv' ? verticalgradient : regulargradient
			}
			else{
				gradienttype = ''
			}
		}		
		var filltype = config.colorschema == "valuedriven" ? String.raw`fill="`+config.colorOff+`"` : String.raw`fill="url(#level_gradi_{{unique}})"`
		
		var level_single_h = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(`+configAsJson+`)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="`+config.stripe.step+`" height="`+config.stripe.height+`" patternUnits="userSpaceOnUse">
						<rect x="0" width="`+config.stripe.width+`" height="`+config.stripe.height+`" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_{{unique}}">
						<rect x="0" y="`+config.stripe.y0+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_0_{{unique}}">
						<rect id="level_mask_0_{{unique}}" x="0" y="`+config.stripe.y0+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="`+config.stripe.y0+`"
					width="`+config.exactwidth+`" height="`+config.stripe.height+`" 
					style="stroke:none"; 
					fill="`+config.colorOff+`" 
					mask="url(#level_bgr_{{unique}})"
				/>
				<rect id="level_stripe_0_{{unique}}" x="0" y="`+config.stripe.y0+`" 
					width="`+config.exactwidth+`" height="`+config.stripe.height+`"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"
				/>
				<rect ng-if="${config.peakmode == true}" id="level_peak_0_{{unique}}" x="0" y="`+config.stripe.y0+`" 
					width="`+config.stripe.width+`" height="`+config.stripe.height+`"	
					style="stroke:none"
					fill="`+config.colorOff+`"
					display="none"					
				/>
				<text id=level_title_{{unique}} class="txt-{{unique}}" text-anchor="middle" dominant-baseline="baseline" x=`+config.exactwidth/2+` y=${config.exactheight-20}>`+config.label+
				` <tspan ng-if="${config.hideValue == false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="baseline">
						{{msg.payload[0]}}
						</tspan>
						<tspan ng-if="${config.unit != ''}" class="txt-{{unique}} small" dominant-baseline="baseline">
						`+config.unit+`
						</tspan>					
				</text>
				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="baseline" x="0" y=${config.exactheight-16}>`+config.min+`</text>	
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="end" dominant-baseline="baseline" ng-attr-x=`+config.lastpos+`px y=${config.exactheight-16}>`+config.max+`</text>			
			</svg>`
		
		var level_single_v = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(`+configAsJson+`)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="`+config.stripe.height+`" height="`+config.stripe.step+`" patternUnits="userSpaceOnUse">
						<rect x="0" width="`+config.stripe.height+`" height="`+config.stripe.width+`" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_{{unique}}">
						<rect x="0" y="0" width="`+config.stripe.height+`" height="`+config.exactheight+`" fill="url(#level_square_{{unique}})"
							transform="scale(1,-1) translate(0,`+(config.exactheight*-1)+`)"
						/>
					</mask>
					<mask id="level_fgr_0_{{unique}}">
						<rect id="level_mask_0_{{unique}}" x="0" y="0" width="`+config.stripe.height+`" height="`+config.exactheight+`" fill="url(#level_square_{{unique}})"
							transform="scale(1,-1) translate(0,`+(config.exactheight*-1)+`)"
						/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="0"
					width="`+config.stripe.height+`" height="`+config.exactheight+`" 
					style="stroke:none"; 
					fill="`+config.colorOff+`" 
					mask="url(#level_bgr_{{unique}})"
					
				/>
				<rect id="level_stripe_0_{{unique}}" x="0" y="0" 
					width="`+config.stripe.height+`" height="`+config.exactheight+`"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"				
				/>
				<rect ng-if="${config.peakmode == true}" id="level_peak_0_{{unique}}" x="0" y="0" 
					width="`+config.stripe.height+`" height="`+config.stripe.width+`"	
					style="stroke:none"
					fill="`+config.colorOff+`"
					display="none"
					transform="scale(1,-1) translate(0,`+(config.exactheight*-1)+`)"					
				/>
				<text ng-if="${config.width > 1}" id=level_textgroup_{{unique}}>
					<tspan id=level_title_{{unique}} class="txt-{{unique}}" text-anchor="middle" dominant-baseline="hanging" x=`+config.exactwidth/2+` dx="12" y="0">
						`+config.label+`
					</tspan>
					<tspan ng-if="${config.hideValue == false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="middle" text-anchor="middle" x=`+config.exactwidth/2+` dx="12" y="50%">
							{{msg.payload[0]}}											
					</tspan>
					<tspan ng-if="${config.unit != ''}" id=level_value_unit_{{unique}} class="txt-{{unique}} small" dominant-baseline="hanging"	text-anchor="middle" x=`+config.exactwidth/2+` dx="8"  y="50%" dy="`+config.fontoptions.big*.6+`em">					
						`+config.unit+`											
					</tspan>					
				</text>				
				<text ng-if="${config.width == 1}" transform="translate(25, ${config.exactheight-15}) rotate(270)" text-orientation="upright" id=level_title_{{unique}} class="txt-{{unique}} medium" text-anchor="start" dominant-baseline="baseline" x="0" y="0">`+config.label+
				` <tspan ng-if="${config.hideValue == false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} medium" dominant-baseline="baseline">
						{{msg.payload[0]}}
						</tspan>
						<tspan ng-if="${config.unit != ''}" class="txt-{{unique}} medium" dominant-baseline="baseline">
						`+config.unit+`
						</tspan>					
				</text>				
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="hanging" x="15" y="0">`+config.max+`</text>	
				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="baseline" x="15" ng-attr-y=`+config.exactheight+`px>`+config.min+`</text>			
			</svg>`
		
		var level_pair_h = String.raw`		
			<svg preserveAspectRatio="xMidYMid meet" id="level_svg_{{unique}}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" ng-init='init(`+configAsJson+`)'>
				<defs>
					${gradienttype}
					<pattern id="level_square_{{unique}}" x="0" y="0" width="`+config.stripe.step+`" height="`+config.stripe.height+`" patternUnits="userSpaceOnUse">
						<rect x="0" width="`+config.stripe.width+`" height="`+config.stripe.height+`" y="0" fill="white" />				
					</pattern>
					<mask id="level_bgr_0_{{unique}}">
						<rect x="0" y="`+config.stripe.y0+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_bgr_1_{{unique}}">
						<rect x="0" y="`+config.stripe.y1+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_0_{{unique}}">
						<rect id="level_mask_0_{{unique}}" x="0" y="`+config.stripe.y0+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>
					<mask id="level_fgr_1_{{unique}}">
						<rect id="level_mask_1_{{unique}}" x="0" y="`+config.stripe.y1+`" width="`+config.exactwidth+`" height="`+config.stripe.height+`" fill="url(#level_square_{{unique}})"/>
					</mask>								
				</defs>
				<rect id="level_stripeoff_0_{{unique}}" x="0" y="`+config.stripe.y0+`"
					width="`+config.exactwidth+`" height="`+config.stripe.height+`" 
					style="stroke:none"; 
					fill="`+config.colorOff+`" 
					mask="url(#level_bgr_0_{{unique}})"
				/>
				<rect id="level_stripe_0_{{unique}}" x="0" y="`+config.stripe.y0+`" 
					width="`+config.exactwidth+`" height="`+config.stripe.height+`"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_0_{{unique}})"
				/>
				
				<rect id="level_stripeoff_1_{{unique}}" x="0" y="`+config.stripe.y1+`"
					width="`+config.exactwidth+`" height="`+config.stripe.height+`" 
					style="stroke:none"; 
					fill="`+config.colorOff+`" 
					mask="url(#level_bgr_1_{{unique}})"
				/>
				<rect id="level_stripe_1_{{unique}}" x="0" y="`+config.stripe.y1+`" 
					width="`+config.exactwidth+`" height="`+config.stripe.height+`"	
					style="stroke:none";
					${filltype}
					mask="url(#level_fgr_1_{{unique}})"
				/>
				<rect ng-if="${config.peakmode == true}" id="level_peak_0_{{unique}}" x="0" y="`+config.stripe.y0+`" 
					width="`+config.stripe.width+`" height="`+config.stripe.height+`"	
					style="stroke:none"
					fill="`+config.colorOff+`"
					display="none"
										
				/>
				<rect ng-if="${config.peakmode == true}" id="level_peak_1_{{unique}}" x="0" y="`+config.stripe.y1+`" 
					width="`+config.stripe.width+`" height="`+config.stripe.height+`"	
					style="stroke:none"
					fill="`+config.colorOff+`"
					display="none"				
				/>				
				<text id=level_channel_0_{{unique}} class="txt-{{unique}}" text-anchor="start" dominant-baseline="hanging" x="0" y="0">`+config.channelA+`
					<tspan ng-if="${config.unit != ''}" class="txt-{{unique}} small" dominant-baseline="hanging">
					`+config.unit+`
					</tspan>
				</text>
				<text ng-if="${config.hideValue == false}" id=level_value_channel_0_{{unique}} class="txt-{{unique}} val" dominant-baseline="hanging"
				text-anchor="end" x="100%" y="0">
						{{msg.payload[0]}}											
				</text>
				
				<text id=level_channel_1_{{unique}} class="txt-{{unique}}" text-anchor="start" dominant-baseline="baseline" x="0" y=`+config.exactheight+`>`+config.channelB+`
					<tspan ng-if="${config.unit != ''}" class="txt-{{unique}} small" dominant-baseline="baseline">
					`+config.unit+`
					</tspan>
				</text>
				<text ng-if="${config.hideValue == false}" id=level_value_channel_1_{{unique}} class="txt-{{unique}} val" dominant-baseline="baseline"
				text-anchor="end" x="100%" y=`+config.exactheight+`>
						{{msg.payload[1]}}											
				</text>

				<text id=level_min_{{unique}} class="txt-{{unique}} small" text-anchor="start" dominant-baseline="middle" x="0" y="50%">`+config.min+`</text>	
				<text id=level_max_{{unique}} class="txt-{{unique}} small" text-anchor="end" dominant-baseline="middle" ng-attr-x=`+config.lastpos+`px y="50%">`+config.max+`</text>
				
			</svg>`
		var layout;
		if(config.layout === "sh"){
			layout = level_single_h;
		}
		if(config.layout === "sv"){
			layout = level_single_v;
		}
		if(config.layout === "ph"){
			layout = level_pair_h;
		}
		
		var html = String.raw`
		${styles}
		${layout}`
		return html;
	}


	function checkConfig(node, conf) {
		if (!conf || !conf.hasOwnProperty("group")) {
			node.error(RED._("ui_level.error.no-group"));
			return false;
		}
		return true;
	}

	var ui = undefined;

	function LevelNode(config) {
		try {
			var node = this;
			
			if (ui === undefined) {
				ui = RED.require("node-red-dashboard")(RED);
			}
			
			RED.nodes.createNode(this, config);
			var done = null;
			var range = null;
			var stripecount = null;
			var site = null;
			var dimensions = null;
			var updateControl = null;
			var exactPosition = null;
			var ensureNumber = null;
			var getSiteProperties = null;
			var msgFormat = null;

			if (checkConfig(node, config)) {	
				
				ensureNumber = function (input,dets) {
					if (input === undefined) {
						return min;
					}
					if (typeof input !== "number") {
						var inputString = input.toString();
						input = dets !== 0 ? parseFloat(inputString) : parseInt(inputString);
						if(isNaN(input)){
							node.warn("msg.payload does not contain numeric value")
							return min
						}						
					}
					if (dets > 0) { 
						input = parseFloat(input.toFixed(dets))
					}
					else{
						input = parseInt(input)
					}
					if(isNaN(input)){
						node.warn("msg.payload does not contain numeric value")
						input = min;
					}					
					return input;
				}
				getSiteProperties = function(){
					var opts = null;					
					if (typeof ui.getSizes === "function") {			
						opts = {};
						opts.sizes = ui.getSizes();
						opts.theme = ui.getTheme();
					}	
					if(opts === null){
						// fallback to hardcoded defaults					
						node.log("Couldn't reach to the site parameters. Using hardcoded default parameters!")
						opts = {}
						opts.sizes = { sx: 48, sy: 48, gx: 4, gy: 4, cx: 4, cy: 4, px: 4, py: 4 }
						opts.theme = {"widget-textColor":{value:"#eeeeee"}}
					}									
					return opts
				}
				range = function (n,p,r){					
					var divisor = p.maxin - p.minin;							
					n = n > p.maxin ? p.maxin - 0.00001 : n;
					n = n < p.minin ? p.minin : n;
					n = ((n - p.minin) % divisor + divisor) % divisor + p.minin;
					n = ((n - p.minin) / (p.maxin - p.minin) * (p.maxout - p.minout)) + p.minout;										
					if(!r){
						return Math.round(n);
					}
					return n
					
				}				
				stripecount = function(){									
					var w = (config.layout.indexOf("v") != -1) ? config.exactheight : config.exactwidth;						
					var cw = 0
					var c = 0
					while(cw <= w){
						cw += config.stripe.width
						c +=0.5 
					}
					c = Math.round(c)
					while(c*config.stripe.step > w){
						c--;
					}
					if(c & 1 !== 1){
						c --;
					}
					return c;				
				}
				dimensions = function(direction){
					var ret = 0;
					switch(direction){
						case "w":{
							if(config.layout == "sh"){
								ret = 6;
							}
							if(config.layout == "ph"){
								ret = 6;
							}
							if(config.layout == "sv"){
								ret = 3;
							}
							break;
						}
						case "h":{
							if(config.layout == "sh"){
								ret = 1;
							}							
							if(config.layout == "ph"){
								ret = 2;
							}
							if(config.layout == "sv"){
								ret = 4;
							}
							break;
						}
					}
					return ret;
				}
				
				updateControl = function(uicontrol){
					reverse = false;
					var applies = false;
					var updatesectors = false
					sectorupdate = []
					var mi = min
					var ma = max
					if(uicontrol.min != undefined && !isNaN(parseFloat(uicontrol.min))){
						mi =  parseFloat(uicontrol.min);
						applies = true;
					}
					if(uicontrol.max != undefined && !isNaN(parseFloat(uicontrol.max))){
						ma =  parseFloat(uicontrol.max);
						applies = true;
					}
					if(uicontrol.seg1 != undefined && !isNaN(parseFloat(uicontrol.seg1))){
						sectorwarn =  parseFloat(uicontrol.seg1);
						applies = true;
						updatesectors = true;
					}
					if(uicontrol.seg2 != undefined && !isNaN(parseFloat(uicontrol.seg2))){
						sectorhigh =  parseFloat(uicontrol.seg2);
						applies = true;
						updatesectors = true;
					}					
					min = mi > ma ? ma : mi;
					max = ma < mi ? mi : ma;				
					reverse = mi > ma;
									
					if(applies){
						 if(updatesectors && config.colorschema == 'fixed'){
							var high = config.gradient.high = exactPosition(sectorhigh,min,max,reverse,directiontarget).p
							var warn = config.gradient.warn = exactPosition(sectorwarn,min,max,reverse,directiontarget).p							
							if(config.layout == 'sv'){
								warn = 100-warn;
								high = 100-high;
								sectorupdate = [high,high,warn,warn]
							}
							else{
								sectorupdate = [warn,warn,high,high]
							}
						} 
						configsent = false;
					} 
				}
				

				
			 	exactPosition = function(target,mi,ma,r,dir) {
					var p = r ? {minin:mi, maxin:ma+0.00001, minout:100, maxout:1} : {minin:mi, maxin:ma+0.00001, minout:1, maxout:100}									
					//var c = Math.round(dir * range(target,p) / 100 / config.stripe.width) * config.stripe.width;	
					c = Math.floor(dir * range(target,p) / 100 / config.stripe.step) * config.stripe.step;				
					var ret = c / dir
					if(ret > 1){
						ret = 1
					}
					if(ret < 0){
						ret = 0
					}
					return {px:Math.floor(ret * dir),p:ret * 100}
				}
				
				msgFormat = function(value) {					
					var msg = {}
					if(value === undefined){
						value = min;
					}																
					if(Array.isArray(value) === true){
						if(value.length < 2){
							value.push(null)
						}
						var v
						msg.payload = []
						for(var i = 0;i < 2; i++){
							v = value[i];
							if(v !== null){
								v = ensureNumber(v, decimals.fixed)
							}
							msg.payload.push(v)
						}											
					}
					else{
						value = ensureNumber(value, decimals.fixed)
						msg.payload = [value,null];
					}						
					return msg;			
				}
					 
				
				var group = RED.nodes.getNode(config.group);
				var site = getSiteProperties();
				
				if(config.width == 0){ config.width = parseInt(group.config.width) || dimensions("w")}
				if(config.height == 0) {config.height = parseInt(group.config.height) || dimensions("h")}
				config.width = parseInt(config.width)
				config.height = parseInt(config.height)
				config.exactwidth = parseInt(site.sizes.sx * config.width + site.sizes.cx * (config.width-1)) - 12;		
				config.exactheight = parseInt(site.sizes.sy * config.height + site.sizes.cy * (config.height-1)) - 12;
				
				var y_0 = config.exactheight - Math.floor((site.sizes.sy/2)) + 12;
				var y_1 = 0
				if(config.layout === "ph"){
					y_0 = config.exactheight/3 - 6 //config.exactheight - Math.floor((site.sizes.sy/1.2)) + 12;
					y_1 = config.exactheight/3*2  // - Math.floor((site.sizes.sy/1.8)) + 12;
				}
				
				config.stripe = {step: parseInt(config.shape) * 2, width: parseInt(config.shape), height:Math.floor((site.sizes.sy/2)-12), y0:y_0,y1:y_1};
				config.min = parseFloat(config.min);
				config.max = parseFloat(config.max);
				config.peaktime = parseInt(config.peaktime);				
				config.count = stripecount();
				config.hideValue = config.hideValue || false
				config.lastpos = config.count * config.stripe.step - config.stripe.width;			
				config.colorOff = config.colorOff || "gray";
				config.colorNormal = config.colorNormal || "green";
				config.colorWarn = config.colorWarn || "orange";
				config.colorHi = config.colorHi || "red";				
				config.colorschema = config.colorschema || 'fixed';
				var opc = [config.colorOff,config.colorNormal,config.colorWarn,config.colorHi];
								
				var min = config.min > config.max ? config.max : config.min;
				var max = config.max < config.min ? config.min : config.max;				
				var reverse = config.min > config.max;
				var decimals = config.decimals = isNaN(parseFloat(config.decimals)) ? {fixed:1,mult:0} : {fixed:parseInt(config.decimals),mult:Math.pow(10,parseInt(config.decimals))};
				var directiontarget = config.layout === 'sv' ? config.exactheight : config.exactwidth
				var sectorhigh = isNaN(parseFloat(config.segHigh)) ? parseFloat((max *.9).toFixed(decimals.fixed)) : parseFloat(config.segHigh);
				var sectorwarn = isNaN(parseFloat(config.segWarn)) ? parseFloat((max *.7).toFixed(decimals.fixed)) : parseFloat(config.segWarn);				
				var sectorupdate = []
				config.gradient = {warn:exactPosition(sectorwarn,min,max,reverse,directiontarget).p,high:exactPosition(sectorhigh,min,max,reverse,directiontarget).p};
				
				var defaultFontOptions = {"sh":{normal:1,small:0.65,big:1.2,color:'currentColor'},
											"sv":{normal:1,small:0.65,big:2.5,color:'currentColor'},
											"ph":{normal:1,small:0.65,big:1.2,color:'currentColor'}};			
				
				config.fontoptions = defaultFontOptions[config.layout]		
				
				if(config.textoptions !== 'default'){
					var opt = parseFloat(config.fontLabel);
					if(!isNaN(opt)){
						config.fontoptions.normal = opt;
					}
					opt = parseFloat(config.fontValue);
					if(!isNaN(opt)){
						config.fontoptions.big = opt;
					}
					opt = parseFloat(config.fontSmall);
					if(!isNaN(opt)){
						config.fontoptions.small = opt;
					}
					if(config.colorFromTheme == false){
						opt = config.colorText;
						if(opt != ""){
							config.fontoptions.color = opt;
						}
					}					
				}

				var configsent = false;				
				var html = HTML(config);
				
				done = ui.addWidget({
					node: node,
					order: config.order, 
					group: config.group,
					width: config.width,
					height: config.height,
					format: html,
					templateScope: "local",
					emitOnlyNewValues: false,
					forwardInputMessages: false,
					storeFrontEndInputAsState: true,
					
					beforeEmit: function (msg) {											
						if(msg.ui_control){
							updateControl(msg.ui_control);
						}
						if(msg.payload === undefined){
							return
						}						
						msg = msgFormat(msg.payload)						
						
						if(config.layout === "ph"){
							if(msg.payload[1] === null){
								msg.payload[1] = min
							}
						}
						
						var pos = [exactPosition(msg.payload[0],min,max,reverse,directiontarget),null];
						if(config.layout === "ph"){
							pos[1] = exactPosition(msg.payload[1],min,max,reverse,directiontarget)
						}
						
						msg.position = [pos[0].px,null];
						if(config.layout === "ph"){							
							msg.position[1] = pos[1].px													
						}
						
						if(config.colorschema == 'valuedriven' || config.peakmode == true){
							var peakpos
							var col
							col =  pos[0].p < config.gradient.warn ? opc[1] : (pos[0].p < config.gradient.high ? opc[2] : opc[3]);
							if(config.colorschema == 'valuedriven'){
								msg.color = [col,null]
							}
							if(config.peakmode == true){
								peakpos = exactPosition(msg.payload[0],min,max,reverse,config.lastpos).px								
								msg.peak = [{px:peakpos,c:col},null]
							}
							
							
							if(pos[1] != null){
								col = pos[1].p < config.gradient.warn ? opc[1] : (pos[1].p < config.gradient.high ? opc[2] : opc[3]);
								if(config.colorschema == 'valuedriven'){
									msg.color[1] = col
								}
								if(config.peakmode == true){
									peakpos = peakpos = exactPosition(msg.payload[1],min,max,reverse,config.lastpos).px																		
									msg.peak[1] = {px:peakpos,c:col}
								}
							}														
						}
						
						if(!configsent){
							msg.config = {}
							msg.config.min = reverse ? max : min;
							msg.config.max = reverse ? min : max;
							if(sectorupdate.length > 0){
								msg.config.sectors = sectorupdate
							}
							configsent = true;
						}																	
						return { msg: msg };
					},
					
					initController: function ($scope) {																		
						$scope.unique = $scope.$eval('$id')					
						$scope.lastvalue = [0,0]
						$scope.init = function(config){							
							$scope.d = config.decimals;
							$scope.prop = config.layout === "sv" ? {dir:'height',pos:'y'} : {dir:'width',pos:'x'}
							$scope.len	 = 	config.layout === "ph"	? 2 : 1		
							$scope.animate = {g:config.animations,t:config.textAnimations,peak:config.peaktime}
							$scope.speed = $scope.animate.g == "rocket" ? {ms:100,s:0.1} : ($scope.animate.g == "reactive" ? {ms:300,s:0.3} : {ms:800,s:0.8});	
						}
						
						var tom = [null,null];							
						var peak;					
						
						var resetPeak = function(){
							for(var j=0; j<$scope.len; j++){
							peak = document.getElementById("level_peak_"+j+"_"+$scope.unique);
							if(peak != null){								
									peak.setAttribute($scope.prop.pos,'0')
									peak.setAttribute('display','none')
								}
							}
						}
						
						var setPeak = function(data){
							if(!data.peak){
								return
							}														 
							for(var j=0; j<$scope.len; j++){								
								peak = document.getElementById("level_peak_"+j+"_"+$scope.unique);																									
								if(peak){	
									if(peak.getAttribute($scope.prop.pos) < data.peak[j].px){
										if(tom[j]){
											clearInterval(tom[j])
										}
										tom[j] = setInterval(resetPeak,$scope.animate.peak)
										peak.setAttribute($scope.prop.pos,data.peak[j].px)
										peak.setAttribute('display','inline')
										if(peak.getAttribute('fill') != data.peak[j].c){											
											peak.setAttribute('fill',data.peak[j].c)	
										}																																						
									}										
								}
							}			
						}
						
						var updateConfig = function (config){
							var minval = document.getElementById("level_min_"+$scope.unique);
							$(minval).text(config.min);
							var maxval = document.getElementById("level_max_"+$scope.unique);
							$(maxval).text(config.max);
							if(config.sectors){
								var gradient = document.getElementById("level_gradi_"+$scope.unique)
								if(gradient){
									for(var i = 0;i<config.sectors.length;i++){
										var stop = gradient.children[i]
										if(stop){
											$(stop).attr({offset:config.sectors[i]+"%"})
										}										
									}								
								}
							} 
						}
						
						
						var updateLevel = function(data){							
							if(data.config){								
								updateConfig(data.config)								
							}							
							var stripe;
							var mask;												
							var j;							
							var valfield;											
												
							for(j = 0; j<$scope.len; j++){														
								mask = document.getElementById("level_mask_"+j+"_"+$scope.unique);
								if(mask){
									if(parseInt(mask.style[$scope.prop.dir]) != data.position[j]){
										if($scope.animate.g !== "off"){
											$(mask).stop(true,true).animate({[$scope.prop.dir]: data.position[j]+'px' },$scope.speed.ms,'swing',function(){setPeak(data)});
										}
										else{											
											mask.style[$scope.prop.dir] = data.position[j]+'px'
											setPeak(data)
										}	
									}									
								}																						
								if(data.color){
									stripe = document.getElementById("level_stripe_"+j+"_"+$scope.unique);
									if(stripe && data.color[j] != null){
										if($scope.animate.g !== "off"){
											if(stripe.style.fill != data.color[j]){
												$(stripe).stop().animate().css({'fill': data.color[j] ,'transition': 'fill '+$scope.speed.s+'s'});
											}										
										}
										else{
											stripe.style.fill = data.color[j]
										}									
									}	
								}
								valfield = document.getElementById("level_value_channel_"+j+"_"+$scope.unique);
								if(valfield){
									if($scope.animate.g !== "off" && $scope.animate.t == true){
										$({ticker: $scope.lastvalue[j]}).stop().animate({ticker: data.payload[j]}, {
											duration: $scope.speed.ms,
											easing:'swing',
											step: function() {										
												$(valfield).text((Math.ceil(this.ticker * $scope.d.mult)/$scope.d.mult).toFixed($scope.d.fixed));
											},
											complete: function() {
												$(valfield).text(data.payload[j].toFixed($scope.d.fixed));
												$scope.lastvalue[j] = data.payload[j];										
											}
										}); 
									}
									else{
										$(valfield).text(data.payload[j].toFixed($scope.d.fixed));
										$scope.lastvalue[j] = data.payload[j];
									}
								}								
							}
						}; 
																		
						$scope.$watch('msg', function (msg) {
							if (!msg) {								
								return;
							}							
							var id = "level_stripe_0_"+$scope.unique
							var stripe = document.getElementById(id);						
							if(stripe == null){
								var stateCheck = setInterval(function() {									
									stripe = document.getElementById(id)									
									if (stripe != null) {
										clearInterval(stateCheck);
										updateLevel(msg)										
									}
								}, 40);
							}
							else{								
								updateLevel(msg)
							}						
														
						});
						$scope.$on('$destroy', function() {
							if(tom && Array.isArray(tom)) {
								for(var i= 0;i<2;i++){
									if(tom[i]){
										clearInterval(tom[i])
									}
								}								
							}
						});
					}
				});
			}
		}
		catch (e) {
			console.log(e);
		}

		node.on("close", function () {
			if (done) {
				done();
			}
		});
	}
	RED.nodes.registerType("ui_level", LevelNode);
};