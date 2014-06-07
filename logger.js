/*
Logger.js
Versatile logger. Create a logger for something, and log with it, and you can determine what to let through at runtime
*/
window['Logger'] = {
  allow: function(file, obj, method) {
    return true;//Add something in here to filter it.
  },
  create: function(file, obj){
    var self=this;
    self.obj=obj;
    self.file=file;
    self.log=function(stuff){
      if(window['Logger'].allow(self.file,self.obj, 'log')){
        console.log(window['Logger'].getPrefix(self.file, self.obj, 'log')+stuff);
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
    return (method=='log'?"":method+" ")+file+">"+obj+":";
  }
};
