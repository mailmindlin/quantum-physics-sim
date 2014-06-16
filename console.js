/*
console.js
allow scripting
*/
var Console = function(data){
	var self = this;
	self.data = data;
	self.exec = function() {
		var lines = data.split('\n');
		var output="";
		for(var i=0;i<lines.length;i++){
			var line = lines[i];
			var out=self.execLn();
			output=line+"\n\t"+(out!==null?out:"undefined")+"\n";
		}
		return output;
	};
	self.execLn = function(ln) {
		if(ln.startsWith('DEFINE')){
			ln=ln.substring(7);//remove 'DEFINE '
			//do stuff
		}
	}
	//TODO: add function to auto-parse strings
	return self;
};
