window['Module'] = function(name, script, dependencies, funcName) {
			 	var module		= Object.create(null);
			 	module.name		= name;
			 	module.script		= script;
			 	module.dependencies	= dependencies;
			 	module.funcName		= funcName;
			 	module.isComplete	= false;
			 	module.run = function() {
			 		window[funcName]();
			 		module.isComplete=true;
			 		window['ModuleController'].onModuleCompletion();
			 	};
			 	return module;
			 };