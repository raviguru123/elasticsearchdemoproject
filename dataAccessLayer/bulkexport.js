let esclientobj=require("../elasticsearchConnection");

function bulkexport(data){
	return new Promise(function(resolve,reject){
		esclientobj.bulk({}, data, function (err, data) {
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
