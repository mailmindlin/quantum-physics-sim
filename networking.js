/*
networking.js
Basically allows for multiple computers in close proximity to connect via WebRTC and act as a supercomputer.
I should actually put this in a separate repository, but stuff would get complicated.
Requires connection.js
*/
//Networking module

/**
 * A single computer in the network
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
/**
 * An object representing a remote node (another node that can be communicated via webRTC)
 */
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
window['DynamicNetwork'] = function(name, setup) {
  var self = new Network();
  
  return self;
};
//TODO: maybe move this to another file (i.e., utils.js)
/**
 * Allows for applying simple XOR encryption. TODO: maybe replace with crypto-js???
 */
window['Encryption'] = function(Key) {
	var self = Object.create(null);
	self.key=Key;
	self.xor = function(data) {
		//thanks to http://th.atguy.com/mycode/xor_js_encryption/
		var result="";//the result will be here
		for(var i = 0; i < data.length; i++){
			resilt+=String.fromCharCode(self.key^data.charCodeAt(i));
		}
		return result;
	};
};
/**
 * Basically makes a sandbox that the specified function can run in, that loses access to many external resources.
 */
window['Sandbox'] = function(fn) {
	this.rtVal=undefined;
	var sprWinNum=Math.random().replace('.','');//make the window variable random
	eval("{var _"+sprWinNum+"=window;\
		var window=document=Window=Document=$=Navigator=navigator==Object.create();\
		_"+sprWinNum+".Sandbox.rtVal=("+sfn+")();}");
	return this.rtVal;
};
window['LocalOrigin'] = "ABCD";//TODO: fix origin generation (maybe do base 64 string from random number (seed could be from geolocation)
/**
 * A 
 */
window['Problem'] = function(name, origin, parts, encKey) {
	var self = Object.create(null);
	//define constants
	//define variables
	//set rt variables
	self.name	= name;
	self.origin	= origin;
	self.parts	= parts;
	self.encKey	= encKey;
	self.stat	= -1;
	self.parts	= parts;
	//define functions
	self.queue = function() {
		
	};
	
	return self;
};
window['Part'] = function(data) {
	if(typeof data !== 'object')throw(new Error("Data was not an object!"));
	var self = Object.create(null);
	//vardef
	if(ISSET(data.isSerialized) && data.isSerialized) {
		self.wasSerialized=true;
		var enc = new Encryption(data.encKey);
		//deserialize object
		var deserialized = JSON.parse(enc.xor(data.sData));
		self.sfn = deserialized.sfn;
		self.fn = function(){Sandbox(self.sfn);};//basically just call the function in eval. BTW: sorry for using eval.
		self.name = data.name;
	} else {
		self.wasSerialized=false;
		self.fn = data.fn;
		self.sfn = ISSET(data.sfn)?data.sfn:(self.fn+'');
		if(ISSET(data.origin)) {
			self.isLocal=(data.origin==LocalOrigin);
			self.origin=data.origin;
		}
		if(ISSET(data.name)) self.name = data.name;
	}
	//funcdef
	self.serialize = function() {
		var temp = Object.create(null);
		self.sfn = (temp.sfn = ISSET(self.sfn)?self.sfn:(self.fn+''));
		temp.origin=self.origin;
	};
	self.run = function() {
		
	};
	return self;
};
window['Communicator'] = function() {
	function trace(text) {
		console.log((performance.now() / 1000).toFixed(3) + ": " + text);
	}
	var self = Object.create(null);
	self.setup = function() {
		var servers = null;
		self.localPeerConnection = new webkitRTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
		trace("Creacted localPeerConnection");
		try {
			// Reliable Data Channels not yet supported in Chrome
			self.sendChannel = self.localPeerConnection.createDataChannel("sendDataChannel", {reliable: false});
			trace('Created send data channel');
		} catch (e) {
			alert('Failed to create data channel. You need Chrome M25 or later with RtpDataChannel enabled');
			trace('createDataChannel() failed with exception: ' + e.message);
		}
		self.localPeerConnection.onicecandidate 	= self.gotLocalCandidate;
		self.sendChannel.onopen				= self.handleSendChannelStateChange;
		self.sendChannel.onclose			= self.handleSendChannelStateChange;
		self.remotePeerConnection			= new webkitRTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
		trace('Created remote peer connection object remotePeerConnection');
	
		self.remotePeerConnection.onicecandidate	= self.gotRemoteIceCandidate;
		self.remotePeerConnection.ondatachannel		= self.gotReceiveChannel;
		
		self.localPeerConnection.createOffer(gotLocalDescription);
		return self;
	};
	self.gotRemoteIceCandidate = function(e) {
		console.log(e);
	};
	self.gotRecieveChannel = function(e) {
		console.log(e);
	};
	self.handleSendChannelStateChange = function(e) {
		console.log(e);
	};
	self.sendData = function(data) {
		self.sendChannel.send(data);
		trace('Sent data: ' + data);
	};
	self.gotLocalDescription = function(desc) {
		self.localPeerConnection.setLocalDescription(desc);
		trace('Offer from localPeerConnection \n' + desc.sdp);
		self.remotePeerConnection.setRemoteDescription(desc);
		self.remotePeerConnection.createAnswer(self.gotRemoteDescription);
	};
	self.closeDataChannels = function() {
		var t0=new Date();
		trace('Closing data channels');
		sendChannel.close();
		trace('Closed data channel with label: ' + sendChannel.label);
		receiveChannel.close();
  		trace('Closed data channel with label: ' + receiveChannel.label);
		localPeerConnection.close();
		remotePeerConnection.close();
		localPeerConnection = null;
		remotePeerConnection = null;
		trace('Closed peer connections ('+((new Date())-t0) + 'ms).');
	};
	/**
	 * Handles event when message is recieved.
	 */
	self.handleMessage = function(event) {
		trace('Received message: ' + event.data);
		console.log(event);
	};
	return self;
};
