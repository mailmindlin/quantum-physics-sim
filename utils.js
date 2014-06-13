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
//std string functions
/**
 * Determines whether the string starts with the substring needle.
 */
String.prototype.startsWith = function(needle) {
	return this.indexOf(needle) == 0;
};
/**
 * Determines whether the string contains the substring needle.
 */
String.prototype.contains = function(needle) {
	return this.indexOf(needle) >= 0;
};
/**
 * Capotalizes the first letter of the string.
 */
String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * Adds newLn as a new line
 */
String.prototype.pushLn = function(newLn) {
	return this +  newLn + "\n";
};