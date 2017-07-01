var app=angular.module("search.module",["infinite-scroll"]);
app.controller('searchController', ['$scope','httpService','$location','$httpParamSerializer',
	function($scope,httpService,$location,$httpParamSerializer){
		$scope.cards = []; 
		$scope.page = 0; 
		$scope.allResults = false;
		
		
		$scope.getdataService=function(data){
			var obj={};
			obj=Object.assign({},data);
			httpService.getdata(obj).then(function(results) {
				console.log("results",results);
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
			debugger;
			$scope.getdataService($location.search());
		};

	}]);




app.factory('httpService', ['$http','$q','$httpParamSerializer',
	function($http,$q,$httpParamSerializer){
		var obj={};
		var data={};
		
		obj.getdata=function(data){
			var defer=$q.defer();
			var url="http://localhost:3000/search?"+$httpParamSerializer(data);
			debugger;
			if(data[url]==undefined){
				$http.get(url).then(function(response){
					debugger;
					data[url]=response.data;
					defer.resolve(response.data);
				},function(reason){
					defer.reject(reason);
				});
				
			}

			else
			{
				defer.resolve(data[url]);
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