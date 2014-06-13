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
};