var app=angular.module("search.module",["ngMaterial"]);
app.controller('searchController', ['$timeout', '$q', '$log','$scope','httpService','$location','$httpParamSerializer',
	function($timeout, $q, $log,$scope,httpService,$location,$httpParamSerializer){
		$scope.cards = []; 
		$scope.page = 0; 
		$scope.allResults = false;
		let _scroll_id;
		
		$scope.getdataService=function(data){
			var obj={};
			obj=Object.assign({},data);
			obj.scrollId=_scroll_id;
			console.log("obj",obj);
			httpService.getdata(obj).then(function(results){
				console.log("result from search request",results);
				_scroll_id=results._scroll_id;
				results.hits=results.hits||{};
				results.hits.hits=results.hits.hits||[];
				results=results.hits.hits;
				if (results.length !== 10) {
					$scope.allResults = true;
				}

				var ii = 0;
				for (; ii < results.length; ii++) {
					$scope.cards.push(results[ii]);
				}
			});
		}


		$scope.search = function(data){
			$scope.searchobj=data;
			$scope.page = 0;
			$scope.cards = [];
			$scope.allResults = false;
			$location.search($httpParamSerializer(data));
			$scope.getdataService(data);
		};
		
		$scope.search($location.search());


		$scope.loadMore = function() {
			$scope.getdataService($location.search());
		};



		$scope.simulateQuery = false;
		$scope.isDisabled    = false;
           // list of states to be displayed
           $scope.states        = loadStates();
           $scope.querySearch   = querySearch;
           $scope.selectedItemChange = selectedItemChange;
           $scope.searchTextChange   = searchTextChange;
           $scope.newState = newState;

           function newState(state) {
           	alert("This functionality is yet to be implemented!");
           } 

           function querySearch (query) {
           	var results = query ? loadStates().filter(createFilterFor(query)) :loadStates();
           	deferred = $q.defer();
           	httpService.autocomplete(query).then(function(response){
           		deferred.resolve(response);
           		//console.log("response come from autocomplete",query,response);
           	},function(resolve){

           	});
           	return deferred.promise;
           }

 //filter function for search query
 
 function createFilterFor(query) {
 	var lowercaseQuery = angular.lowercase(query);
 	return function filterFn(state) {
 		return (state.value.indexOf(lowercaseQuery) === 0);
 	};
 }

 function searchTextChange(text) {
 	//$scope.searchobj.text=text;
 	//$scope.search({"text":text});
 	//$log.info('Text changed to ' + text);
 }

 function selectedItemChange(item) {
 	item=item||{};
 	$log.info('Item changed to ' + JSON.stringify(item));
 	$scope.search({"text":item.display});
 }

 $scope.presEnter = function(e){
 	debugger;
 	var autoChild = document.getElementById('Auto').firstElementChild;
 	var el = angular.element(autoChild);
 	el.scope().$mdAutocompleteCtrl.hidden = true;
 };



 function loadStates() {
 	var repos = [
 	{
 		'name'      : 'Angular 1',
 		'url'       : 'https://github.com/angular/angular.js',
 		'watchers'  : '3,623',
 		'forks'     : '16,175',
 	},
 	{
 		'name'      : 'Angular 2',
 		'url'       : 'https://github.com/angular/angular',
 		'watchers'  : '469',
 		'forks'     : '760',
 	},
 	{
 		'name'      : 'Angular Material',
 		'url'       : 'https://github.com/angular/material',
 		'watchers'  : '727',
 		'forks'     : '1,241',
 	},
 	{
 		'name'      : 'Bower Material',
 		'url'       : 'https://github.com/angular/bower-material',
 		'watchers'  : '42',
 		'forks'     : '84',
 	},
 	{
 		'name'      : 'Material Start',
 		'url'       : 'https://github.com/angular/material-start',
 		'watchers'  : '81',
 		'forks'     : '303',
 	}
 	];
 	return repos.map( function (repo) {
 		repo.value = repo.name.toLowerCase();
 		return repo;
 	});
 }



}]);




app.factory('httpService', ['$http','$q','$httpParamSerializer',
	function($http,$q,$httpParamSerializer){
		var obj={};
		var cache={};
		
		obj.getdata=function(data){
			var defer=$q.defer();
			var url="http://localhost:3000/search?"+$httpParamSerializer(data);
			//if(cache[url]==undefined){
				$http.get(url).then(function(response){
					cache[url]=response.data;
					defer.resolve(response.data);
				},function(reason){
					defer.reject(reason);
				});
				
			// }

			// else
			// {
			// 	defer.resolve(cache[url]);
			// }

			return defer.promise;
		}


		obj.autocomplete=function(query){
			let data={};
			data.query=query;
			var defer=$q.defer();
			var url="http://localhost:3000/autocomplete?"+$httpParamSerializer(data);
			if(cache[url]==undefined){
				$http.get(url).then(function(response){
					cache[url]=response.data;
					defer.resolve(response.data);
				},function(reason){
					defer.reject(reason);
				});
				
			}
			else
			{
				console.log("return from cache");
				defer.resolve(cache[url]);
			}

			return defer.promise;
		}

		return obj;
	}]);



app.directive("scrollDirective",function($rootScope,$window){
	return {
		restrict:'EA',
		link: function(scope, elem, attrs) {

			$window = angular.element($window);
			scrollEnabled=true;
			scrollDistance = 0;
			
			if (attrs.infiniteScrollDistance != null) {
				scope.$watch(attrs.infiniteScrollDistance, function(value) {
					return scrollDistance = parseInt(value, 10);
				});
			}

			handler = function() {
				var elementBottom, remaining, shouldScroll, windowBottom;
				windowBottom = $window.height() + $window.scrollTop();
				elementBottom = elem.offset().top + elem.height();
				remaining = elementBottom - windowBottom;
				shouldScroll = remaining <=elem.height()*scrollDistance;
				if (shouldScroll) {
					if ($rootScope.$$phase) {
						return scope.$eval(attrs.scrollDirective);
					} else {
						return scope.$apply(attrs.scrollDirective);
					}
				} else if (shouldScroll) {
					return checkWhenEnabled = true;
				}
			};

			$window.on('scroll', handler);
			scope.$on('$destroy', function() {
				return $window.off('scroll', handler);
			});

		}
	}
})

app.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter);
				});

				event.preventDefault();
			}
		});
	};
});