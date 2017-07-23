"use strict";
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
			
			//console.log("before search request hit",data);
			
			data.text=data.text||'party';
			data.type=data.type||'party,profile';
			
			console.log("data",data)
			if(isNaN(parseInt(data.startdate,10))){
				data.startdate=new Date().getTime();
				//data.startdate=parseInt(data.startdate, 10);
				data.enddate=data.startdate+180*24*60*60*1000;
				
			}
			else{
				data.startdate=parseInt(data.startdate, 10);
				data.enddate=data.startdate+24*60*60*1000;
			}
			
			
			let body={},query;
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
												"gte":data.startdate,
												"lte":data.enddate
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
					},
					{
						"geo_distance":{
							"distance":"100km",
							"geo":{
								"lat":data.lat,
								"lon":data.lon
							}
						}
					}
					]
				}
			}

			body.query=query;
			if(data.sort=="n"){
				body.sort= [
				{
					"_geo_distance": {
						"geo": {
							"lat":data.lat,
							"lon": data.lon
						},
						"order": "asc",
						"unit": "km",
						"distance_type": "arc"
					}
				}
				];
			}
			


			executesearchquery(body,"goparties_search",data.type,"searchscroll")
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
		data.time="10m";
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

		executesearchquery(body,"goparties_search","party,profile","searchexecute")
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


let executesearchquery=function(body,index,type,fn){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY[fn](body,index,type)
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
