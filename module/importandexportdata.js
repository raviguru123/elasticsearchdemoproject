"use strict";
let IMPORTDATA=require("../dataAccessLayer/bulkimport"),
EXPORTDATA=require("../dataAccessLayer/bulkexport");

let tables=["profile","party"];
let mappings={};
let tableindex=0;

let migrateData=function(){
	tableindex=tableindex||0;
	if(tableindex<tables.length){
		importdata(tables[tableindex]);	
	}
	else{
		console.log("finish data migrating");
	}
}

let importdata=function(collectionName){
	let limitStart=0,limitEnd=1000;
	function recursive(){
		console.log("importdata",limitStart,limitEnd);
		IMPORTDATA.getData(collectionName,limitStart,limitEnd)
		.then(result1=>{
			preparedata("goparties",collectionName||mappings[collectionName],result1)
			.then(result2=>{
				return exportdata(result2);
			}).then(result3=>{
				limitStart=limitStart+limitEnd;
				if(result1.length==limitEnd){
					recursive();
				}
			});

			if(result1.length>0&&result1.length<1000){
				tableindex++;
				migrateData(tableindex);
			}
		},err=>{
			throw err;
		});
	}
	
	recursive();

}

let preparedata=function(index,type,data){
	var bulkbody=[];
	console.log("preparedata called",index, type);
	return new Promise(function(resolve,reject){
		try{
			for(var i=0;i<data.length;i++){
				var item=data[i];
				bulkbody.push({"index":{
					"_id":item._key,
					"_index":index,
					"_type":type
				}});
				delete item._id;
				bulkbody.push(item);
			}
			resolve(bulkbody);
		}
		catch(e){
			reject(e);
		}
	})
};



function exportdata(data){
	return new Promise(function(resolve,reject){
		EXPORTDATA.bulkexport(data)
		.then(result=>{
			console.log("final result");
			resolve(result);
		},err=>{
			console.log("err",err);
			reject(err);
		});
	});
}



module.exports={
	migrateData
}




