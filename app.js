let bulkexportobj=require("./module/bulkexportfrom_jsonfile");
let IMPORTANDEXPORTDATA=require("./module/importandexportdata")
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
IMPORTANDEXPORTDATA.migrateData();