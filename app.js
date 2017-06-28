let bulkexportobj=require("./module/bulkexportfrom_jsonfile");

(function(){
	exportdatafromfiletoElasticsearch();
})();



function exportdatafromfiletoElasticsearch(){
	let path="./jsonfiles/goparties.json";
	bulkexportobj.transferdata(path,"goparties","profile")
	.then(result=>{
		console.log("final result come from",result);
	},err=>{
		console.log("error occured in app.js file");
	});
}