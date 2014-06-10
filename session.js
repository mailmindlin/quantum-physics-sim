/*
  Stores data to be session-independent
*/
var Session = (function() {
  var iData={};
  iData['session-name']="Session";
  iData['autosave']=true;
  function update() {
    if(iData['autosave'])save();
  }
  return {
    set: function(k,v){iData[k]=v;update();},
    get: function(k){return iData[k];},
    setName: function(n){set('session-name',n);},
    getName: function(){return get('session-name');},
    getAll: function(){return iData;},
    load: function(n) {iData=JSON.parse(window.localStorage.getItem(n));set('session-name',n);},
    save: function(n) {window.localStorage.setItem((typeof n !== 'undefined')?n:get('session-name'), JSON.stringify(iData));}
  };
})();
