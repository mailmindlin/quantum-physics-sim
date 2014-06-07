/*
networking.js
Basically allows for multiple computers in close proximity to connect via WebRTC and act as a supercomputer.
I should actually put this in a separate repository, but stuff would get complicated.
*/
/**
 * Abstract network object. Use one of the other network objects.
*/
window['Network'] = function() {
  var self = this;
  self.parents=[
  'Object',
  'Network'
  ];
  
  self.process=function() {
    //Abstract
    throw(new Error("Someone tried to use an abstract function in Network.\nUse a non abstract version (i.e., ManagedNetwork or DynamicNetwork)!");
  };
  return self;
};
/**
 * A child of Network, that is a static, predefined network of computers.
 */
window['ManagedNetwork'] = function() {
  var self = new Network();
  return self;
};
/**
 * Uses geolocation/ping times to determine the fastest network, and can change dynamically (hence it's name)
 */
window['DynamicNetwork'] = function() {
  var self = new Network();
  
  return self;
};
