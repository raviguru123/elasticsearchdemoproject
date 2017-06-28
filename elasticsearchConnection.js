let elasticsearch=require("es"),
config = {
	server : {
		hosts : ['localhost:9200']
	}
};

var client = elasticsearch(config);
module.exports=client;

