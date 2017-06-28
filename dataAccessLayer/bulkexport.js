let esclientobj=require("../elasticsearchConnection");

function bulkexport(data){
	return new Promise(function(resolve,reject){
		console.log("data in ",data[0]);
		// console.log("data in ",data[1]);
		esclientobj.bulk({}, data, function (err, data) {
			if(err){
				console.log("error occured",err);
				reject(err);
			}
			else{
				resolve(data);
			}

		});
	})
}

module.exports.bulkexport=bulkexport;
