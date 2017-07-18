let app=angular.module("profile.module",[]);

app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

app.controller('profilecontroller', ['$scope', '$location','$window','httpService',
	function($scope,$location,$window,httpService){
		function getdata(){
			var url="http://localhost:3000/profile?id="+$location.search().id;
			httpService.get(url).then(function(response){
				console.log("data come from party page response",response);
			},function(reason){

			});
		}

		$scope.init=function(){
			
			getdata();
		}

		$scope.init();
	}]);



app.factory("httpService",function($http,$q){
	return {
		get:function(url){
			let defer=$q.defer();
			$http.get(url).then(function(response){
				defer.resolve(response);
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}
	}
})