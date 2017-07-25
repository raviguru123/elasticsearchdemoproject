"use strict"
let Elasticsearch=require("aws-es");
let elasticsearch = new Elasticsearch({
	accessKeyId: "AKIAIUPXDVHKZUDTC5IA",
	secretAccessKey:"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",
	service: 'es',
	region:"ap-south-1",
	host:"search-gopartiesdemo1-22femiu3g7mz5ncqcqyaz5a5sa.ap-south-1.es.amazonaws.com"
});

module.exports=elasticsearch;
