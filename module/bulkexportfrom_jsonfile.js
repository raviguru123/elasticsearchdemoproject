"use strict";

let fs=require("fs");
var dataAccessLayerbulkexport=require("../dataAccessLayer/bulkexport");

function transferdata(path,index,type){
	return new Promise(function(resolve,reject){
		fs.readFile(path,'utf8',function(err,data){
			data=JSON.parse(data);
			
			console.log("file read");
			preparedataforExport(data,index,type).then(dataarry=>{
				calldataAccesslayerforExport(dataarry).then(result=>{
					resolve(result);
				},err=>{
					console.log("error occured in data fire");
				});
			},err=>{

			});
		});
	});
}


function preparedataforExport(data,indexname,type){
	return new Promise(function(resolve,reject){
		var bulkbody=[];
		var preparedata=function(){

			for(var i=0;i<data.length;i++){
				var item=data[i];
				bulkbody.push({"index":{
					"_id":item._key,
					"_index":indexname,
					"_type":type
				}});
				delete item._id;
				bulkbody.push(item);
				
			}
		};
		//console.log("before");
		preparedata();
		//console.log("after",bulkbody[0]);
		resolve(bulkbody);
	});
}


function calldataAccesslayerforExport(data){
	return new Promise(function(resolve,reject){

		
		
		dataAccessLayerbulkexport.bulkexport(data)
		.then(result=>{
			fs.writeFile("./jsonfiles/data1.json", JSON.stringify(result),"utf8",function(err,data){
			});
			resolve(result);
		},err=>{
			reject("err occured in preparedataforExport");
		})
	})
}


module.exports={
	transferdata
}

