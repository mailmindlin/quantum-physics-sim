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
				$(nextTr).children().eq(0).children().eq(0).focus();//focus on element
			}else{
				console.log('c2');
				(new Input({name: $(tbody).parent().attr('id')})).addRow().find('input-element').focus();
			}
		});
		$('.input-delete').click(function() {
			var td=$(this).parent();
			var tr=$(td).parent();
			if($($(tr).parent()).children().size()>1)tr.remove();
			self.updateData();
		});
		$('.input-element').bind('keyup blur', function(ev) {
			var text=$(this).val();
			//convert it into elemental symbol camelcase
			text=text.toLowerCase().capitalizeFirstLetter();
			console.log(text);
			for(var i=1; i < elements.length; i++) {
				if(elements[i]['symbol']==text){
					$(this).addClass('element-valid').removeClass('element-invalid');
					Help.unregister($(this));//make sure that help isn't called for this element
					//update text (to better capitalization) if it's a blur event
					if(ev.type=="blur")$(this).val(text);
					//update session data
					self.updateData();
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
			self.updateData();
		});
	};
	/**
	 * Makes it so the data can't be updated & stored or something at the same time (to provent corrupted data)
	 */
	self.lockUpdate=false;
	/**
	 * Updates data in Session variable
	 */
	self.updateData = function(){
		if(self.lockUpdate)return;
		self.lockUpdate=true;
		var old=Session.get('input');
		if(ISSET(old)){
			old[self.name]=self.getData();
			Session.set("input", old);
		}else{
			var newDt = {};
			newDt[self.name]=self.getData();
			Session.set("input", newDt);
		}
		//update display
		self.updateLive();
		
		self.lockUpdate=false;
		return;
	};
	//set custom vars
	//set name var
	self.name=args['name'];
	/**
	 * Adds a row to the tbody of the table
	 * @param args basically an array with parameters {element,X,Y,Z}. If not specified, the function will add a blank row. If specified,
	 * 		The function will add a row with the data. Args can be an Atom (specified in jsmol.js)
	 */
	self.addRow = function(args) {
		//make sure self.dom is defined
		if(!ISSET(self.dom)) {
			//get table element
			self.dom = $('table#'+self.name)[0];
		}
		//get table body, to append row in
		var tbody=$(self.dom).find("tbody");
		var newRow;//new TR element to append
		if (!ISSET(args)){
			//add a blank new row
			newRow=$(self.tRow);//generate DOM element from std. template
		} else {
			//add a row with data in it
			if(ISSET(args.type) && args.type == "Atom") {
				//convert Atom into usable data
				args['X']=args.x;
				args['Y']=args.y;
				args['Z']=args.z;
				args['element']=args.atomType;
			}
			newRow = "<tr>\
				<td><font style='color:white;background:red;' class='input-delete'>X</font></td>\
				<td><input type='text' class='input-element input' value='"+args["element"]+"'/></td>\
				<td><input type='text' class='input-X input input-numeric' value='"+args["X"]+"'/></td>\
				<td><input type='text' class='input-Y input input-numeric' value='"+args["Y"]+"'/></td>\
				<td><input type='text' class='input-Z input input-numeric' value='"+args["Z"]+"'/></td>\
				</tr>";
			//convert HTML into a DOM element
			newRow = $(newRow);
		}
		tbody.append(newRow);
			self.updateListeners();
			self.logger.log('Successfully added row!');
			return newRow;
	};
	/**
	 * Loads input from data object. The data object is basically generated from the Input#getData()
	 * @param data: the data to load from
	 * @throws error if data isn't an object
	 */
	self.loadFromData = function(data) {
		if(!ISSET(data, 'object'))throw(new Error('Data is not an object!'));
		//TODO finish
	};
	/**
	 * Loads input from session data
	 * @param refreshSession: whether to reload Session from localstorage
	 */
	self.load = function(refreshSession) {
		if(self.lockUpdate)return;
		self.lockUpdate=true;
		//TODO finish loading script
		try {
			if(ISSET(refreshSession) && refreshSession)Session.load();
			//get data
			var data = Session.get('input')[self.name];
			self.loadFromData(data);
		}  catch(ex) {
			//ignore exception, as it's probably a null pointer error
		} finally {
			self.lockUpdate=false;
		}
	};
	//load if args['load']==true
	if(args['load'])self.load();
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
	/**
	 * Generates data in the format of a .xyz file.
	 */
	self.getXYZData = function(comment) {
		return (new XYZFile(self.getData())).getXYZData(comment);
	};
	self.updateLive = function(comment) {
		JSmolInterface.showXYZ(self.getXYZData());
	};
	/*
	 Determines whether to insert an input inside the DOM (as specified in args.dom)
	*/
	if(ISSET(self.supr=args['dom'])){
		//create input
		//check that the element doesn't already exist (to prevent conflicts)
		if(ISSET($('#'+args['name'])[0]))throw(new Error('Input with specified name \'' + args['name'] + '\' already exists'));
		//add table text
		self.supr.innerHTML="\
			<table border='0px' id=" + self.name + ">\
			<thead><tr><th></th><th>Element</th><th>X</th><th>Y</th><th>Z</th></tr></thead>\
			<tbody></tbody>\
			</table>";
		//set dom attribute
		self.dom=$('#'+self.name);
		//create first row
		self.addRow();
	}
	//return Input object
	return self;
}
//element list. Basically contains a bunch of objects with the chemical symbol, element name, number, and possibly some other information.
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
	{symbol:'Cr',	name:"Chromium",	number: 24},
	{symbol:'Mn',	name:"Manganese",	number: 25},
	{symbol:'Fe',	name:"Iron",		number: 26},
	{symbol:'Co',	name:"Cobalt",		number: 27},
	{symbol:'Ni',	name:"Nickel",		number: 28},
	{symbol:'Cu',	name:"Copper",		number: 29},
	{symbol:'Zn',	name:"Zink",		number: 30},
	{symbol:'Ga',	name:"Gallium",		number: 31},
	{symbol:'Ge',	name:"Germanium",	number: 32},
	{symbol:'As',	name:"Arsenic",		number: 33},
	{symbol:'Se',	name:"Selenium",	number: 34},
	{symbol:'Br',	name:"Bromine",		number: 35},
	{symbol:'Kr',	name:"Krypton",		number: 36},
	{symbol:'Rb',	name:"Rubidium",	number: 37},
	{symbol:'Sr',	name:"Strontium",	number: 38},
	{symbol:'Y',	name:"Ytterbium",	number: 39},
	{symbol:'Zr',	name:"Zirconium",	number: 40},
	{symbol:'Nb',	name:"Niobium",		number: 41},
	{symbol:'Mo',	name:"Molybdenum",	number: 42},
	{symbol:'Tc',	name:"Technetium",	number: 43},
	{symbol:'Ru',	name:"Rutherfordium",	number:44},
	{symbol:'Rh',	name:"Rhodium",		number: 45},
	{symbol:'Pd',	name:"Palladium",	number: 46},
	{symbol:'Ag',	name:"Silver",		number: 47},
	{symbol:'Cd',	name:"Cadmium",		number: 48},
	{symbol:'In',	name:"Indium",		number: 49},
	{symbol:'Sn',	name:"Tin",		number: 50},
	{symbol:'Sb',	name:"Antimony",	number: 51},
	{symbol:'Te',	name:"Tellurium",	number: 52},
	{symbol:'I',	name:"Iodine",		number: 53},
	{symbol:'Xe',	name:"Xenon",		number: 54},
	{symbol:'Cs',	name:"Caesium",		number: 55},
	{symbol:'Ba',	name:"Barium",		number: 56},
	{symbol:'La',	name:"Lanthanum",	number: 57},
	{symbol:'Ce',	name:"Cerium",		number: 58},
	{symbol:'Pr',	name:"Praseodymium",	number: 59},
	{symbol:'Nd',	name:"Neodymium",	number: 60},
	{symbol:'Pm',	name:"Promethium",	number: 61},
	{symbol:'Sm',	name:"Samarium",	number: 62},
	{symbol:'Eu',	name:"Europium",	number: 63},
	{symbol:'Gd',	name:"Gadolinium",	number: 64},
	{symbol:'Tb',	name:"Terbium",		number: 65},
	{symbol:'Dy',	name:"Dysprosium",	number: 66},
	{symbol:'Ho',	name:"Holmium",		number: 67},
	{symbol:'Er',	name:"Erbium",		number: 68},
	{symbol:'Tm',	name:"Thulium", 	number: 69},
	{symbol:'Yb',	name:"Ytterbium",	number: 70},
	{symbol:'Lu',	name:"Lutetium",	number: 71},
	{symbol:'Hf',	name:"Hafnium",		number: 72},
	{symbol:'Ta',	name:"Tantalum",	number: 73},
	{symbol:'W',	name:"Tungsten",	number: 74},
	{symbol:'Re',	name:"Rhenium",		number: 75},
	{symbol:'Os',	name:"Osmium",		number: 76},
	{symbol:'Ir',	name:"Irridium",	number: 77},
	{symbol:'Pt',	name:"Platinum",	number: 78},
	{symbol:'Au',	name:"Gold",		number: 79},
	{symbol:'Hg',	name:"Mercury",		number:	80},
	{symbol:'Tl',	name:"Thallium",	number:	81},
	{symbol:'Pb',	name:"Lead",		number: 82},
	{symbol:'Bi',	name:"Bismuth",		number:	83},
	{symbol:'Po',	name:"Polonium",	number: 84},
	{symbol:'At',	name:"Astatine",	number: 85},
	{symbol:'Rn',	name:"Radon",		number: 86},
	{symbol:'Fr',	name:"Francium",	number: 87},
	{symbol:'Ra',	name:"Radium",		number: 88},
	{symbol:'Ac',	name:"Actinum",		number: 89},
	{symbol:'Th',	name:"Thorium",		number: 90},
	{symbol:'Pa',	name:"Protactinium",	number: 91},
	{symbol:'U',	name:"Uranium",		number: 92},
	{symbol:'Np',	name:"Neptunium",	number: 93},
	{symbol:'Pu',	name:"Plutonium",	number: 94},
	{symbol:'Am',	name:"Americium",	number: 95},
	{symbol:'Cm',	name:"Curium",		number: 96},
	{symbol:'Bk',	name:"Berkelium",	number: 97},
	{symbol:'Cf',	name:"Californium",	number: 98},
	{symbol:'Es',	name:"Einsteinium",	number: 99},
	{symbol:'Fm',	name:"Fermium",		number: 100},//100!!
	{symbol:'Md',	name:"Mendelevium", 	number: 101},
	{symbol:'No',	name:"Nobelium",	number: 102},
	{symbol:'Lr',	name:"Lawrencium",	number: 103},
	{symbol:'Rf',	name:"Rutherfordium",	number: 104},
	{symbol:'Db',	name:"Dubnium",		number: 105},
	{symbol:'Sg',	name:"Seaborgium",	number: 106},
	{symbol:'Bh',	name:"Bohrium",		number: 107},
	{symbol:'Hs',	name:"Hassium",		number: 108},
	{symbol:'Mt',	name:"Meitnerium",	number: 109},
	{symbol:'Ds',	name:"Darmstadtium",	number: 110},
	{symbol:'Rg',	name:"Roentgenium",	number: 111},
	{symbol:'Cn',	name:"Copernicium",	number: 112},
	{symbol:'Uut',	name:"Ununtrium",	number: 113},
	{symbol:'Fl',	name:"Flerovium",	number: 114},
	{symbol:'Uup',	name:"Ununpentium",	number: 115},
	{symbol:'Lv',	name:"Livermorium",	number: 116},
	{symbol:'Uus',	name:"Ununseptium",	number: 117},
	{symbol:'Uuo',	name:"Ununoctium",	number: 118}
];
