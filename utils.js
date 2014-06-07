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
}
