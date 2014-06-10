/*
console.js
allow scripting
*/
var Console = function(data){
	var self = this;
	self.data = data;
	self.exec = function(){
		var lines = data.split('\n');
		for(var i=0;i<lines.length;i++){
			var line = lines[i];
			
		}
	};
};
