let EXECUTEQUERY=require("../dataAccessLayer/executequery");

let getpartise=function(data){
	return new Promise(function(resolve,reject){
		let query={};
		let body={};
		let party={};
		query.match={"_id":data.id};
		body.query=query;
		executepartysearch(body)
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
		let query,body={};
		query={
			"bool": {
				"must": [
				{
					"multi_match": {
						"query": data.title,
						"fields": [
						"title"
						]
					}
				}
				],
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
		body.from=1;
		executepartysearch(body)
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
			"match_all": {}
		};

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
		body.from=1;
		executepartysearch(body)
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


let executepartysearch=function(body){
	return new Promise(function(resolve,reject){
		EXECUTEQUERY.searchexecute(body,"goparties_search","party")
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
	getpartise
}