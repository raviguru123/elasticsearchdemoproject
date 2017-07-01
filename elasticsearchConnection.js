let elasticsearch=require("es");
// config = {
// 	server : {
// 		hosts : ['localhost:9200']
// 	},
// 	_index : "goparties",
// 	_type :"profile"
// };

var config = {
	_index : 'goparties',
	server : {
		hosts : ['localhost:9200']
	}
};


var client = elasticsearch(config);
module.exports=client;

