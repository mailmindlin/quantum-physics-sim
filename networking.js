/*
networking.js
Basically allows for multiple computers in close proximity to connect via WebRTC and act as a supercomputer.
I should actually put this in a separate repository, but stuff would get complicated.
Requires connection.js
*/

window['Node'] = function() {
  var self=this;
  self.connection = new DataConnection();
  self.userId = self.connection.userid;
  self.connection.onopen = function(e) {console.log(e);};
  self.messageReciever = function() {};
  self.setMessageReciever = function(reciever) {
    self.messageReciever = reciever;
    self.connection.onmessage = reciever;
  };
  self.sendData = function(data, reciever) {
  	
  }
  return self;
};
window['RemoteNode'] = function() {
	
};
/**
 * Abstract network object. Use one of the other network objects.
*/

window['Network'] = function(name) {
  var self = this;
  self.name=name;
  self.parents=[
  'Object',
  'Network'
  ];
  self.channel=
  self.process=function() {
    //Abstract
    throw(new Error("Someone tried to use an abstract function in Network.\nUse a non abstract version (i.e., ManagedNetwork or DynamicNetwork)!"));
  };
  return self;
};
/**
 * A child of Network, that is a static, predefined network of computers.
 */
window['ManagedNetwork'] = function(name, setup) {
  var self = new Network(name);
  
  return self;
};
/**
 * Uses geolocation/ping times to determine the fastest network, and can change dynamically (hence it's name)
 */
window['DynamicNetwork'] = function(name, ) {
  var self = new Network();
  
  return self;
};
