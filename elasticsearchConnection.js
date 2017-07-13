// let elasticsearch=require("es"),
// config = {
// 	server : {
// 		hosts : ['localhost:9200']
// 	}
// };

// var client = elasticsearch(config);
// module.exports=client;

// let elasticsearch=require("aws-es");
// elasticsearch = new Elasticsearch({
// 	accessKeyId: "AKIAJV24SO6BM23ZOGCA",
// 	secretAccessKey:"XCtysHpEqaJiqy1Uz0QcoZm6jDTAMK2MqFNqA3tH",
// 	service: 'es',
// 	region: yourServiceRegion,
// 	host:"search-gopartiesdemo-uzqeoexo5sgop7kfzbgoewdoku.us-east-2.es.amazonaws.com"
// });
//
// 
// 

let Elasticsearch=require("aws-es");
let elasticsearch = new Elasticsearch({
	accessKeyId: "AKIAIUPXDVHKZUDTC5IA",
	secretAccessKey:"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",
	service: 'es',
	region:"ap-south-1",
	host:"search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com"
});




// let AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-1' });

// // create an elasticsearch client for your Amazon ES 
// var es = require('elasticsearch').Client({
// 	hosts: [ 'search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com' ],
// 	connectionClass: require('http-aws-es')
// });

// AWS.config.update({
// 	credentials: new AWS.Credentials("AKIAIUPXDVHKZUDTC5IA","leIbkZ3sxOmyPU6IZSeKwJSz4TL2Q/dzMcGYraZy")
// });





// elasticsearch = new Elasticsearch({
// 		accessKeyId: yourAccessKeyId,
// 		secretAccessKey: yourSecretAccessKey,
// 		service: 'es',
// 		region: yourServiceRegion,
// 		host: yourServiceHost
// 	});

//var client = elasticsearch(config);
module.exports=elasticsearch;