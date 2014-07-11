/**
			 * Loader object.
			 * Basically handles scripts that load or fail to load, and smooths it out.
			 */
			window['Loader'] = (function() {
				var self = Object.create(null);
				//vardef
				self.hasErrors=false;
				self.failureQueue = {};
				self.successQueue = {};
				self.waitingQueue = {};
				self.tsStorage    = new TSStorage();
				self.scriptCache  = [];
				self.scriptDependencies = {
					"utils.js":[],
					"session.js":[],
					"renderer.js":["utils.js"],
					"renderUtils.js":["renderer.js"],
					"networking.js":["utils.js"],
					"jsmol.js":["utils.js"],
					"input.js":["utils.js", "logger.js"],
					"help.js":["logger.js", "utils.js"],
					"console.js":[],
					"communications.js":[] };
				//functiondef
				self.onSuccess = function(src, name) {
					var obj = Object.create(null);
					obj.src = src;
					obj.name = name;
					self.successQueue[name] = obj;
					delete self.waitingQueue[name];
					console.log("%cLoaded " + name + " from " + src,'color:green;');
				};
				self.onFail = function(src, name) {
					self.hasErrors=true;
					var obj = Object.create(null);
					obj.src = src;
					obj.name = name;
					self.failureQueue[name] = obj;
					//TODO: figure out what this line does
// 					if((typeof self.waitingQueue[name] !== 'undefined')/* && (self.waitingQueue[name].cachable)*/)self.createScript(name, self.getFromCache(name, self.waitingQueue[name].url,0,true));
					delete self.waitingQueue[name];
					//TODO remove object from the waitingQueue
					console.log("%cFailed to load " + name + " from " + src,'color:red;');
				};
				self.createScript = function(name, data) {
					var sct = document.createElement("script");
					sct.setAttribute("name",name);
					//generate wrapper
					data = "window['loadscript_"+name.substr(0,name.indexOf("."))+"']=function(){\n"+data+"\n};";
					sct.innerHTML=data;
					sct.setAttribute("type","text/javascript");
					var headTag = document.querySelector("head");
					headTag.appendChild(sct);
				};
				self.getFromCache = function(name, url, tryAJAX, canCreateScript, tryTSS) {
					if(typeof tryAJAX === 'undefined')tryAJAX=true;
					if (typeof version === "undefined")version = "LATEST";
					if(typeof tryTSS === 'undefined')tryTSS=true;
					if(typeof canCreateScript === 'undefined')canCreateScript=false;
					if(self.tsStorage.has(name) && (window['Production'] == true) && canCreateScript && tryTSS) {//only read from cache if it's production, TSS is allowed (TSStorage), and it can create a script (because why load it from the cache if it cant do anything with it).
						if(canCreateScript)self.createScript(name, self.tsStorage.get(name));
					} else if (tryAJAX) {
						console.log("Getting " + name + " from " + url + " via AJAX");
						self.getFromAjax(name, url, false, function(response, wasGood) {
							if(!wasGood) {
								console.error("AJAX to " + name + "Failed!");
								self.onFail(url,name);
								return;
							}
							self.tsStorage.put(name, url, response.target.responseText);
							if(canCreateScript)self.createScript(name, response.target.responseText);
							self.onSuccess(url,name);
							self.progress.progressValue=self.objLength(self.successQueue);
							if(self.objLength(self.waitingQueue)==0) {
								if(self.objLength(self.failureQueue)==0) {
									self.progress.progressHidden=true;
								}else{
									self.progress.progressLabel="Please Reload!";
								}
							}
						});
					}
				};
				self.getFromAjax = function(name, url, directlyAdd, callback) {//callback is optional
					var selfFn = Object.create(null);
					selfFn.name = name;
					selfFn.url = url;
					selfFn.directlyAdd = directlyAdd;
					if (window.XMLHttpRequest) {
						selfFn.xmlhttp=new XMLHttpRequest();// code for IE7+, Firefox, Chrome, Opera, Safari
					} else {
						selfFn.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");// code for IE6, IE5
					}
					if(selfFn.xmlhttp == null) throw(new Error("XMLHTTP not supported!"));
					selfFn.xmlhttp.onload = function(ev) {
						self.tsStorage.put(selfFn.name, selfFn.url, selfFn.xmlhttp.responseText);
						console.log(["XMLHTTP Success",selfFn,ev]);
						if(typeof callback === 'function')callback(ev, true);
					};
					selfFn.xmlhttp.onerror = function(e) {
						console.log(e);
						console.log(["XMLHTTP Failure",selfFn,e]);
						callback(e, false);
					};
					selfFn.xmlhttp.open("GET", url, true);
					selfFn.xmlhttp.send();
				};
				self.want = function(src, name, version) {
					if(typeof version === 'undefined')version = "LATEST";
					var obj = Object.create(null);
					obj.src = src;
					obj.name = name;
					obj.version = version;
					self.waitingQueue[name] = (obj);
					console.log("Waiting to load " + name + " from " + src);
					self.progress.progressMax = self.objLength(self.waitingQueue)+self.objLength(self.successQueue)+self.objLength(self.failureQueue);
					self.progress.progressLabel = "Loading Scripts...";
					//check if it exists in local storage
					self.getFromCache(name, src, true, true);
					return self;
				};
				self.progress = {};
				self.progress.labelQueue="";
				self.progress.progVal=0;
				self.progress.progMax=0;
				self.progress.progressObj=null;
				self.progress.__defineSetter__("progressLabel",function(val) {
					self.progress.labelQueue=val;
					self.progress.attemptLabelUpdate();
				});
				self.progress.__defineSetter__("progressValue", function(val) {
					self.progress.progVal=val;
					self.progress.attemptLabelUpdate();
				});
				self.progress.__defineSetter__("progressMax", function(val) {
					self.progress.progMax=val;
					self.progress.attemptLabelUpdate();
				});
				self.progress.__defineSetter__('progressHidden', function(val) {
					if(window['onLoadCalled']) {
						self.progress.attemptLabelUpdate();
						if(self.progress.progressObj!=null) {
							self.progress.progressObj.hidden=true;
						}else{
							window['hideProgressbar']=true;
						}
					}
				});
				self.progress.attemptLabelUpdate = function() {
					if(window['onLoadCalled']==true) {
						if(self.progress.progressObj==null) {
							self.progress.progressObj=new ProgressLoader(0,self.progress.progMax);
						}
						self.progress.progressObj.progress=self.progress.progVal;
						self.progress.progressObj.label=self.progress.labelQueue;
						self.progress.progressObj.max=self.progress.progMax;
					}
				};
				self.objLength = function(obj) {
					try {
						return Object.keys(obj).length;
					}catch(e) {
						console.error(e);
						console.log(obj);
					}
				};
				return self;
			})();