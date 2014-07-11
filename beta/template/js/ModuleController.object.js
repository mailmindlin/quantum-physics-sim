window['ModuleController'] = (function() {
			 	var self = Object.create(null);
			 	self.canStart = false;
			 	self.modules = [];
			 	self.availableModules = [];
			 	self.promises= [];
			 	self.registerModule = function(module) {
			 		self.modules.push(module);
			 	};
			 	self.onScriptLoad = function(scriptName) {
			 		for(var i=0;i<modules.length;++i) {
			 			var cModule = modules[i];
			 			if(cModule.script = scriptName) {
			 				//check validity
			 				var requisites = cModule.dependencies;
			 				for(var i=0;i<requisites.length;++i){
			 					var tModule = self.getModule(requisite[i]);
			 					if(tModule.isComplete)requisites.splice(i,1);//remove from array
			 				}
			 				if(requisites.length==0)cModule.run();
			 			}
			 		}
			 	};
			 	self.getModule = function(name) {
			 		for(var i = 0; i<modules.length;++i) {
			 			if(modules[i].name == name)return modules[i];
			 		}
			 	};
			 	self.start = function() {
			 		self.canStart = true;
			 		for(var module in self.availableModules) {
			 			window.setTimeout(module.run(),0);//run module asynchronously
			 		};
			 	};
			 	self.isModuleLoaded = function(name) {
			 		return self.getModule(name).isComplete;
			 	};
			 	self.checkPrerequisites = function(prereqs) {
			 		for(var requisite in prereqs) {
			 			if(!self.isModuleLoaded(requisite)) return false;
			 		}
			 		return true;
			 	};
			 	self.promiseScriptLoad = function(scripts, fn) {
			 		var obj = Object.create(null);
			 		obj.req = scripts;
			 		obj.fn = fn;
			 		self.promises.push(obj);
			 		self.updatePromises();
			 		return self;
			 	};
			 	self.updatePromises = function() {
			 		for(var i=0;i<self.promises.length;i++) {
			 			if(self.checkPrerequisites(self.promises[i].req)) {
			 				setTimeout(self.promises[i].fn, 0);//run fn async
			 				self.promises.splice(i,1);
			 			}
			 		}
			 	};
			 	self.onModuleCompletion = function() {
			 		self.updatePromises;
			 	};
			 })();