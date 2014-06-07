/*
Utils.js
Standard utilities.
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
String.prototype.startsWith = function(needle) {
	return this.indexOf(needle) == 0;
};
String.prototype.contains = function(needle) {
	return this.indexOf(needle) >= 0;
};
