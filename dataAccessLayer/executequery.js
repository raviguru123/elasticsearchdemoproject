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


let searchscroll=function(body,index,types){
	return new Promise(function(resolve,reject){
		client.search({
			"index":index,
			"type":types,
			"scroll":"20m",
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


let getDocumentbyid=function(index,type,id){
	client.get({
		index:index,
		type:type,
		id:id
	}, function(err, data) {
		console.log('json reply received');
	});
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
	getDocumentbyid,
	searchexecute,
	searchscroll,
	scroll
}