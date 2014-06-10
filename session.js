/*
  Stores data to be session-independent
*/
var Session = (function() {
  var iData={};
  var name="Session-1";
  function update() {
    
  }
  return {
    set: function(k,v){iData[k]=v;update();},
    get: function(k){return iData[k];},
    setName: function(n){
      name=n
    },
    getName: function(){return name;},
    getAll: function(){return iData;},
    load: function(n) {iData=JSON.parse(window.localStorage.getItem(n));name=n;},
    save: function(n) {window.localStorage.setItem((typeof n !== 'undefined')?n:name, JSON.stringify(iData));}
  };
})();
