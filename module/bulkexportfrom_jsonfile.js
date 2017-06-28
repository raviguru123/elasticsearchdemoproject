let fs=require("fs");
var dataAccessLayerbulkexport=require("../dataAccessLayer/bulkexport");

function transferdata(path,index,type){
	return new Promise(function(response,reject){
		fs.readFile(path,'utf8',function(err,data){
			data=JSON.parse(data);
			
			console.log("file read");
			preparedataforExport(data,index,type).then(dataarry=>{
				//console.log("dataarry",dataarry[0]);
				calldataAccesslayerforExport(dataarry).then(result=>{
					response("true");
				},err=>{
					console.log("error occured in data fire");
				});
			},err=>{

			});
		});
	});
}


function preparedataforExport(data,indexname,type){
	return new Promise(function(response,reject){
		var bulkbody=[];
		var preparedata=function(){

			for(var i=0;i<10;i++){
				var item=data[i];
				bulkbody.push({"index":{
					"_id":item.id,
					"_index":indexname,
					"_type":type
				}});

				bulkbody.push(item);
				
			}
		};
		//console.log("before");
		preparedata();
		//console.log("after",bulkbody[0]);
		response(bulkbody);
	});
}


function calldataAccesslayerforExport(data){
	return new Promise(function(response,reject){

		// fs.writeFile("./jsonfiles/data1.json", JSON.stringify(data),"utf8",function(err,data){
		// });
		
		dataAccessLayerbulkexport.bulkexport(data)
		.then(result=>{
			response("success in preparedataforExport");
		},err=>{
			reject("err occured in preparedataforExport");
		})
	})
}


module.exports={
	transferdata
}

