let esclientobj=require("../elasticsearchConnection");

var commands = [
{index:{
	"_id": "575084573a2404eec25acdcd",
	"_index": "library",
	"_type": "article"
}},
{
	"title": "Id sint ex consequat ut.",
	"journal": "adipisicing duis nostrud adipisicing",
	"volume": 54,
	"number": 6,
	"pages": "255-268",
	"year": 2011,
	"link": "http://ea.ca/575084573a2404eec25acdcd.pdf",
}
]

// commands = [
// { index : { _index : 'dieties', _type : 'kitteh' } },
// { name : 'hamish', breed : 'manx', color : 'tortoise' },
// { index : { _index : 'dieties', _type : 'kitteh' } },
// { name : 'dugald', breed : 'siamese', color : 'white' },
// { index : { _index : 'dieties', _type : 'kitteh' } },
// { name : 'keelin', breed : 'domestic long-hair', color : 'russian blue' }
// ];


function bulkexport(data){
	return new Promise(function(resolve,reject){
		console.log("data in ",data[0]);
		// console.log("data in ",data[1]);
		esclientobj.bulk({}, data, function (err, data) {
			if(err){
				console.log("error occured",err);
			}
		});
	})
}

module.exports.bulkexport=bulkexport;
