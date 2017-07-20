let client=require("../elasticsearchConnection");
let searchexecute=function(body,index,types){
	return new Promise(function(resolve,reject){
		client.search({
			"index":index,
			"type":types,
			"body":body
		},function(err,data){
			if(err){
				reject(err);
			}
			else{
				resolve(data);
			}
		})
	})
}

let scroll=function(data){
	return new Promise(function(resolve,reject){
		console.log("scroll request hit");
		client.scroll({
			scrollId:data.scrollId,
			scroll:data.time
		},function(err,body){
			if(err){
				reject(err);
			}
			else{
				resolve(body);
			}
		})
	});
}



module.exports={
	searchexecute,
	scroll
}