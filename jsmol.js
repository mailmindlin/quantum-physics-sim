/*
	Interfaces with jsmol
*/
/**
 * typedef Atom
 */
window['Atom'] = function(type,x,y,z,charge,vectorX,vectorY,vectorZ) {
	"use strict";
	var self = Object.create(null);
	self.atomType = type;
	self.x = eval(x);
	self.y = eval(y);
	self.z = eval(z);
	self.charge = charge;
	self.vectorX = eval(vectorX);
	self.vectorY = eval(vectorY);
	self.vectorZ = eval(vectorZ);
	self.type = "Atom";
	self.toXYZ = function() {
		var out = "";
		out += self.atomType;
		//add whitespaces
		for (var i = 0; i < (5 - self.atomType.length); i++) {
			out += " ";
		}
		out += self.x + "  " + self.y + "  " + self.z;
		return out;
	};	
	return self;
};
/**
 * typedef XYZFile
 */
window['XYZFile'] = function(objectOrigin) {
	"use strict";
	var self = new Object();
	self.atomRegistry = [];
	self.pushAtom = function(atom) {
		//make sure atom is an atom
		if(atom.type!="Atom")throw(new Error("argument[0] was not an atom!"));
		self.atomRegistry.push(atom);
	};
	self.getXYZData = function(comment) {
		var output = ("").pushLn(self.atomRegistry.length);
		output = output.pushLn(comment);
		//add all atoms
		for (var i = 0; i < self.atomRegistry.length; i++) {
			output = output.pushLn(self.atomRegistry[i].toXYZ());
		}
		return output;
	};
	self.loadFrom = function(origin) {
		for(var i = 0; i < origin.len; i++) {
			var tempAtom = new Atom(origin[i]['element'],origin[i]['X'],origin[i]['Y'],origin[i]['Z']);
			self.pushAtom(tempAtom);
		}
	};
	if(ISSET(objectOrigin))self.loadFrom(objectOrigin);
	return self;
};
var JSmolInterface = {
	info: {
		color:			"#FFFFFF",
		height: 		300,
		width:			300,
		//j2s:			"http://mailmindlin.github.io/quantum-physics-sim/jsmol/jsmol/j2s",
		j2s:			"/j2s",
		use:			"HTML5 WebGl Java",
		readyFunction:	function(ev){"use strict"; console.log(["Ready!",ev]);}
	},
	start: function(domEl) {
		"use strict";
		$(domEl).html(Jmol.getAppletHtml("JSmol1",JSmolInterface.info));
	}
};