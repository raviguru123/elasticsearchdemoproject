let client=require("./elasticsearchConnection");


let getdata=function(data){
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

module.exports=
{
	getdata
};
