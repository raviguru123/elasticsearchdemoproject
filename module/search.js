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
		
		return new Promise(function(resolve,reject){
			data.text=data.text||'party';
			console.log("search request hit",data);
			client.search({
				index:"goparties",
				scroll: '60s',
				body:{
					"query": {
						"bool": {
							"must": [
							{
								"multi_match":
								{
									"query": data.text,
									"fields": ["title","name","profile_type"]
								}
							}
							]
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
	console.log("data.query",data.query);
	data.query=data.query||"party";
	return new Promise(function(resolve,reject){
		client.search({
			index:"goparties2",
			body:{
				"_source": [
				"title",
				"name",
				"about",
				"profile_type",
				"_id"
				],
				"query": {
					"bool": {
						"must": [
						{
							"multi_match": {
								"query": data.query,
								"analyzer": "standard",
								"fields": [
								"title^2",
								"name"
								]
							}
						}

						],
						"should": [
						{
							"match_phrase_prefix": {
								"title": {
									"query":data.query,
									"max_expansions":50
								}
							}
						},
						{
							"match_phrase_prefix":{
								"name": {
									"query":data.query,
									"max_expansions":50
								}
							}
						}
						]
					}
				},
				"highlight": {
					"fields": {
						"title": {},
						"name": {}
					}
				}
			}

		}).then(function(data1){
			return preparedata(data1.hits.hits);
		}).then(function(data2){
			resolve(data2)
		},function(err){
			reject(err);
		});;
	})
}

function preparedata(data){
	return new Promise(function(resolve,reject){
		//console.log("prepare data function call");
		var suggesations=[];
		var duplicatecheck={};
		data.forEach(function(item,index){

			let highlight=item.highlight;
			for (var key in highlight) {
				if (highlight.hasOwnProperty(key)) {
					var val = highlight[key];
					if(duplicatecheck[val]==undefined){
						duplicatecheck[val]=val;
						suggesations.push({
							display:item._source[key],
							value:val[0],
							watchers:val[0],
							name:val[0],
							forks:val[0],
							url:val[0]
						});
					}
					else{

					}

				}
			}
		});

		resolve(suggesations);
	});
}



module.exports=
{
	search,
	autocomplete
};
