let client=require("../elasticsearchConnection");

let search=function(data){
	return new Promise(function(resolve,reject){
		getdata(data).then(result=>{
			resolve(result);
		},err=>{
			reject(err);
		})
	});
}

let getdata=function(data){
	if(data.scrollId==undefined){
		console.log("search request hit");
		return new Promise(function(resolve,reject){
			client.search({
				index:"goparties",
				scroll: '60s',
				body:{
					"query":{
						"bool":{
							"must":
							[{
								"match_all":{}
							}]
						}
					}
				}
			}).then(function(body){
				resolve(body);
			},function(err){
				reject(err);
			});
		});
	}
	else{
		return scroll(data);
	}
}


let scroll=function(data){
	return new Promise(function(resolve,reject){
		console.log("scroll request hit");
		client.scroll({
			scrollId:data.scrollId,
			scroll:"60s"
		}).then(function(body){
			resolve(body);
		},function(err){
			reject(err);
		});
	});
}


let autocomplete=function(data){
	return new Promise(function(resolve,reject){
		client.search({
			body:{
				"query": {
					"multi_match": {
						"query": "j",
						"type": "best_fields",
						"fields": [
						"title",
						"name",
						"about",
						"address"
						]
					}
				}
			}
		})
	})
}

module.exports=
{
	search
};
