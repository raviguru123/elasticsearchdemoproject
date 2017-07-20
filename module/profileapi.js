let EXECUTEQUERY=require("../dataAccessLayer/executequery");

let getprofile=function(data){
	return new Promise(function(resolve,reject){
		let query={};
		let body={};
		let profile={};
		query.match={"_id":data.id};
		body.query=query;
		executeprofilesearch(body)
		.then(result1=>{
			result1=result1[0]._source||{};
			profile.profile=result1;
			return Promise.all([recommended(result1),nearyou(result1)]);
		}).then(([result2,result3])=>{
			profile.recommended=result2;
			profile.nearyou=result3;
			resolve(profile);
		}).catch(err=>{
			reject(err);
		})

	});
}


let recommended=function(data){
	return new Promise(function(resolve,reject){
		let geo=data.geo||[];
		let query,body={};
		let dataquery=data.profile_type+" "+data.name+" "+data.genre+" "+data.location+" "+data.address;
		console.log("dataquery",dataquery);
		
		query={
			"bool": {
				"should": [
				{
					"multi_match": {
						"type": "most_fields",
						"query":dataquery,
						"fields": [
						"profile_type^5","name","genre","location","address"
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
		executeprofilesearch(body)
		.then(result=>{
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
				{
					"match_phrase": {
						"profile_type":data.profile_type
					}
				}
				],
				"must_not":[{
					"match":{
						"_key":data._key
					}
				}]
			}
		}

		console.log("query",query);
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
		executeprofilesearch(body)
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


let executeprofilesearch=function(body){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY.searchexecute(body,"goparties_search","profile")
		.then(result=>{
			result=result.hits||{};
			result=result.hits||{};
			resolve(result);
		}).catch(err=>{
			reject(err);
		})
	});
}



let parsedata=function(data){
	let arr=[];
	data.forEach(function(item){
		let obj=item._source
		for(key in item){
			if(key!='_source'){
				obj[key]=item[key]
			}
		}
		arr.push(obj);
	});
	return arr;
}



module.exports={
	getprofile
}