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
	data.query=data.query||'party spot';

	console.log("data.keyword",data);

	return new Promise(function(resolve,reject){
		console.log("autocomplete query hit");
		client.search({
			body:{
				"_source":["title","name","about","address"],
				"query": {
					"multi_match": {
						"query":data.query,
						"type": "best_fields",
						"fields": [
						"title",
						"profile_type",
						"name",
						"address"
						]
					}
				}
			}
		}).then(function(body){
			resolve(body);
		},function(err){
			reject(err);
		});
	})
}

module.exports=
{
	search,
	autocomplete
};
