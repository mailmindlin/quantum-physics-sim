/*
  Stores data to be session-independent
*/
window.Session = (function() {
  var iData;
  iData = {};
  iData['session-name']="Session";
  iData['autosave']=true;
  function update() {
    if(iData['autosave'])iSave();
  }
  function iSave(n){
    window.localStorage.setItem((typeof n !== 'undefined')?n:iData['session-name'], JSON.stringify(iData));
  }
  return {
    set: function(k,v){iData[k]=v;update();},
    get: function(k){return iData[k];},
    setName: function(n){iData['session-name']=n;},
    getName: function(){return iData['session-name'];},
    getAll: function(){return iData;},
    load: function(n) {iData=JSON.parse(window.localStorage.getItem((typeof n !== 'undefined')?n:(n='Session')));iData['session-name']=n;},
    save: function(n) {iSave(n);}
  };
})();
window.addEventListener("beforeunload",function() {Session.save();}, true); 