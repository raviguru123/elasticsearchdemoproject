let elasticsearch=require("elasticsearch"),
client=new elasticsearch.Client({
	"host":"localhost:9200"
});

module.exports=client;
