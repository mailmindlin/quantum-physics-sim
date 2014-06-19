/*WebWorkers.js*/
var window = this;
if (window.document === undefined) {
	//setup as webworker
	window.onmessage = function(ev) {
		postMessage(ev);
	};
} else {
	window['WebWorker'] = function() {
		var self = this;
		self.worker = new Worker("webworkers.js");
		self.onWorkerMessage = function(ev) {
			console.log(ev);
		};
		self.setup = function() {
			myWorker.addEventListener("message", self.onWorkerMessage, false);
		};
		return self;
	};
}
