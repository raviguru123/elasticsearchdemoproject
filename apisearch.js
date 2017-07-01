let client=require("./elasticsearchConnection");


let getdata=function(data){
	return new Promise(function(resolve,reject){
		console.log("getdata method called");
		client.search({
			"query":{
				"bool":{
					"must":
					[{
						"match_all":{}
					}]
				}
			}
			
		}).then(function(body){
			var hits=body.hits.hits;
			console.log("hits",hits);
			resolve(body.hits.hits);
		},function(err){
			console.log("error occured",err);
			reject(err);
		});


	});
}

module.exports=
{
	getdata
};
