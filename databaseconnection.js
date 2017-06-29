let Database=require("arangojs").Database(),
db=new Database({
	url:"http://root:poiqwe@54.169.205.67:8529/",
	databaseName:"goparties"
});

module.exports={
	getData=function(collectionName,limitStart,limitEnd){
		return new Promise(resolve,reject){
			limitStart=limitStart||0;
			limitEnd=limitEnd||1000;
			let query="for p in @@collectionName limit @@limitStart,@@;limitEnd return p";
			query=query.replace("@@collectionName",collectionName);
			query=query.replace("@@limitStart",limitStart);
			query=query.replace("@@limitEnd",limitEnd);
			db.query(query).then(result=>{
				resolve(result);
			},err=>{
				reject(err);
			})
		}
	}
}



// getAllData:function(collectionName,limitStart,limitEnd){
// 	return new Promise(function(resolve,reject){
// 		var query="";
// 		if(limitStart!=undefined && limitEnd!=undefined){
// 			console.log("limitStart,limitEnd",limitStart,limitEnd);
// 			query='for q in @@collection limit @@limitStart,@@limitEnd return q';
// 			query=query.replace('@@limitStart',limitStart);
// 			query=query.replace('@@limitEnd',limitEnd);	

// 		}

// 		else
// 			query='for q in @@collection return q';
// 		query=query.replace('@@collection',collectionName);
// 		db.query(query).then(result=>{
// 			resolve(result._result);
// 		},error=>{
// 			reject(error);
// 		});
// 	});
// }