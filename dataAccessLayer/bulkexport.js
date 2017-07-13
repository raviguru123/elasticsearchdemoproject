let esclientobj=require("../elasticsearchConnection");

function bulkexport(data){
	return new Promise(function(resolve,reject){
		console.log("data 0",data[0]);
		console.log("data 0",data[1]);
		var ops = [];
		ops.push({ update: { _id : 'AVefK2vFmf0chKzzBkzy' }});
		ops.push({ doc: { title: 'brand new title' }});
		esclientobj.bulk({
			index: 'gopratiestest',
			type: 'party',
			body: data
		}, function(err, data) {
			if(err){
				console.log("error occured",err);
			}
			console.log('json reply received',data);
		});
	})
}

module.exports.bulkexport=bulkexport;
