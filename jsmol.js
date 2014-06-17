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
		if(!ISSET(comment))comment = "This file was automatically generated.";//IDK what to put...
		var output = ("").pushLn(self.atomRegistry.length);
		output = output.pushLn(ISSET(comment)?comment:"");
		//add all atoms
		for (var i = 0; i < self.atomRegistry.length; i++) {
			output = output.pushLn(self.atomRegistry[i].toXYZ());
		}
		return output;
	};
	/**
	 * Loads XYZFile from parameter origin
	 * @required origin: 
	 */
	self.loadFrom = function(origin) {
		for(var i = 0; i < origin.len; i++) {
			var tempAtom = new Atom(origin[i]['element'],origin[i]['X'],origin[i]['Y'],origin[i]['Z']);
			self.pushAtom(tempAtom);
		}
	};
	if(ISSET(objectOrigin))self.loadFrom(objectOrigin);
	return self;
};
var Translator = function(obj) {
	var self = Object.create(null);
	self.molObj = obj;
	self.translateX = function(amt) {
		if(amt==0)return;
		self.molObj._script("translate x "+amt + ";");
	};
	self.translateY = function(amt) {
		if(amt==0)return;
		self.molObj._script("translate y "+amt + ";");
	};
	self.translateZ = function(amt) {
		if(amt==0)return;
		self.molObj._script("translate z "+amt + ";");
	};
	self.translate = function(x,y,z) {
		self.translateX(x);
		self.translateY(y);
		self.translateZ(z);
	};
	self.rotateX = function(deg) {
		if(deg==0)return;
		self.molObj._script("rotate x " + deg + ";");
	};
	self.rotateY = function(deg) {
		if(deg==0)return;
		self.molObj._script("rotate y " + deg + ";");
	};
	self.rotateZ = function(deg) {
		if(deg==0)return;
		self.molObj._script("rotate z " + deg + ";");
	};
	return self;
};
var JSmolInterface = {
	/**
	 * Info object for creation of the JSmol object.
	 * Contains standard properties (i.e., background color, size, path to native code).
	 */
	info: {
		color:			"#252525",
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
	},
	showXYZ: function(xyz) {
		var cmd = 'data "model example"\n';
		cmd+=(xyz)+"\n";
		cmd+=('end "model example";'+"\n");
		cmd+=('show data "model example";'+"\n");
		console.log(cmd);
		JSmol1._script(cmd);
	}
};