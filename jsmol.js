/*
	Interfaces with jsmol
*/
var JSmolInterface = {
	info: {
		color:	"#FFFFFF",
		height: 300,
		width:	300,
		//j2s:	"http://mailmindlin.github.io/quantum-physics-sim/jsmol/jsmol/j2s",
		j2s: "/j2s",
		use:	"HTML5 WebGl Java",
		readyFunction:	function(ev){console.log(["Ready!",ev]);}
	},
	start: function(domEl){
		$(domEl).html(Jmol.getAppletHtml("JSmol1",JSmolInterface.info));
	}
	atom: function(type,x,y,z,charge,vectorX,vectorY,vectorZ) {
		var self = new Object();
		self.atomType = type;
		self.x=x;
		self.y=y;
		self.z=z;
		self.charge=charge;
		self.vectorX=vectorX;
		self.vectorY=vectorY;
		self.vectorZ=vectorZ;
		self.type="Atom";
		return self;
	},
	xyzFile: function() {
		var self = new Object();
		self.atomRegistry = [];
		self.pushAtom = function(atom) {
			//make sure atom is an atom
			if(atom.type!="Atom")throw(new Error("argument[0] was not an atom!"));
			self.atomRegistry.push(atom);
		};
		self.getXYZData = function(comment) {
			var output = atomRegistry.length + "\n";
			output +=comment;
			
		}
		return self;
	},
	scene: function() {
		var self = this;
		
		return self;
	}
};