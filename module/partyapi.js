"use strict";
let EXECUTEQUERY=require("../dataAccessLayer/executequery");

let getpartise=function(data){
	return new Promise(function(resolve,reject){
		let query={};
		let body={};
		let party={};
		query.match={"_id":data.id};
		body.query=query;
		executepartysearch(body,"searchexecute")
		.then(result1=>{
			result1=result1[0]._source||{};
			party.party=result1;
			return Promise.all([recommended(result1),nearyou(result1)]);
		}).then(([result2,result3])=>{
			party.recommended=result2;
			party.nearyou=result3;
			resolve(party);
		}).catch(err=>{
			reject(err);
		})

	});
}


let recommended=function(data){
	return new Promise(function(resolve,reject){
		let dataquery=data.title+" "+data.genre;
		//console.log("dataquery",dataquery);
		let geo=data.geo||[];
		let query,body={};
		query={
			"bool": {
				"should": [
				{
					"multi_match": {
						"type": "most_fields",
						"query":dataquery,
						"fields": [
						"title","genre"
						]
					}
				}
				],
				"must_not":[{
					"match":{
						"_key":data._key
					}
				}],
				
				"filter": [
				{
					"range": {
						"startdate": {
							"gte": new Date().getTime()
						}
					}
				},
				{
					"geo_distance": {
						"distance": "100km",
						"geo": {
							"lon":geo[0],
							"lat": geo[1]
						}
					}
				}
				]
			}
		}

		body.query=query;
		//console.log("body stringify",JSON.stringify(body));
		console.log("befire");
		executepartysearch(body,"searchexecute")
		.then(result=>{
			//console.log("result",result.length);
			resolve(parsedata(result));
		}).catch(err=>{
			reject(err);
		})

	})

}



let nearyou=function(data){
	return new Promise(function(resolve,reject){
		data.geo=data.geo||[];
		let query,body={};
		query={
			"bool": {
				"must": [
				{"match_all": {}}
				],
				"must_not":[{
					"match":{
						"_key":data._key
					}
				}],
				"filter": {
					"range": {
						"startdate": {
							"gte": new Date().getTime()
						}
					}
				}
			}
		}
		body.query=query;
		body.sort= [
		{
			"_geo_distance": {
				"geo": {
					"lat":data.geo[1],
					"lon": data.geo[0]
				},
				"order": "asc",
				"unit": "km",
				"distance_type": "arc"
			}
		}
		];
		executepartysearch(body,"searchexecute")
		.then(result=>{
			result=parsedata(result);
			result=result.map(function(item){
				item.distance=Math.ceil(item.sort[0])+" KM";
				return item;
			});
			resolve(result);
		}).catch(err=>{
			reject(err);
		})
		
	})

}


let executepartysearch=function(body,fn){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY[fn](body,"goparties_search","party")
		.then(result=>{
			console.log("hits",result.hits.hits.length);
			result=result.hits||{};
			result=result.hits||{};
			resolve(result);
		}).catch(err=>{
			reject(err);
		})
	});
}



let parsedata=function(data){
	try{
		let arr=[];
		console.log("data parse",data.length);
		data.forEach(function(item){
			let key;
			let obj=item._source
			for(key in item){
				if(key!='_source'){
					obj[key]=item[key]
				}
			}
			arr.push(obj);
		});
		console.log("parser",arr.length);
		return arr;
	}
	catch(e){
		console.log("error",e);
	}
}


module.exports={
	getpartise
}