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

module.exports={
	searchexecute
}