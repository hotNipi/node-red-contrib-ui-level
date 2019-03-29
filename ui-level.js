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
			.level {
				display: flex;
				flex-flow: row;
				justify-content: ${config.justify};
				
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
		<div class="level" id="level_{{unique}}">
			<svg id="level_svg_{{uni.que}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes track by $index" 
					y=64% 
					ng-attr-x="{{$index * 6}}px"
					width="3"
					height="36%" 
					style="fill:{{color}}"
				/>
				<text id=level_title_{{unique}} class="txt" text-anchor="middle" dominant-baseline="hanging" x=`+config.exactwidth/2+` y="0">`+config.label+
				` <tspan id=level_value_channel_0_{{unique}} class="txt" dominant-baseline="hanging" style="font-weight: bold">
						{{msg.value}}
						</tspan>
						<tspan class="small" dominant-baseline="hanging">
						`+config.unit+`
						</tspan>					
				</text>
				<text class="small" text-anchor="start" dominant-baseline="hanging" x="0" y="25%">`+config.min+`</text>	
				<text id=level_max_{{unique}} class="small" text-anchor="end" dominant-baseline="hanging" ng-attr-x=`+config.lastpos+`px y="25%">`+config.max+`</text>			
			</svg>				           
		</div>`
		var level_single_v = String.raw`
		<div class="level" id="level_{{unique}}">
			<svg id="level_svg_{{unique}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes track by $index" 
					y=0 
					ng-attr-y="{{$index * 6}}px"
					width="12"
					height="3" 
					style="fill:{{color}}"
				/>
				<g id="level_value_group_{{unique}}" transform="translate(${(config.exactwidth/2)+6}, ${(config.exactheight/2)-25})">
					<text id=level_title_{{unique}} class="txt" text-anchor="middle" dominant-baseline="hanging" y="0">`+config.label+`</text>	
					
					<text id=level_value_channel_0_{{unique}} class="big" dominant-baseline="hanging"
					text-anchor="middle" y="18px" style="font-weight: bold">
							{{msg.value}}											
					</text>
					<text id=level_value_unit_{{unique}} class="small" dominant-baseline="hanging"
					text-anchor="middle" y="48px">					
					`+config.unit+`											
					</text>
						
				</g>			
				<text class="small" text-anchor="start" dominant-baseline="hanging" x="15" y="0">`+config.max+`</text>	
				<text id=level_max_{{unique}} class="small" text-anchor="start" dominant-baseline="baseline" x="15" ng-attr-y=`+config.lastpos+`px>`+config.min+`</text>			
			</svg>				           
		</div>`
		var level_pair_h = String.raw`
		<div class="level" id="level_{{unique}}">
			<svg id="level_svg_{{unique}}" style="width:`+config.exactwidth+`px; height:`+config.exactheight+`px;">
				<rect id="level_led_{{unique}}_0_{{$index}}" ng-repeat="color in stripes track by $index" 
					y=24% 
					ng-attr-x="{{$index * 6}}px"
					width="3"
					height="16%" 
					style="fill:{{color}}"
				/>
				<rect id="level_led_{{unique}}_1_{{$index}}" ng-repeat="color in stripes track by $index" 
					y=63% 
					ng-attr-x="{{$index * 6}}px"
					width="3"
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
						{{msg.value}}											
				</text>
				
				<text id=level_channel_1_{{unique}} class="txt" text-anchor="start" dominant-baseline="baseline" x="0" y=`+config.exactheight+`>`+config.channelB+`
					<tspan class="small" dominant-baseline="baseline">
					`+config.unit+`
					</tspan>
				</text>
				<text id=level_value_channel_1_{{unique}} class="txt" dominant-baseline="baseline"
				text-anchor="end" x="100%" y="100%" style="font-weight: bold">
						{{msg.value}}											
				</text>

				<text class="small" text-anchor="start" dominant-baseline="middle" x="0" y="53%">`+config.min+`</text>	
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
	};


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

			if (checkConfig(node, config)) {								
				site = function(){
					var fl = config._flow;					
					if(fl){
						var confs = config._flow.global.configs
						for(var key in confs){
							if (confs.hasOwnProperty(key)) {							
								if(confs[key].type === "ui_base"){								
									return confs[key]
								}
							}
						}
					}
					else{
						node.warn("Couldn't reach to the site parameters. Using defaults")
						var opts = {}
						opts.site = {sizes:{ sx: 48, sy: 48, gx: 4, gy: 4, cx: 4, cy: 4, px: 4, py: 4 }}
						opts.theme = {themeState: {"widget-textColor":{value:"#eeeeee"}}}
						return opts
					}
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
					var c = parseInt((w / 6));
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


				var group = RED.nodes.getNode(config.group);
				var siteoptions = site();												
				if(config.width == 0){ config.width = parseInt(group.config.width) || dimensions("w")};
				if(config.height == 0) {config.height = parseInt(group.config.height) || dimensions("h") }
				config.exactwidth = parseInt(siteoptions.site.sizes.sx * config.width * dimensions("ew"));			
				config.exactheight = parseInt(siteoptions.site.sizes.sy * config.height * dimensions("eh"));
				config.justify = (config.layout.indexOf("v") != -1) ? 'left' : 'center';
				config.count = stripecount();
				config.lastpos = config.count * 6 - 3;				
				
				config.colorText = siteoptions.theme.themeState['widget-textColor'].value;
				var offcolor = config.colorOff || "gray";
				var normalcolor = config.colorNormal || "green";
				var warncolor = config.colorWarn || "orange";
				var alertcolor = config.colorHi || "red";
				var opc = [offcolor,normalcolor,warncolor,alertcolor];
				
				config.min = parseFloat(config.min);
				config.max = parseFloat(config.max);
				config.params = {minin:config.min, maxin:config.max+0.00001, minout:1, maxout:config.count}; 				
				var warn = config.max;
				var high = config.max;
				var sectorhigh = isNaN(parseFloat(config.segHigh)) ? Math.floor(high *.9) : parseFloat(config.segHigh);
				var sectorwarn = isNaN(parseFloat(config.segWarn)) ? Math.floor(warn *.7) : parseFloat(config.segWarn);
				high = range(sectorhigh,config.params);
				warn = range(sectorwarn,config.params);	
				
				var decimals = isNaN(parseFloat(config.decimals)) ? {fixed:1,mult:0} : {fixed:parseInt(config.decimals),mult:Math.pow(10,parseInt(config.decimals))};				
				
				var html = HTML(config);
				
				done = ui.addWidget({
					node: node, 
					group: config.group,
					width: config.width,
					height: config.height,
					format: html,
					templateScope: "local",
					emitOnlyNewValues: false,
					forwardInputMessages: false,
					storeFrontEndInputAsState: true,					
								
					convertBack: function (value) {						
						return value;
					},
					convert: function (value,old,msg){											
						if(Array.isArray(value) === true){
							var result = value.map(function (x) { 
								return parseFloat(x); 
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
						value = parseFloat(value)
						if(!isNaN(value)){
							msg.payload = [value,null]
							return msg;
						}
						else{
							node.warn("msg.payload is not numeric value")
							msg.payload = [0,null]
							return msg;
						}						
					},
					
					beforeEmit: function (msg, value) {	
						var ranged = [];
						ranged.push(range(msg.payload[0], config.params));
						if(msg.payload[1] !== null){
							ranged.push(range(msg.payload[1], config.params));
						}												
						msg.colors = [[],[]];
						var col;
						for(var i=0; i < config.count; i++){								
							col = ranged[0] <= i ? opc[0] : ( i < (warn) ? opc[1] : ( i < (high) ? opc[2] : opc[3]));
							msg.colors[0].push(col)
						}
						if(msg.payload[1] !== null){
							for(var i=0; i < config.count; i++){								
								col = ranged[1] <= i ? opc[0] : ( i < (warn) ? opc[1] : ( i < (high) ? opc[2] : opc[3]));
								msg.colors[1].push(col)
							}
						}
						if((config.layout.indexOf("v") != -1)){
							msg.colors[0].reverse();
							msg.colors[1].reverse();
							
						}
						msg.d = decimals;					
						msg.animate = config.animations															
						return { msg: msg };
					},
					
					beforeSend: function (msg, orig) {						
						if (orig) {
							return orig.msg;
						}						
					},
					
					initController: function ($scope) {																		
						$scope.unique = $scope.$eval('$id')	
						$scope.lastvalue = [0,0]									
						$scope.$watch('msg', function (msg) {
							if (!msg) {								
								return;
							}								
							if(msg.colors){
								if(!$scope.stripes || $scope.stripes.length !== msg.colors[0].length){								
									$scope.stripes = msg.colors[0];
								}	
								var stripe;
								var len = msg.colors[1].length !== 0 ? 2 : 1;
								var i;
								var j;					
								var speed = msg.animations == "reactive" ? .2 : .8;													
								for(j = 0; j<len; j++){									
									for(i= 0;i<msg.colors[j].length;i++){									
										stripe = document.getElementById("level_led_"+$scope.unique+"_"+j+"_"+i);
										if(stripe){
											if(msg.animate !== "off"){
												$(stripe).stop().animate().css({'fill': msg.colors[j][i], 'transition': 'fill '+speed+'s'});
											}
											else{											
												stripe.style.fill = msg.colors[j][i]
											}	
										}
									}
								}
								
								
								var val0 = document.getElementById("level_value_channel_"+0+"_"+$scope.unique);
								if(val0){
									if(msg.animate !== "off"){
										$({ticker: $scope.lastvalue[0]}).stop().animate({ticker: msg.payload[0]}, {
											duration: msg.animate == "reactive" ? 100 : 400,
											easing:'swing',
											step: function() {										
												$(val0).text((Math.ceil(this.ticker * msg.d.mult)/msg.d.mult).toFixed(msg.d.fixed));
											},
											complete: function() {
												$(val0).text(msg.payload[0].toFixed(msg.d.fixed));
												$scope.lastvalue[0] = parseFloat(msg.payload[0].toFixed(msg.d.fixed));										
											}
										}); 
									}
									else{
										$(val0).text(msg.payload[0].toFixed(msg.d.fixed));
										$scope.lastvalue[0] = parseFloat(msg.payload[0].toFixed(msg.d.fixed));
									}
								}
								
								var val1 = document.getElementById("level_value_channel_"+1+"_"+$scope.unique);
								if(val1){
									if(msg.animate !== "off"){
										$({ticker: $scope.lastvalue[1]}).stop().animate({ticker: msg.payload[1]}, {
											duration: msg.animate == "reactive" ? 100 : 400,
											easing:'swing',
											step: function() {										
												$(val1).text((Math.ceil(this.ticker * msg.d.mult)/msg.d.mult).toFixed(msg.d.fixed));
											},
											complete: function() {
												$(val1).text(msg.payload[1].toFixed(msg.d.fixed));
												$scope.lastvalue[1] = parseFloat(msg.payload[1].toFixed(msg.d.fixed));										
											}
										}); 
									}
									else{
										$(val1).text(msg.payload[1].toFixed(msg.d.fixed));
										$scope.lastvalue[1] = parseFloat(msg.payload[1].toFixed(msg.d.fixed));
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