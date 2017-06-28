let bulkexportobj=require("./module/bulkexportfrom_jsonfile");

(function(){
	exportdatafromfiletoElasticsearch();
})();



function exportdatafromfiletoElasticsearch(){
	let path="./jsonfiles/data.json";
	bulkexportobj.transferdata(path,"library","article")
	.then(result=>{
		console.log("final result come from");
	},err=>{
		console.log("error occured in app.js file");
	});
}