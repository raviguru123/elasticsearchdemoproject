let elasticsearch=require("elasticsearch");
elasticsearch = require('es');
var config = {
	server : {
		hosts : ['localhost:9200']
	}
};
var client = elasticsearch(config);

// let client=new elasticsearch.Client({
// 	"host":"localhost:9200",
// 	"log":'trace',
// 	"apiVersion":"5.0",
// 	"keepAlive":true
// });



// client.ping({
// 	requestTimeout:1000
// },function(err){
// 	if(err){
// 		console.log("something went wrong");
// 	}
// 	else{
// 		console.log("every thing is working fine");
// 	}
// });

var options = {
	
};



var commands = [
{ index : { _index : 'dieties', _type : 'kitteh' } },
{ name : 'hamish', breed : 'manx', color : 'tortoise' },
{ index : { _index : 'dieties', _type : 'kitteh' } },
{ name : 'dugald', breed : 'siamese', color : 'white' },
{ index : { _index : 'dieties', _type : 'kitteh' } },
{ name : 'keelin', breed : 'domestic long-hair', color : 'russian blue' }
];

client.bulk(options, commands, function (err, data) {
	if(err){
		console.log("error occured",err);
	}
});


// module.exports.elasticsearchobj=


// client.search({
// 	"q":"elasticsearch"
// }).then(function(body){
// 	var hits=body.hits.hits;
// 	console.log("body contet in elasticsearch",hits);
// },function(err){
// 	console.log("err occured during search");
// });

// client.search({
// 	"index":"bank",
// 	"type":"account",
// 	"body":{
// 		"query":{
// 			"bool":{
// 				"must":
// 				[{
// 					"match_all":{}
// 				}]
// 			}
// 		}
// 	}
// }).then(function(body){
// 	var hits=body.hits.hits;
// 	console.log("hits",hits);
// },function(err){
// 	console.log("error occured",err);
// });

