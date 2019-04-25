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
		
		var styles = String.raw`
		<style>
			.levelH {
				display: flex;
				flex-flow: row;
				justify-content: center;				
			}
			.levelV {
				display: flex;
				flex-flow: row;
				justify-content: left;				
			}
			.txt {
				fill: ${config.colorText};									
			}				
			.small { 
				font-size: 60%;
				fill: ${config.colorText};	
			}
			.big { 
				font-size: 175%;
				fill: ${config.colorText};	
			}
		</style>`
		
		var level_single_h = String.raw`
		<div class="levelH" id="level_{{unique}}">
			<svg id="level_svg_{{unique}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes[0] track by $index" 
					y=64% 
					ng-attr-x="{{$index * `+config.stripe.gap+`}}px"
					width="`+config.stripe.width+`"
					height="36%" 
					style="fill:{{color}}"
				/>
				<text id=level_title_{{unique}} class="txt" text-anchor="middle" dominant-baseline="hanging" x=`+config.exactwidth/2+` y="0">`+config.label+
				` <tspan id=level_value_channel_0_{{unique}} class="txt" dominant-baseline="hanging" style="font-weight: bold">
						{{msg.payload[0]}}
						</tspan>
						<tspan class="small" dominant-baseline="hanging">
						`+config.unit+`
						</tspan>					
				</text>
				<text id=level_min_{{unique}} class="small" text-anchor="start" dominant-baseline="hanging" x="0" y="25%">`+config.min+`</text>	
				<text id=level_max_{{unique}} class="small" text-anchor="end" dominant-baseline="hanging" ng-attr-x=`+config.lastpos+`px y="25%">`+config.max+`</text>			
			</svg>				           
		</div>`
		
		var level_single_v = String.raw`
		<div class="levelV" id="level_{{unique}}">
			<svg id="level_svg_{{unique}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes[0] track by $index" 
					y=0 
					ng-attr-y="{{$index * `+config.stripe.gap+`}}px"
					width="12"
					height="`+config.stripe.width+`" 
					style="fill:{{color}}"
				/>
				<g id="level_value_group_{{unique}}" transform="translate(${(config.exactwidth/2)+6}, ${(config.exactheight/2)-25})">
					<text id=level_title_{{unique}} class="txt" text-anchor="middle" dominant-baseline="hanging" y="0">`+config.label+`</text>	
					
					<text id=level_value_channel_0_{{unique}} class="big" dominant-baseline="hanging"
					text-anchor="middle" y="18px" style="font-weight: bold">
							{{msg.payload[0]}}											
					</text>
					<text id=level_value_unit_{{unique}} class="small" dominant-baseline="hanging"
					text-anchor="middle" y="48px">					
					`+config.unit+`											
					</text>
						
				</g>			
				<text id=level_max_{{unique}} class="small" text-anchor="start" dominant-baseline="hanging" x="15" y="0">`+config.max+`</text>	
				<text id=level_min_{{unique}} class="small" text-anchor="start" dominant-baseline="baseline" x="15" ng-attr-y=`+config.lastpos+`px>`+config.min+`</text>			
			</svg>				           
		</div>`
		
		var level_pair_h = String.raw`
		<div class="levelH" id="level_{{unique}}">
			<svg id="level_svg_{{unique}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes[0] track by $index" 
					y=24% 
					ng-attr-x="{{$index * `+config.stripe.gap+`}}px"
					width="`+config.stripe.width+`"
					height="16%" 
					style="fill:{{color}}"
				/>
				<rect id="level_led_{{unique}}_1_{{$index}}" ng-repeat="color in stripes[1] track by $index" 
					y=63% 
					ng-attr-x="{{$index * `+config.stripe.gap+`}}px"
					width="`+config.stripe.width+`"
					height="16%" 
					style="fill:{{color}}"
				/>
				<text id=level_channel_0_{{unique}} class="txt" text-anchor="start" dominant-baseline="hanging" x="0" y="0">`+config.channelA+`
					<tspan class="small" dominant-baseline="hanging">
					`+config.unit+`
					</tspan>
				</text>
				<text id=level_value_channel_0_{{unique}} class="txt" dominant-baseline="hanging"
				text-anchor="end" x="100%" y="0" style="font-weight: bold">
						{{msg.payload[0]}}											
				</text>
				
				<text id=level_channel_1_{{unique}} class="txt" text-anchor="start" dominant-baseline="baseline" x="0" y=`+config.exactheight+`>`+config.channelB+`
					<tspan class="small" dominant-baseline="baseline">
					`+config.unit+`
					</tspan>
				</text>
				<text id=level_value_channel_1_{{unique}} class="txt" dominant-baseline="baseline"
				text-anchor="end" x="100%" y="100%" style="font-weight: bold">
						{{msg.payload[1]}}											
				</text>

				<text id=level_min_{{unique}} class="small" text-anchor="start" dominant-baseline="middle" x="0" y="53%">`+config.min+`</text>	
				<text id=level_max_{{unique}} class="small" text-anchor="end" dominant-baseline="middle" ng-attr-x=`+config.lastpos+`px y="53%">`+config.max+`</text>
				
			</svg>				           
		</div>`
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

			if (checkConfig(node, config)) {				
				site = function(){
					var opts = null;					
					if (typeof ui.getSizes === "function") {
						//prepared to proper solution if dashboard version >= 2.15.0 (probably)						
						opts = {};
						opts.sizes = ui.getSizes();
						opts.theme = ui.getTheme();
					}					
					if(opts === null){
						// until 2.14 unreliable hack solution
						var fl = config._flow;					
						if(fl){
							var confs = config._flow.global.configs
							for(var key in confs){
								if (confs.hasOwnProperty(key)) {							
									if(confs[key].type === "ui_base"){																	
										opts = {}
										opts.sizes = confs[key].site.sizes
										opts.theme = confs[key].theme.themeState										
										break;
									}
								}
							}
						}
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
				range = function (n,p){					
					var divisor = p.maxin - p.minin;							
					n = n > p.maxin ? p.maxin - 0.00001 : n;
					n = n < p.minin ? p.minin : n;
					n = ((n - p.minin) % divisor + divisor) % divisor + p.minin;
					n = ((n - p.minin) / (p.maxin - p.minin) * (p.maxout - p.minout)) + p.minout;										
					return Math.round(n);
				}				
				stripecount = function(){									
					var w =(config.layout.indexOf("v") != -1) ? config.exactheight : config.exactwidth;							
					var c = parseInt((w / config.stripe.gap));
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
						case "eh":{
							if(config.layout == "sh"){
								ret = 4/6;
							}							
							if(config.layout == "ph"){
								ret = .88;
							}
							if(config.layout == "sv"){
								ret = .83 + (config.height*2.5/100);
							}
							break;
						}
						case "ew":{
							if(config.layout == "sh"|| config.layout == "ph"){
								ret = .85 + (config.width/100);
							}						
							if(config.layout == "sv"){
								ret = .94;
							}
							break;
						}
					}
					return ret;
				}
				
				updateControl = function(uicontrol){
					var applies = false;
					if(uicontrol.min && !isNaN(parseFloat(uicontrol.min))){
						min =  parseFloat(uicontrol.min);
						applies = true;
					}
					if(uicontrol.max && !isNaN(parseFloat(uicontrol.max))){
						max =  parseFloat(uicontrol.max);
						applies = true;
					}
					if(uicontrol.seg1 && !isNaN(parseFloat(uicontrol.seg1))){
						sectorwarn =  parseFloat(uicontrol.seg1);
						applies = true;
					}
					if(uicontrol.seg2 && !isNaN(parseFloat(uicontrol.seg2))){
						sectorhigh =  parseFloat(uicontrol.seg2);
						applies = true;
					}
					if(applies){
						params = {minin:min, maxin:max+0.00001, minout:1, maxout:config.count};
						high = range(sectorhigh,params);
						warn = range(sectorwarn,params);
						configsent = false;
					}
				}
				
				var group = RED.nodes.getNode(config.group);
				var siteproperties = site();
				config.stripe = {gap: config.shape * 2, width: config.shape};
															
				if(config.width == 0){ config.width = parseInt(group.config.width) || dimensions("w")}
				if(config.height == 0) {config.height = parseInt(group.config.height) || dimensions("h")}
				config.exactwidth = parseInt(siteproperties.sizes.sx * config.width * dimensions("ew"));			
				config.exactheight = parseInt(siteproperties.sizes.sy * config.height * dimensions("eh"));
				config.min = parseFloat(config.min)
				config.max = parseFloat(config.max)				
				config.count = stripecount();
				config.lastpos = config.count * config.stripe.gap - config.stripe.width;				
				config.colorText = siteproperties.theme['widget-textColor'].value
				var offcolor = config.colorOff || "gray";
				var normalcolor = config.colorNormal || "green";
				var warncolor = config.colorWarn || "orange";
				var alertcolor = config.colorHi || "red";
				var opc = [offcolor,normalcolor,warncolor,alertcolor];
				var colorschema = config.colorschema || 'fixed';				
				
				var min = config.min > config.max ? config.max : config.min;
				var max = config.max < config.min ? config.min : config.max;
				
				var reverse = config.min > config.max;				
				
				var params = reverse ? {minin:min, maxin:max+0.00001, minout:0, maxout:config.count-1} : {minin:min, maxin:max+0.00001, minout:1, maxout:config.count} ;			
				var decimals = isNaN(parseFloat(config.decimals)) ? {fixed:1,mult:0} : {fixed:parseInt(config.decimals),mult:Math.pow(10,parseInt(config.decimals))};
				var warn = config.max;
				var high = config.max;
				var sectorhigh = isNaN(parseFloat(config.segHigh)) ? parseFloat((high *.9).toFixed(decimals.fixed)) : parseFloat(config.segHigh);
				var sectorwarn = isNaN(parseFloat(config.segWarn)) ? parseFloat((warn *.7).toFixed(decimals.fixed)) : parseFloat(config.segWarn);
				high = range(sectorhigh,params);
				warn = range(sectorwarn,params);								
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
					
					convert: function (value,old,msg){																
						if(Array.isArray(value) === true){
							var result = value.map(function (x) { 
								return parseFloat(x.toFixed(decimals.fixed)); 
							});
							if(!result.some(isNaN)){
								if(result.length < 2 ){
									result.push(null);
								}
								msg.payload = result
								return msg;
							}
							else{
								node.warn("msg.payload doesn't contain array of numeric values")
								msg.payload = [0,0]
								return msg;
							}													
						}
						value = parseFloat(value.toFixed(decimals.fixed))
						if(!isNaN(value)){
							msg.payload = [value,null]
							return msg;
						}
						else{
							node.warn("msg.payload doesn't contain numeric value")
							msg.payload = [0,null]
							return msg;
						}						
					},
					
					beforeEmit: function (msg) {
						if(msg.ui_control){
							updateControl(msg.ui_control);
						}
						var ranged = [];
						ranged.push(range(msg.payload[0], params));
						if(msg.payload[1] !== null){
							ranged.push(range(msg.payload[1], params));
						}												
						msg.colors = [[],[]];
						var col;
						var selector = 0;
						if(reverse){
							for(var i=0; i < config.count ; i++){
								selector = colorschema === 'fixed' ?  i : ranged[0];							
								col = ranged[0] > i ? opc[0] : ( selector > (warn) ? opc[1] : ( selector > (high) ? opc[2] : opc[3]));
								msg.colors[0].unshift(col)
							}
							if(msg.payload[1] !== null){
								for(var i=0; i < config.count; i++){
									selector = colorschema === 'fixed' ?  i : ranged[1];								
									col = ranged[1] > i ? opc[0] : ( selector > (warn) ? opc[1] : ( selector > (high) ? opc[2] : opc[3]));
									msg.colors[1].unshift(col)
								}
							}
						}
						else{
							for(var i=0; i < config.count; i++){
								selector = colorschema === 'fixed' ?  i : ranged[0];							
								col = ranged[0] <= i ? opc[0] : ( selector < (warn) ? opc[1] : ( selector < (high) ? opc[2] : opc[3]));
								msg.colors[0].push(col)
							}
							if(msg.payload[1] !== null){
								for(var i=0; i < config.count; i++){
									selector = colorschema === 'fixed' ?  i : ranged[1];								
									col = ranged[1] <= i ? opc[0] : ( selector < (warn) ? opc[1] : ( selector < (high) ? opc[2] : opc[3]));
									msg.colors[1].push(col)
								}
							}
						}
						
						if((config.layout.indexOf("v") != -1)){
							msg.colors[0].reverse();
							msg.colors[1].reverse();							
						}
						if(!configsent){
							msg.min = reverse ? max : min;
							msg.max = reverse ? min : max;
							configsent = true;
						}
						msg.d = decimals;					
						msg.animate = config.animations															
						return { msg: msg };
					},
					
					initController: function ($scope) {																		
						$scope.unique = $scope.$eval('$id')					
						$scope.lastvalue = [0,0]									
						$scope.$watch('msg', function (msg) {
							if (!msg) {								
								return;
							}
							if(msg.min){
								var minval = document.getElementById("level_min_"+$scope.unique);
								$(minval).text(msg.min);
								var maxval = document.getElementById("level_max_"+$scope.unique);
								$(maxval).text(msg.max);								
							}							
							if(!$scope.stripes || $scope.stripes[0].length !== msg.colors[0].length){								
								$scope.stripes = msg.colors;
							}	
							var stripe;
							var len = msg.colors[1].length !== 0 ? 2 : 1;
							var i;
							var j;					
							var speed = msg.animate == "reactive" ? .3 : .8;													
							for(j = 0; j<len; j++){									
								for(i= 0;i<msg.colors[j].length;i++){									
									stripe = document.getElementById("level_led_"+$scope.unique+"_"+j+"_"+i);										
									if(stripe && stripe.style.fill !== msg.colors[j][i]){
										if(msg.animate !== "off"){
											$(stripe).stop().animate().css({'fill': msg.colors[j][i], 'transition': 'fill '+speed+'s'});
										}
										else{											
											stripe.style.fill = msg.colors[j][i]
										}	
									}
								}
							}						
							
							var val0 = document.getElementById("level_value_channel_0_"+$scope.unique);
							if(val0){
								if(msg.animate !== "off"){
									$({ticker: $scope.lastvalue[0]}).stop().animate({ticker: msg.payload[0]}, {
										duration: msg.animate == "reactive" ? 100 : 400,
										easing:'swing',
										step: function() {										
											$(val0).text((Math.ceil(this.ticker * msg.d.mult)/msg.d.mult).toFixed(msg.d.fixed));
										},
										complete: function() {
											$(val0).text(msg.payload[0]);
											$scope.lastvalue[0] = msg.payload[0];										
										}
									}); 
								}
								else{
									$(val0).text(msg.payload[0]);
									$scope.lastvalue[0] = msg.payload[0];
								}
							}
							
							var val1 = document.getElementById("level_value_channel_1_"+$scope.unique);
							if(val1){
								if(msg.animate !== "off"){
									$({ticker: $scope.lastvalue[1]}).stop().animate({ticker: msg.payload[1]}, {
										duration: msg.animate == "reactive" ? 100 : 400,
										easing:'swing',
										step: function() {										
											$(val1).text((Math.ceil(this.ticker * msg.d.mult)/msg.d.mult).toFixed(msg.d.fixed));
										},
										complete: function() {
											$(val1).text(msg.payload[1]);
											$scope.lastvalue[1] = msg.payload[1];										
										}
									}); 
								}
								else{
									$(val1).text(msg.payload[1]);
									$scope.lastvalue[1] = msg.payload[1];
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