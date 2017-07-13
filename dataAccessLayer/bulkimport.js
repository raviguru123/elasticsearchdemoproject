let Database=require("arangojs").Database;
let localdatabase="http://root:poiqwe@localhost:8529";
let gopartiesdatabase="http://root:poiqwe@54.169.205.67:8529";
let db=new Database({
	url:localdatabase,
	databaseName:"goparties"
});


module.exports={
	getData:function(collectionName,limitStart,limitEnd){
		return new Promise(function(resolve,reject){
			limitStart=limitStart||0;
			limitEnd=limitEnd||1000;
			let query="for p in @@collectionName";

			if(collectionName=="profile"){
				query+=" filter p.profile_type in ['Party Spot','Artist','Band','DJ']";
			}

			query+=" limit @@limitStart,@@limitEnd return p";
			query=query.replace("@@collectionName",collectionName);
			query=query.replace("@@limitStart",limitStart);
			query=query.replace("@@limitEnd",limitEnd);
			db.query(query).then(result=>{
				resolve(result._result);
			},err=>{
				reject(err);
			})
		})
	}

}
