//a mashup of all the js
/*
Utils.js
Standard utilities.
*/
/**
 * Determines whether variable a is:
 * 1)set (if b is not used or is null)
 * 2)the type specified by b (i.e., ISSET(null, 'undefined')==true)
 */
window['ISSET']=function(a,b) {
	if(typeof b === 'undefined') {
		return typeof a !== 'undefined';
	} else {
		return typeof a === b;
	}
	throw(new Error("How did I get here?"));
};
//std. string functions
/**
 * Determines whether the string starts with the substring needle
 */
String.prototype.startsWith = function(needle) {
	return this.indexOf(needle) == 0;
};
/**
 * Determines whether the string contains the substring needle
 */
String.prototype.contains = function(needle) {
	return this.indexOf(needle) >= 0;
};
/*
Logger.js
Versatile logger. Create a logger for something, and log with it, and you can determine what to let through at runtime
*/
window['Logger'] = {
	whitelist: [],
	blacklist: [],
	useWhitelist: false,
	allow: function(file, obj, method) {
		for(var item in Logger.blacklist ) {
			if(item.matches(file, obj, method)) return false;
		}
		if(Logger.useWhitelist) {
			for(var item in Logger.whitelist) {
				if(item.matches(file, obj, method)) return true;
			}
		}else{
			return true;
		}
		return false;
	},
	create: function(file, obj){
		var self=this;
		self.obj=obj;
		self.file=file;
		self.log=function(stuff, usePrefix){
			if(window['Logger'].allow(self.file,self.obj, 'log')){
				if((!ISSET(usePrefix))||usePrefix){
					try{
						stuff=(ISSET(stuff,'object')?JSON.stringify(stuff):stuff);
					}catch(ex){}finally{
						console.log(window['Logger'].getPrefix(self.file, self.obj, 'log')+stuff);
					}
				}else{
					console.log({origin:{file:self.file,object:self.obj},data:stuff});
				}
			}
		};
		self.err=function(stuff){
			if(window['Logger'].allow(self.file,self.obj, 'err')){
				console.error(window['Logger'].getPrefix(self.file, self.obj, 'err')+stuff);
			}
		};
		return self;
	},
	getPrefix: function(file, obj, method) {
		return (method=='log'?"":method+" ")+(ISSET(file)?file+">":"")+obj+":";
	}
};
/*
networking.js
Basically allows for multiple computers in close proximity to connect via WebRTC and act as a supercomputer.
I should actually put this in a separate repository, but stuff would get complicated.
Requires connection.js
*/

window['Node'] = function() {
  var self=this;
  self.connection = new DataConnection();
  self.userId = self.connection.userid;
  self.connection.onopen = function(e) {console.log(e);};
  self.messageReciever = function() {};
  self.setMessageReciever = function(reciever) {
    self.messageReciever = reciever;
    self.connection.onmessage = reciever;
  };
  self.sendData = function(data, reciever) {
  	
  }
  return self;
};
window['RemoteNode'] = function() {
	
};
/**
 * Abstract network object. Use one of the other network objects.
*/

window['Network'] = function(name) {
  var self = this;
  self.name=name;
  self.parents=[
  'Object',
  'Network'
  ];
  self.channel=
  self.process=function() {
    //Abstract
    throw(new Error("Someone tried to use an abstract function in Network.\nUse a non abstract version (i.e., ManagedNetwork or DynamicNetwork)!"));
  };
  return self;
};
/**
 * A child of Network, that is a static, predefined network of computers.
 */
window['ManagedNetwork'] = function(name, setup) {
  var self = new Network(name);
  
  return self;
};
/**
 * Uses geolocation/ping times to determine the fastest network, and can change dynamically (hence it's name)
 */
