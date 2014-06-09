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
		<td><input type='text' class='input-X input'/></td>\
		<td><input type='text' class='input-Y input'/></td>\
		<td><input type='text' class='input-Z input'/></td>\
		</tr>"
		.replace('\t','');//remove all tabs
	self.updateListeners = function() {
		//remove old listener(s)
		$('.input-Z').off('keydown');
		$('.input-delete').off('click');
		
		$('.input-Z').keydown(function(ev) {
			if(ev.keyCode!=9)return;//9 is tab key	
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
			if($(this).parent().
			var td=$(this).parent()
			var tr=$(td).parent()
			if($($(tr).parent()).children().size()>0)tr.remove();
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
			self.dom=$('table#'+self.name)[0];
		}
		//get table body, to append row in
		var tbody=$(self.dom).find("tbody");
		var newRow=$(self.tRow);
		tbody.append(newRow);
		self.updateListeners();
		self.logger.log('Successfully added row!');
		return newRow;
	};
	if(ISSET(self.supr=args['dom'])){
		//create input
		//check that the element doesn't already exist (to prevent conflicts)
		if(ISSET($('#'+args['name'])[0]))throw(new Error('Input with specified name \'' + args['name'] + '\' already exists'));
		//add table text
		self.supr.innerHTML="\
			<table id=" + self.name + ">\
			<thead><tr><th>Element</th><th>X</th><th>Y</th><th>Z</th></tr></thead>\
			<tbody></tbody>\
			</table>";
		//set dom attribute
		self.dom=$('#'+self.name);
		//create first row
		self.addRow();
	}
	return self;
}