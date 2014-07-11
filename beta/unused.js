//Unused code that might be useful later
			 //from Loader
			 self.db		  = new DBInterface({
					dbName: "ScriptDB",
					version: 1,
					tables: [{name: "Files",
						keyPath:"Name",
						fields: [{name:"Name", args:{unique: true}},
							{name:"Version", args:{unique: false}},
							{name:"Data",args:{unique: false}}]}]
					});
										//TODO: get db to work
					/*self.db.get("Files", name, function(dbOut){
						console.log(dbOut);
						if(typeof dbOut !== 'undefined') {
							var element = document.createElement('script');
							element.setAttribut('type','text/javascript');
							element.innerText=dbOut.data;
							document.getElementsByTagName("head")[0].appendChild(fileref);
						}else{
							//do ajax
						}
					});*/
