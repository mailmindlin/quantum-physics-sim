/*
  Stores data to be session-independent
*/
var Session = (function() {
  var iData={};
  function update() {
    
  }
  return {
    set: function(k,v){iData[k]=v;update();},
    get: function(k){return iData[k];},
    getAll: function(){return iData;},
    load: function(name) {iData=window.localStorage.getItem(name);},
    save: function(name) {window.localStorage.setItem(name, iData);}
  };
})();
