/*
input.js
For textual data inputs
*/
function Input(args) {
	if((!ISSET(args['name'])) && (!ISSET(args,'String')))throw(new Error("You need to specify name!"));
	if(ISSET(args, 'String'))args['name']=args;
	var self = this;
	self.logger=new Logger.create('input.js', 'Input');
	//constants
	//table row
	self.tRow="<tr>\
	<td><input type='text' class='input-element input'/></td>\
	<td><input type='text' class='input-X input'/></td>\
	<td><input type='text' class='input-Y input'/></td>\
	<td><input type='text' class='input-Z input'/></td>\
	</tr>";
	
	//set custom vars
	//set name var
	self.name=args['name'];
	//Adds a row to the tbody of the table
	self.addRow=function(){
		if(!ISSET(self.dom)){
			//get table element
			self.dom=$('table#'+self.name)[0];
		}
		var tbody=$(self.dom).find("tbody");
		tbody.append($(self.tRow));
		self.logger.log('Successfully added row!');
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