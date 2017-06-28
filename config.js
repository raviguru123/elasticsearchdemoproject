let obj={};
obj.host='localhost:9200';
obj.log="trace";
obj.apiVersion="5.1";
obj.keepAlive=true;
module.exports=obj;


var config = {
	server : {
		hosts : ['localhost:9200']
	}
};




// new elasticsearch.Client({
// 	"host":"localhost:9200",
// 	"log":'trace',
// 	"apiVersion":"5.0",
// 	"keepAlive":true
// });
