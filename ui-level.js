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
		var html = String.raw`
            <style>
				.level {
					display: flex;
					flex-flow: row;
					justify-content: center;
				}
				.txt {
					fill: ${config.colorText};					
				}				
				.small { 
					font-size: 60%;
					fill: ${config.colorText};	
				}
            </style>
			
			<div class="level" id="level_{{unique}}">
				<svg id="level_svg_{{unique}}" width="`+config.exactwidth+`">
					<rect id="level_led_{{unique}}_{{$index}}" ng-repeat="color in stripes track by $index" 
						y=64% 
						ng-attr-x="{{$index * 6}}px"
						width="3"
						height="36%" 
						ng-attr-style="fill:{{color}}"
					/>
					<text id=level_title_{{unique}} class="txt" text-anchor="middle" alignment-baseline="hanging" x="50%" y="0">`+config.label+
					` <tspan id=level_value_{{unique}} class="txt" alignment-baseline="hanging" style="font-weight: bold;">
							{{msg.value}}
						 </tspan>
						 <tspan class="small" alignment-baseline="hanging">
						 	`+config.unit+`
						 </tspan>					
					</text>
					<text class="small" text-anchor="start" alignment-baseline="hanging" x="0" y="25%">`+config.min+`</text>	
					<text id=level_max_{{unique}} class="small" text-anchor="end" alignment-baseline="hanging" x="100%" y="25%">`+config.max+`</text>			
				</svg>
				           
            </div>
        `;
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

			if (checkConfig(node, config)) {
				var group = RED.nodes.getNode(config.group);
				
				site = function(){
					var confs = config._flow.global.configs									
					for(var key in confs){
						if (confs.hasOwnProperty(key)) {							
							if(confs[key].type === "ui_base"){								
								return confs[key]
							}
						}
					}
				}
				range = function (n,p){
					var divisor = p.maxin - p.minin;
					n = n > p.maxin ? p.maxin - 0.01 : n;
					n = n < p.minin ? p.minin : n;
					n = ((n - p.minin) % divisor + divisor) % divisor + p.minin;
					n = ((n - p.minin) / (p.maxin - p.minin) * (p.maxout - p.minout)) + p.minout;
					return Math.round(n);
				}				
				stripecount = function(){									
					var w = siteoptions.site.sizes.sx * config.width;								
					var c = parseInt((w / 6)) - 1;
					if(c & 1 !== 1){
						c --;
					}
					return c;				
				}

				var siteoptions = site()

												
				if(config.width == 0){ config.width = parseInt(group.config.width*0.5+1.5) || 4};
				if(config.height == 0) { config.height = 1 } 
				config.colorText = siteoptions.theme.themeState['widget-textColor'].value;
				var offcolor = config.colorOff || "gray";
				var normalcolor = config.colorNormal || "green";
				var warncolor = config.colorWarn || "orange";
				var alertcolor = config.colorHi || "red";
				var colorvalues = [offcolor,normalcolor,warncolor,alertcolor];				
				var warn = config.max;
				var high = config.max;
				var sectorhigh = isNaN(parseInt(config.segHigh)) ? Math.floor(high *.9) : parseInt(config.segHigh);
				var sectorwarn = isNaN(parseInt(config.segWarn)) ? Math.floor(warn *.7) : parseInt(config.segWarn);
				var decimals = isNaN(parseInt(config.decimals)) ? {fixed:1,mult:0} : {fixed:parseInt(config.decimals),mult:Math.pow(10,parseInt(config.decimals))};
				config.count = stripecount();
				config.stripes = [];						
				for(var i=0; i < config.count; i++){								
					config.stripes.push(colorvalues[0])
				}
				config.params = {minin:config.min, maxin:config.max+0.01, minout:1, maxout:config.count};
				config.exactwidth = (config.count * 6) -3;
				high = range(sectorhigh,config.params);
				warn = range(sectorwarn,config.params);				
				
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
					
					beforeEmit: function (msg, value) {										
						var rangedvalue = range(msg.payload, config.params);												
						msg.size = config.exactwidth;
						var newcolors = [];
						var col;
						for(var i=0; i < config.count; i++){								
							col = rangedvalue <= i ? colorvalues[0] : ( i < (warn) ? colorvalues[1] : ( i < (high) ? colorvalues[2] : colorvalues[3]));
							newcolors.push(col)
						}						
						msg.colors = newcolors;
						msg.d = decimals;
						msg.payload = parseFloat(msg.payload);
															
						return { msg: msg };
					},
					
					beforeSend: function (msg, orig) {						
						if (orig) {
							return orig.msg;
						}						
					},
					
					initController: function ($scope) {	
																					
						$scope.unique = $scope.$eval('$id')	
						$scope.lastvalue = 0;										
						
						$scope.$watch('msg', function (msg) {
							if (!msg) {								
								return;
							}
							if(msg.size){
								$scope.size = msg.size						
								var el = document.getElementById("level_svg_"+$scope.unique)
								el.setAttribute("width",msg.size);
								el = document.getElementById("level_title_"+$scope.unique)
								el.setAttribute("x",msg.size/2);
								el = document.getElementById("level_max_"+$scope.unique)
								el.setAttribute("x",msg.size);
							}						
							if(msg.colors){
								if(!$scope.stripes || $scope.stripes.length !== msg.colors.length){								
									$scope.stripes = msg.colors
								}	
								var stripe;
								for(var i= 0;i<msg.colors.length;i++){									
									stripe = document.getElementById("level_led_"+$scope.unique+"_"+i);																	
									$(stripe).stop().animate({'stroke-dashoffset': 0}, 1000).css({'fill': msg.colors[i], 'transition': 'fill .8s'});
								}
								var val = document.getElementById("level_value_"+$scope.unique);
								$({ticker: $scope.lastvalue}).stop().animate({ticker: msg.payload}, {
									duration: 500,
									easing:'swing',
									step: function() {										
										$(val).text((Math.ceil(this.ticker * msg.d.mult)/msg.d.mult).toFixed(msg.d.fixed));
									},
									complete: function() {
										$(val).text(msg.payload.toFixed(msg.d.fixed));
										$scope.lastvalue = parseFloat(msg.payload.toFixed(msg.d.fixed));										
									 }
								}); 								
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