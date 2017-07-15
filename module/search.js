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
				index:"goparties5",
				type:"party",
				scroll: '60s',
				body:{
					"query": {
						"bool": {
							"must": [
							{
								"multi_match":
								{
									"query": data.text,
									"fields": ["_all"]
								}
							}
							],
							"should":[
							{
								"multi_match":{
									"query": data.text,
									"fields": ["name","profile_type","title"]
								}
							}
							],
							"filter": [
							{
								"bool": {
									"should": [
									{
										"bool": {
											"must": [
											{
												"exists": {
													"field": "startdate"
												}
											}
											],
											"filter": {
												"range": {
													"startdate": {
														"gte":new Date().getTime()
													}
												}
											}
										}
									},
									{
										"bool": {
											"must_not": [
											{
												"exists": {
													"field": "startdate"
												}
											}
											]
										}
									}
									]
								}
							}
							]
						}
					}
				}
			},function(err,body){
				if(err)
				{
					reject(err);
				}
				else{
					resolve(body);
				}

			})
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
			scroll:"1s"
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


let autocomplete=function(data){
	console.log("data.query",data.query);
	data.query=data.query||"party";
	return new Promise(function(resolve,reject){
		client.search({
			index:"goparties5",
			type:"party,profile",
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
								"analyzer": "autocomplete",
								"fields": [
								"name.autosuggesation",
								"title.autosuggesation"
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
						},
						{
							"multi_match":{
								"query": data.query,
								"analyzer": "french",
								"fields": [
								"name.autosuggesation",
								"title.autosuggesation"
								]
							}
						},
						{
							"multi_match":{
								"query": data.query,
								"fields": [
								"name",
								"title"
								]
							}
						}
						],
						"filter": [
						{
							"bool": {
								"should": [
								{
									"bool": {
										"must": [
										{
											"exists": {
												"field": "startdate"
											}
										}
										],
										"filter": {
											"range": {
												"startdate": {
													"gte":new Date().getTime()
												}
											}
										}
									}
								},
								{
									"bool": {
										"must_not": [
										{
											"exists": {
												"field": "startdate"
											}
										}
										]
									}
								}
								]
							}
						}
						]
					}
				},
				"highlight": {
					"fields": {
						"title.autosuggesation": {},
						"name.autosuggesation": {}
					}
				}
			}

		},function(err,data1){
			return preparedata(data1.hits.hits).then(function(data2){
				resolve(data2)
			},function(err){
				reject(err);
			});;
		})

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
							display:item._source[key.split(".")[0]],
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
