window['TSStorage'] = function(args) {
			 	var self = Object.create(null);
			 	self.put = function(name, url, data) {
			 		var scrObj = Object.create(null);
			 		scrObj.name	= name;
			 		scrObj.url	= url;
			 		// scrObj.version	= version;
			 		scrObj.data	= data;
			 		window.localStorage.setItem("SCRIPTSTORE-" + name, JSON.stringify(scrObj));
			 	};
			 	self.has = function(name) {
			 		return (window.localStorage.getItem("SCRIPTSTORE-" + name) !== null);
			 	};
			 	self.get = function(name, version) {
			 		return JSON.parse(window.localStorage.getItem("SCRIPTSTORE-" + name)).data;
			 	};
			 	self.setup = function() {
			 		return self;
			 	};
			 	return self.setup();
			 };