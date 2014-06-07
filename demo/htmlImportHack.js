/*
Takes HTML imports that have a param of 'pseudotype' and converts them into scripts and whatnot.
*/
function start() {
	var promises = $('link[rel="import"][pseudotype]').promise();
	console.log(promises);
}
start();
