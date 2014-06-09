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
			for(var i=0; i < elements.length; i++) {
				if(elements[i]==text){
					$(this).addClass('element-valid').removeClass('element-invalid');
					Help.unregister($(this));
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
			} else {
				$(this).removeClass('element-valid').addClass('element-invalid');
				Help.register($(this), "You need to type in a valid number");
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
	'',//allow for blank slots
	'H',
	'He',
	'Li',
	'Be',
	'B',
	'C',
	'N',
	'O',
	'F',
	'Ne',
	'Na',
	'Mg',
	'Al',
	'Si',
	'P',
	'S',
	'Cl',
	'Ar',
	'K',
	'Ca',
	'Sc',
	'Ti',
	'V',
	'Cr',
	'Mn',
	'Fe',
	'Co',
	'Ni',
	'Cu',
	'Zn',
	'Ga',
	'Ge',
	'As',
	'Se',
	'Br',
	'Kr',
	'Rb',
	'Sr',
	'Y',
	'Zr',
	'Nb',
	'Mo',
	'Tc',
	'Ru',
	'Rh',
	'Pd',
	'Ag',
	'Cd',
	'In',
	'Sn',
	'Sb',
	'Te',
	'I',
	'Xe',
	'Cs',
	'Ba',
	'La',
	'Ce',
	'Pr',
	'Nd',
	'Pm',
	'Sm',
	'Eu',
	'Gd',
	'Tb',
	'Dy',
	'Ho',
	'Er',
	'Tm',
	'Yb',
	'Lu',
	'Hf',
	'Ta',
	'W',
	'Re',
	'Os',
	'Ir',
	'Pt',
	'Au',
	'Hg',
	'Tl',
	'Pb',
	'Bi',
	'Po',
	'At',
	'Rn',
	'Fr',
	'Ra',
	'Ac',
	'Th',
	'Pa',
	'U',
	'Np',
	'Pu',
	'Am',
	'Cm',
	'Bk',
	'Cf',
	'Es',
	'Fm',//100!!
	'Md',
	'No',
	'Lr',
	'Rf',
	'Db',
	'Sg',
	'Bh',
	'Hs',
	'Mt',
	'Ds',
	'Rg',
	'Cn',
	'Uut',
	'Fl',
	'Uup',
	'Lv',
	'Uus',
	'Uuo'
];