let AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

// create an elasticsearch client for your Amazon ES 
var es = require('elasticsearch').Client({
	hosts: [ 'search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com'],
	connectionClass: require('http-aws-es')
});

AWS.config.update({
	credentials: new AWS.Credentials("AKIAIUPXDVHKZUDTC5IA","leIbkZ3sxOmyPU6IZSeKwJSz4TL2Q/dzMcGYraZy")
});

//npm run test -- --endpoint search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com --region ap-south-1

// accessKeyId: "AKIAIUPXDVHKZUDTC5IA",
// 	secretAccessKey:"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",
// 	service: 'es',
// 	region:"ap-south-1",
// 	host:"search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com"
