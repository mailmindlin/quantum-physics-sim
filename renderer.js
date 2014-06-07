/*
Renderer.js
Requires Utils.js amd Logger.js
*/
/**
 * Creates a 'scene'. A scene contains all the atoms and renderers and stuff
 * for a single simulation. Multiple scenes can be run at a time.
 */
window['Scene'] = function() {
  var self = this;
  self.registry = {};
  self.registry.physicsHandlers = new Array();
  /**
   * Registers a physics handler.
   * @param handler: physics handler to register
   * @param seniority: [Optional, default -1] order at which they are called (higher numbers called first)
   * @see Scene#update(ticks)
   */
  self.registerPhysicsHandler = function(handler, seniority/*optional*/) {
    self.registry.physicsHandlers.push({handler:handler, seniority:(ISSET(seniority)?seniority:-1)});
    return self;//allow for chaining
  };
  /**
   * Updates the scene the specified number of ticks.
   * @param ticks: [Optional, default 1] number of ticks to update.
   * @return errorlevel: 0 is good, -1 or a thrown error is bad.
   */
  self.update = function(ticks) {
  	var logger = Logger.create("renderer.js", "Scene#update");
  	if (ISSET(ticks)) {
  		if(ticks <= 0) {
  			throw(new Error("Called Scene.update(ticks) with ticks=" + ticks + " (ticks must be greater than 0)."));
  			return -1;//probably unreachable code
  		}
  		for(var i = 0; i < ticks; i++) {
  			self.update();
  		}
  		return 0;
  	} else {
  		//order physicsHandlers
  		var handlerArr = {};
  		for(var handlerObj in self.registry.physicsHandlers) {
  			if(typeof handlerArr[handlerObj['seniority']] !== 'object') handlerArr[handlerObj['seniority']] = [];
  			handlerArr[handlerObj['seniority']].push(handlerObj['handler']);
  		}
  		//call physicshandlers, in order.
  		//TODO finish
  	}
  }
  return self;
}
