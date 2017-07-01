
let bulkexportobj=require("./module/bulkexportfrom_jsonfile"),
IMPORTANDEXPORTDATA=require("./module/importandexportdata"),
APISEARCH=require("./apisearch");
http=require("http"),
port=3000;



let server=http.createServer(requestHandler);
server.listen(port,function(){
	console.log("server is running in port",port);
});




function requestHandler(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
	if (req.url === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end(/* icon content here */);
	} else {
		console.log("yes",req.url);
		//res.end(JSON.stringify([1,2,3,4,5,6,7,8,9,10]));
		APISEARCH.getdata("hello").then(result=>{
			res.end(JSON.stringify(result));
		},err=>{
			res.end(JSON.stringify(err));
		})
		

	}
}




// (function(){
// 	exportdatafromfiletoElasticsearch();
// })();



// function exportdatafromfiletoElasticsearch(){
// 	let path="./jsonfiles/goparties.json";
// 	bulkexportobj.transferdata(path,"goparties","profile")
// 	.then(result=>{
// 		console.log("final result come from",result);
// 	},err=>{
// 		console.log("error occured in app.js file");
// 	});
// }
// 
//this section of code is use for transfer data from arango database to elasticsearch.
// IMPORTANDEXPORTDATA.migrateData();

