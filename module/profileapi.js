let EXECUTEQUERY=require("./executequery");

let getprofile=function(data){
	return new Promise(function(resolve,reject){
		let query={};
		query.match={"_id":data.id};
		EXECUTEQUERY.searchexecute(query,"goparties_search","profile")
		.then(result=>{
			result=result.hits||{};
			result=result.hits||{};
			result=result[0]._source||{};
			resolve(result);
		},err=>{
			reject(err);
		})

	});
}



module.exports={
	getprofile
}