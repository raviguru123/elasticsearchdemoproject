let esclient=require("../elasticsearchConnection");

function bulkexport(data,INDEX,TYPE){
	return new Promise(function(resolve,reject){
		esclient.bulk({
			index: INDEX,
			type: TYPE,
			body: data
		}, function(err, data) {
			console.log("index,type",INDEX,TYPE);
			
			if(err){
				reject(err);
			}

			else{
				resolve(data);	
			}
			
			
		});



	})
}

module.exports.bulkexport=bulkexport;
