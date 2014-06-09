/*
input.js
For textual data inputs
*/
function Input(args) {
	if((!ISSET(args['name'])) && (!ISSET(args,'String')))throw(new Error("You need to specify name!"));
	if(ISSET(args, 'String'))args['name']=args;
	var self = this;
	//constants
	self.tRow="<tr>\
	<td><input type='text' class='input-element input'/></td>\
	<td><input type='text' class='input-X input'/></td>\
	<td><input type='text' class='input-Y input'/></td>\
	<td><input type='text' class='input-Z input'/></td>\
	</tr>";
	
	self.name=args['name'];
	self.addRow=function(){
		if(ISSET(self.dom)){
		
		}else{
			self.dom=$('table#'+self.name);
			
		}
	};
	if(ISSET(args['dom'])){
		self.dom=dom;
		dom.innerHTML="\
			<table id="+args['name']+">\
			<thead><tr><th>Element</th><th>X</th><th>Y</th><th>Z</th></tr></thead>\
			<tbody></tbody>\
			</table>";
		
	}
	return self;
}