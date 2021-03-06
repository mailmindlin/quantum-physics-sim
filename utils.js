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

window.FileDownloader = function(data, MIME) {
	var self = Object.create(null);
	self.data = encodeURIComponent(data);
	self.mime = MIME;
	self.download = function(filename) {
		//creds and thanks to http://paxcel.net/blog/savedownload-file-using-html5-javascript-the-download-attribute-2/

		var uri = 'data:' + self.mime + ';charset=utf-8,' + self.data;

		//For IE
		if (navigator.appName == "Microsoft Internet Explorer") {
			myFrame.document.open("text/html", "replace");
			myFrame.document.write(uuu);
			myFrame.document.close();
			myFrame.focus()
			myFrame.document.execCommand('SaveAs', true, filename);
		} else {
			//Other browsers
			$('#btnExport').attr({'href': uri, 'target': '_blank' });
		}
	};
	return self;
};
