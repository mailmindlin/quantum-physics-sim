window['ProgressLoader'] = function(min,max) {
					var _domProgress= document.querySelector('#progressBar>center>progress');
					var _domLabel	= document.querySelector('#progressBar>center>span');
					var _offset,_max=0;
					var self = {};
					self.__defineGetter__("domProgress",function(){return _domProgress;});
					self.__defineGetter__("domLabel",function(){return _domLabel;});
					self.__defineGetter__("min",function(){return _offset;});
					self.__defineGetter__("max",function(){return _max;});
					self.__defineGetter__("size",function(){return self.max-self.min;});
					self.__defineGetter__("label",function(){return _domLabel.innerText;});
					self.__defineGetter__("progress",function(){return domProgress.getAttribute('value');});
					self.__defineSetter__("min",function(val){_offset=val;self.domProgress.setAttribute('max',self.max-self.min);});
					self.__defineSetter__("max",function(val){_max=val;self.domProgress.setAttribute('max',self.max-self.min);});
					self.__defineSetter__("label",function(val){self.domLabel.innerText=val;});
					self.__defineSetter__("progress",function(val){self.domProgress.setAttribute('value',val);});
					self.__defineSetter__("hidden",function(val){if(typeof val !== "boolean")throw(new Error("Property must be boolean!"));document.getElementById('progressBar').setAttribute('display',val?"none":"block");});
					//set props
					self.max=max;
					self.min=min;
					return self;
				};