window['DynamicNetwork'] = function(name, setup) {
  var self = new Network();
  
  return self;
};
/*
help.js
*/
var Help = {
	logger: Logger.create("Help.js", "help"),
	register: function(domEl, helpText) {
		$(domEl).attr('help-rq', 'true')
			.attr('help-text', helpText);
		return Help.refresh();//allow chaining
	},
	unregister: function(element) {
		$(element).attr('help-rq', 'false').off('mouseover mouseout');
		return Help;
	},
	refresh: function() {
		$('[help-rq="true"]').off('mouseover mouseout').unbind('mouseover mouseout')
			.bind('mouseover', function(ev) {
				Help.logger.log(ev, false);
				Help.help(ev.currentTarget);
			}).bind('mouseout', function(ev) {
				Help.logger.log(ev, false);//log without prefix
				if($(ev.currentTarget).attr('help-active')=='true') {
					$('#help-div').hide();
					$(ev.currentTarget).attr('help-active', 'false');
				}
			});
		return Help;
	},
	help: function(domEl) {
		if($(domEl).attr('help-rq')=='false'){
			//help was disabled previously
			Help.unregister(domEl);
			return Help;
		}
		$('#help-div').show()
			.html($(domEl).attr('help-text'))
			.css('right', ($(window).width()-295)+'px')
			.css('top', $(domEl).offset().top /*+ 65*/ + 'px');
		$(domEl).attr('help-active', 'true');
		if(ISSET($(domEl).attr('help-color'))){
			$('#help-div').css('background-color', $(domEl).attr('help-color'));
		}
		return Help;
	},
	setColor: function(domEl, color) {
		$(domEl).attr('help-color', color);
		return Help;
	}
};
/*
	Interfaces with jsmol
*/
var JSmolInterface = {
	info: {
		color:	"#FFFFFF",
		height: 300,
		width:	300,
		j2s:	"../jsmol/jsmol/j2s/",
		use:	"HTML5 WebGl Java"
		readyFunction:	function(ev){console.log(["Ready!",ev]);}
	},
	start: function(domEl){
		$(domEl).html(Jmol.getAppletHtml("JSmol1",JSmolInterface.info));
	}
};
/*
input.js
For textual data inputs
*/
function Input(args) {
	if((!ISSET(args['name'])) && (!ISSET(args,'String')))throw(new Error("You need to specify name!"));
	if(ISSET(args, 'String'))args['name']=args;
	var self = this;
	self.logger=new Logger.create('input.js', 'Input');
	//static
	//table row
	self.tRow="<tr>\
		<td><font style='color:white;background:red;' class='input-delete'>X</font></td>\
		<td><input type='text' class='input-element input'/></td>\
		<td><input type='text' class='input-X input input-numeric'/></td>\
		<td><input type='text' class='input-Y input input-numeric'/></td>\
		<td><input type='text' class='input-Z input input-numeric'/></td>\
		</tr>"
		.replace('\t','');//remove all tabs
	self.updateListeners = function() {
		//remove old listener(s)
		$('.input-Z').off('keydown');
		$('.input-delete').off('click');
		$('.input-element').off('blur keyup');
		$('.input-numeric').off('keyup blur');
		
		$('.input-Z').keydown(function(ev) {
			if(ev.keyCode!=9 || ev.shiftKey)return;//9 is tab key; also exit if shift is pressed (i.e., shift-tab)
			console.log('a');
			console.log(ev);
			self.logger.log('hi');
			var tr=$(this).parent().parent();//note: first parent is td
			var tbody=tr.parent();
			var trIndex=$(tr).index();
			console.log('b');
			var nextTr;
			if(ISSET(nextTr=$(tbody).children().eq(trIndex+1)[0])) {
				console.log('c1');
				console.log(nextTr);
				$(nextTr).children().eq(0).children.eq(0).focus();//focus on element
			}else{
				console.log('c2');
				(new Input({name: $(tbody).parent().attr('id')})).addRow().find('input-element').focus();
			}
		});
		$('.input-delete').click(function() {
			var td=$(this).parent();
			var tr=$(td).parent();
			if($($(tr).parent()).children().size()>1)tr.remove();
		});
		$('.input-element').bind('keyup blur', function(ev) {
			var text=$(this).val();
			for(var i=1; i < elements.length; i++) {
				if(elements[i][symbol]==text){
					$(this).addClass('element-valid').removeClass('element-invalid');
					Help.unregister($(this));//make sure that help isn't called for this element
					//try to call data update event
					if($(self.dom).find('element-invalid').size()==0 && ISSET(self.onUpdate))try{self.onUpdate();}catch(ex){}
					return;
				}
			}
			$(this).removeClass('element-valid').addClass('element-invalid');
			Help.register($(this), "That's not a valid element.");
		});
		$('.input-numeric').bind('keyup blur', function(ev) {
			var text = $(this).val();
			if(!isNaN(text)) {
				$(this).addClass('element-valid').removeClass('element-invalid');
				Help.unregister($(this));
				//try to call data update event
				if($(self.dom).find('element-invalid').size()==0 && ISSET(self.onUpdate))try{self.onUpdate();}catch(ex){}
			} else {
				$(this).removeClass('element-valid').addClass('element-invalid');
				Help.register($(this), "You need to type in a valid number");
				//don't call data update, because the data is invalid
			}
		});
	};
	//set custom vars
	//set name var
	self.name=args['name'];
	//Adds a row to the tbody of the table
	self.addRow = function() {
		//make sure self.dom is defined
		if(!ISSET(self.dom)) {
			//get table element
			self.dom = $('table#'+self.name)[0];
		}
		//get table body, to append row in
		var tbody=$(self.dom).find("tbody");
		var newRow=$(self.tRow);
		tbody.append(newRow);
		self.updateListeners();
		self.logger.log('Successfully added row!');
		return newRow;
	};
	self.getData = function() {
		var obj = {};
		//make sure self.dom is defined
		if(!ISSET(self.dom)) {
			//get table element
			self.dom = $('table#'+self.name)[0];
		}
		var tbody = $(self.dom).find('tbody');
		obj.len=$(tbody).children().size();
		for(var i = 0; i < obj.len; i++) {
			var temp = $(tbody).children().eq(i);
			var rowObj = {}
			rowObj.element=$(temp).find('.input-element').val();
			rowObj.X=Number($(temp).find('.input-X').val());
			rowObj.Y=Number($(temp).find('.input-Y').val());
			rowObj.Z=Number($(temp).find('.input-Z').val());
			obj[i]=rowObj;
		}
		return obj;
	};
	if(ISSET(self.supr=args['dom'])){
		//create input
		//check that the element doesn't already exist (to prevent conflicts)
		if(ISSET($('#'+args['name'])[0]))throw(new Error('Input with specified name \'' + args['name'] + '\' already exists'));
		//add table text
		self.supr.innerHTML="\
			<table id=" + self.name + ">\
			<thead><tr><th></th><th>Element</th><th>X</th><th>Y</th><th>Z</th></tr></thead>\
			<tbody></tbody>\
			</table>";
		//set dom attribute
		self.dom=$('#'+self.name);
		//create first row
		self.addRow();
	}
	return self;
}
//element list
var elements = [
	null,//just so you can reference elements[x], where x is the atomic number
	{symbol:'H', 	name:"Hydrogen", 	number: 1, 	weight: 1.008},
	{symbol:'He',	name:"Helium",		number:	2,	weight: 4.2602},
	{symbol:'Li',	name:"Lithium", 	number: 3,	weight: 6.94},
	{symbol:'Be',	name:"Beryllium",	number: 4,	weight:	9.012182},
	{symbol:'B',	name:"Boron",		number: 5,	weight:	10.81},
	{symbol:'C',	name:"Carbon",		number: 6},
	{symbol:'N',	name:"Nitrogen",	number: 7},
	{symbol:'O',	name:"Oxigen",		number: 8},
	{symbol:'F',	name:"Fluorine",	number: 9},
	{symbol:'Ne',	name:"Neon",		number: 10},
	{symbol:'Na',	name:"Sodium",		number: 11},
	{symbol:'Mg',	name:"Magnesium",	number: 12},
	{symbol:'Al',	name:"Aluminum",	number: 13},
	{symbol:'Si',	name:"Silicon",		number: 14},
	{symbol:'P',	name:"Phosphorous",	number: 15},
	{symbol:'S',	name:"Sulfur",		number: 16},
	{symbol:'Cl',	name:"Chlorine",	number: 17},
	{symbol:'Ar',	name:"Argon",		number: 18},
	{symbol:'K',	name:"Potassium",	number: 19},
	{symbol:'Ca',	name:"Calcium",		number: 20},
	{symbol:'Sc',	name:"Scandium",	number: 21},
	{symbol:'Ti',	name:"Titanium",	number: 22},
	{symbol:'V',	name:"Vanadium",	number: 23},
	{symbol:'Cr',	name:"Chromium"},
	{symbol:'Mn',	name:"Manganese"},
	{symbol:'Fe',	name:"Iron"},
	{symbol:'Co',	name:"Cobalt"},
	{symbol:'Ni',	name:"Nickel"},
	{symbol:'Cu',	name:"Copper"},
	{symbol:'Zn',	name:"Zink"},
	{symbol:'Ga',	name:"Gallium"},
	{symbol:'Ge',	name:"Germanium"},
	{symbol:'As',	name:"Arsenic"},
	{symbol:'Se',	name:"Selenium"},
	{symbol:'Br',	name:"Bromine"},
	{symbol:'Kr',	name:"Krypton"},
	{symbol:'Rb',	name:"Rubidium"},
	{symbol:'Sr',	name:"Strontium"},
	{symbol:'Y',	name:"Ytterbium"},
	{symbol:'Zr',	name:"Zirconium"},
	{symbol:'Nb',	name:"Niobium"},
	{symbol:'Mo',	name:"Molybdenum"},
	{symbol:'Tc',	name:"Technetium"},
	{symbol:'Ru',	name:"Rutherfordium"},
	{symbol:'Rh',	name:"Rhodium"},
	{symbol:'Pd',	name:"Palladium"},
	{symbol:'Ag',	name:"Silver"},
	{symbol:'Cd',	name:"Cadmium"},
	{symbol:'In',	name:"Indium"},
	{symbol:'Sn',	name:"Tin"},
	{symbol:'Sb',	name:"Antimony"},
	{symbol:'Te'},
	{symbol:'I'},
	{symbol:'Xe'},
	{symbol:'Cs'},
	{symbol:'Ba'},
	{symbol:'La'},
	{symbol:'Ce'},
	{symbol:'Pr'},
	{symbol:'Nd'},
	{symbol:'Pm'},
	{symbol:'Sm'},
	{symbol:'Eu'},
	{symbol:'Gd'},
	{symbol:'Tb'},
	{symbol:'Dy'},
	{symbol:'Ho'},
	{symbol:'Er'},
	{symbol:'Tm'},
	{symbol:'Yb'},
	{symbol:'Lu'},
	{symbol:'Hf'},
	{symbol:'Ta'},
	{symbol:'W'},
	{symbol:'Re'},
	{symbol:'Os'},
	{symbol:'Ir'},
	{symbol:'Pt'},
	{symbol:'Au'},
	{symbol:'Hg'},
	{symbol:'Tl'},
	{symbol:'Pb'},
	{symbol:'Bi'},
	{symbol:'Po'},
	{symbol:'At'},
	{symbol:'Rn'},
	{symbol:'Fr'},
	{symbol:'Ra'},
	{symbol:'Ac'},
	{symbol:'Th'},
	{symbol:'Pa'},
	{symbol:'U'},
	{symbol:'Np'},
	{symbol:'Pu'},
	{symbol:'Am'},
	{symbol:'Cm'},
	{symbol:'Bk'},
	{symbol:'Cf'},
	{symbol:'Es'},
	{symbol:'Fm',}//100!!
	{symbol:'Md'},
	{symbol:'No'},
	{symbol:'Lr'},
	{symbol:'Rf'},
	{symbol:'Db'},
	{symbol:'Sg'},
	{symbol:'Bh'},
	{symbol:'Hs'},
	{symbol:'Mt'},
	{symbol:'Ds'},
	{symbol:'Rg'},
	{symbol:'Cn'},
	{symbol:'Uut'},
	{symbol:'Fl'},
	{symbol:'Uup'},
	{symbol:'Lv'},
	{symbol:'Uus'},
	{symbol:'Uuo'}
];
