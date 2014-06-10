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
	{symbol:'Te',	name:""},
	{symbol:'I',	name:""},
	{symbol:'Xe',	name:""},
	{symbol:'Cs',	name:"Cesium"},
	{symbol:'Ba',	name:""},
	{symbol:'La',	name:""},
	{symbol:'Ce',	name:""},
	{symbol:'Pr',	name:""},
	{symbol:'Nd',	name:""},
	{symbol:'Pm',	name:"Promethium"},
	{symbol:'Sm',	name:"Samarium"},
	{symbol:'Eu',	name:"Europium"},
	{symbol:'Gd',	name:"Gadolinium"},
	{symbol:'Tb',	name:"Terbium"},
	{symbol:'Dy',	name:"Dysprosium"},
	{symbol:'Ho',	name:"Holmium"},
	{symbol:'Er',	name:"Erbium"},
	{symbol:'Tm',	name:"Thulium", number: 69},
	{symbol:'Yb',	name:"Ytterbium"},
	{symbol:'Lu',	name:"Lutetium"},
	{symbol:'Hf',	name:"Hafnium"},
	{symbol:'Ta',	name:"Tantalum"},
	{symbol:'W',	name:"Tungsten"},
	{symbol:'Re',	name:"Rhenium"},
	{symbol:'Os',	name:"Osmium"},
	{symbol:'Ir',	name:"Irridium"},
	{symbol:'Pt',	name:"Platinum"},
	{symbol:'Au',	name:"Gold"},
	{symbol:'Hg',	name:"Mercury"},
	{symbol:'Tl',	name:""},
	{symbol:'Pb',	name:"Lead"},
	{symbol:'Bi',	name:""},
	{symbol:'Po',	name:""},
	{symbol:'At',	name:""},
	{symbol:'Rn',	name:"Radon"},
	{symbol:'Fr',	name:"Francium"},
	{symbol:'Ra',	name:"Radium"},
	{symbol:'Ac',	name:"Actinum"},
	{symbol:'Th',	name:"Thorium"},
	{symbol:'Pa',	name:"Protactinium"},
	{symbol:'U',	name:"Uranium"},
	{symbol:'Np',	name:"Neptunium"},
	{symbol:'Pu',	name:"Plutonium"},
	{symbol:'Am',	name:"Americium"},
	{symbol:'Cm',	name:"Curium"},
	{symbol:'Bk',	name:"Berkelium"},
	{symbol:'Cf',	name:"Californium"},
	{symbol:'Es',	name:"Einsteinium"},
	{symbol:'Fm',	name:"Fermium"},//100!!
	{symbol:'Md',	name:"Mendelevium"},
	{symbol:'No',	name:"Nobelium"},
	{symbol:'Lr',	name:"Lawrencium"},
	{symbol:'Rf',	name:"Rutherfordium"},
	{symbol:'Db',	name:"Dubnium"},
	{symbol:'Sg',	name:"Seaborgium"},
	{symbol:'Bh',	name:"Bohrium"},
	{symbol:'Hs',	name:"Hassium"},
	{symbol:'Mt',	name:"Meitnerium"},
	{symbol:'Ds',	name:"Darmstadtium"},
	{symbol:'Rg',	name:"Roentgenium"},
	{symbol:'Cn',	name:"Copernicum"},
	{symbol:'Uut',	name:"Ununtritium"},
	{symbol:'Fl',	name:"Flerovium"},
	{symbol:'Uup',	name:"Ununpentium"},
	{symbol:'Lv',	name:"Livermorium"},
	{symbol:'Uus',	name:"Ununseptium"},
	{symbol:'Uuo',	name:"Ununoctium"}
];