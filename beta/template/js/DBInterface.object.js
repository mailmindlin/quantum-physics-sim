			window['Field'] = function(name, unique) {
				var self = Object.create(null);
				Object.defineProperty(self,"name",{value:name,enumerable:true,writable:true});
				Object.defineProperty(self,"unique",{value:unique,enumerable:true,writable:true});
				return self;
			};
			window['Table'] = function(name, fields, keypath) {
				var self = Object.create(null);
				//vardef
				Object.defineProperty(self, "name", {value: name, writable: true,enumerable: true});
				Object.defineProperty(self, "fields", {value: ((fields === undefined)?[]:fields),writable:true,enumerable:true});
				Object.defineProperty(self, "keyPath", {value: keypath, writable: true, enumerable: true,configurable:true});
				self.addField = function(field) {
					self.fields.push(field);
					return self;//allow for chaining
				};
				return self;
			};
			/**
			 * DB interface object. Acts as a buffer between the database and JS code
			 */
			 window['DBInterface'] = function(args) {
			 	//safety check
			 	if(typeof args === 'undefined') args = {};

			 	//define self
			 	var self = Object.create(null);

			 	//vardef
			 	self.dbName 	= (args.dbName !== undefined)?args.dbName:"Generic Database";
			 	self.dbVersion 	= (typeof args.version === 'number')?args.version:0;
			 	self.tables	= (typeof args.tables === "object")?args.tables:[];
			 	Object.defineProperty(self,	"openRequest",	{value:null,writable:true});
			 	Object.defineProperty(self,	"state",	{value:-1,writable:true,enumerable:true});
			 	Object.defineProperty(self,	"storeBuffer",	{value:[],writable:true,enumerable:true});
			 	Object.defineProperty(self,	"db",		{value:null,writable:true,enumerable:true});

			 	//functiondef
			 	self.setup = function() {
			 		console.log("Initializing database "+self.dbName + "...");
			 		self.state = 0;
			 		self.openRequest = window.indexedDB.open(self.dbName, self.dbVersion);
			 		self.openRequest.onerror = self.onerror;
			 		self.openRequest.onsuccess = self.onsuccess;
			 		self.openRequest.onupgradeneeded = self.onupgradeneeded;
			 		console.log("\t%cDone.",'color:green;');
			 	};
			 	self.onerror = function(error) {
			 		if(self.state==0){
			 			console.error([new Error("DB creation failed"),error]);
			 			return;
			 		}
			 		//generic mesage
			 		console.error([new Error("An error occured!" + (typeof error !== 'undefined')?("\n"+error.message):""),error]);
			 	};
			 	self.onsuccess = function(event) {
			 		console.log(["IndexedDB opening Success!",event]);
			 		if (self.state == 0 && self.openRequest == "done") {
			 			console.log("The db is open!");
			 			self.db = event.result;
			 			self.state = 1;
			 		}
			 	};
			 	self.onupgradeneeded = function(event) {
			 		console.log("Upgrading database...");
			 		self.db = event.target.result;
			 		//create tables
			 		for (var i = 0; i < self.tables.length; ++i) {
			 			console.log("\tCreating table '"+self.tables[i].name+"' ("+(i+1)+"/"+self.tables.length+")...");
			 			var table = self.tables[i];
			 			var kpArgs={keyPath: (typeof table.keyPath === 'string')?table.keyPath:"ssn"};
			 			if(debug)console.log(kpArgs);
			 			table.target = self.db.createObjectStore(table.name, kpArgs);
			 			//create fields
			 			for(var i=0;i<table.fields.length;++i){
			 				console.log("\t\tCreating field '"+table.fields[i].name+"' ("+(i+1)+"/"+table.fields.length+")...");
			 				var field = table.fields[i];
			 				var indexArgs = (((typeof field.args==='object') && (typeof field.args.unique !== 'undefined'))?field.args:{unique: false});
			 				if(debug)console.log(indexArgs);
			 				table.target.createIndex(field.name, field.name, indexArgs);
			 				table.fields[i]=field;
			 				console.log("\t\t\t%cDone.",'color:green;');
			 			}
			 			//call any internal handler
			 			if(typeof table.onCreate === 'function')table.onCreate();
			 			self.tables[i]=table;
			 		}
			 		console.log("\t%cDone.",'color:green;');
			 	};
			 	self.delete = function() {
			 		console.log("Deleting database '"+self.dbName+"'...");
			 		indexedDB.deleteDatabase(self.dbName);
			 		self.state=-1;
			 		console.log("\t%cDone.",'color:green;');
			 	};
			 	self.getDB = function() {
			 		return self.openRequest.result;
			 	};
			 	self.getTable = function(name) {
			 		var obj = Object.create(null);
			 		obj.db = self.getDB();
			 		obj.transaction = obj.db.transaction([name], "readwrite");
			 		obj.objectStore = transaction.objectStore(name);
			 		return obj;
			 	};
			 	self.get = function(callback) {

			 	};
			 	self.put = function(callback) {

			 	}
			 	//setup object
			 	if((typeof args.waitForSetup==='undefined')||(!args.waitForSetup))self.setup();
			 	return self;
			 };