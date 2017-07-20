let EXECUTEQUERY=require("../dataAccessLayer/executequery");
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
			console.log("search request hit",data);
			
			data.text=data.text||'party';
			data.type=data.type||'party,profile';
			let body={},query;
			//body.scroll="1s";
			
			query={
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
							"fields": ["name","title^5"]
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

			body.query=query;
			executepartysearchscroll(body,"goparties_search",data.type)
			.then(result=>{
				resolve(result);
			}).catch(err=>{
				reject(err);
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
		data.time="1s";
		EXECUTEQUERY.scroll(data)
		.then(result=>{
			resolve(result);
		}).catch(err=>{
			reject(err);
		});
	});
}


let autocomplete=function(data){
	console.log("data.query",data.query);
	data.query=data.query||"party";
	return new Promise(function(resolve,reject){
		let body={},query;
		query={
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
		}


		body._source=[
		"title",
		"name",
		"about",
		"profile_type",
		"_id"
		];

		
		body.highlight=	 {
			"fields": {
				"title.autosuggesation": {},
				"name.autosuggesation": {}
			}
		}



		body.query=query;

		executepartysearch(body,"goparties_search","party,profile")
		.then(result1=>{
			return preparedata(result1.hits.hits)
		}).then(result2=>{
			resolve(result2);
		}).catch(err=>{
			reject(err);
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




let executepartysearch=function(body,index,type){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY.searchexecute(body,index,type)
		.then(result=>{
			resolve(result);
		}).catch(err=>{
			reject(err);
		})
	});
}


let executepartysearchscroll=function(body,index,type){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY.searchscroll(body,index,type)
		.then(result=>{
			resolve(result);
		}).catch(err=>{
			reject(err);
		})
	});
}




module.exports=
{
	search,
	autocomplete
};
