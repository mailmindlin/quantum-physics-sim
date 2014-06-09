/*
Logger.js
Versatile logger. Create a logger for something, and log with it, and you can determine what to let through at runtime
*/
window['Logger'] = {
  whitelist: [],
  blacklist: [],
  useWhitelist: false,
  allow: function(file, obj, method) {
    for(var item in Logger.blacklist ) {
      if(item.matches(file, obj, method)) return false;
    }
    if(Logger.useWhitelist) {
      for(var item in Logger.whitelist) {
        if(item.matches(file, obj, method)) return true;
      }
    }else{
      return true;
    }
    return false;
  },
  create: function(file, obj){
    var self=this;
    self.obj=obj;
    self.file=file;
    self.log=function(stuff){
      if(window['Logger'].allow(self.file,self.obj, 'log')){
      	try{
      		stuff=(ISSET(stuff,'object')?JSON.stringify(stuff):stuff);
      	}finally{
        	console.log(window['Logger'].getPrefix(self.file, self.obj, 'log')+stuff);
        }
      }
    }
    self.err=function(stuff){
      if(window['Logger'].allow(self.file,self.obj, 'err')){
        console.error(window['Logger'].getPrefix(self.file, self.obj, 'err')+stuff);
      }
    }
    return self;
  },
  getPrefix: function(file, obj, method) {
    return (method=='log'?"":method+" ")+(ISSET(file)?file+">":"")+obj+":";
  }
};
