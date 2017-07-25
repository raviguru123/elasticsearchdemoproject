var app=angular.module("myapp",["ngMaterial"]);
app.controller('searchController', ['$timeout','$rootScope','$window','$q', '$log','$scope','httpService','$location','$httpParamSerializer',
	function($timeout,$rootScope, $window,$q, $log,$scope,httpService,$location,$httpParamSerializer){
		let _scroll_id;
		var baseurl="http://testing.goparties.com:3000";
		//baseurl="http://localhost:3000";
		$window.sessionStorage.setItem("baseurl",baseurl);
		$scope.getdataService=function(data){
			var obj={};
			obj=Object.assign({},data);
			httpService.getdata(obj).then(function(results){
				$scope.parse(results);
			});
		}

		$scope.scrollrequest=function(scroll){
			var obj={};
			obj.scrollId=scroll;

			if(scroll!=undefined){
				_scroll_id=undefined;
				httpService.getdata(obj).then(function(results){
					$scope.parse(results);
				});
			}
			else{
				return;
			}
		}

		$scope.parse=function(results){
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
		}


		function initsearch(){
			$scope.cards = []; 
			$scope.page = 0; 
			$scope.allResults = false;
			$scope.searchobj=Object.assign(JSON.parse($window.sessionStorage.getItem("locationinfo")),$location.search());
			$scope.selectedItem=$scope.searchobj.text;

			this.preparedata=function(){
				var data=Object.assign({},$scope.searchobj);
				if(data.startdate!=undefined){
					let datearr=data.startdate.split("/");
					data.startdate=new Date(datearr[1]+"/"+datearr[0]+"/"+datearr[2]).getTime();
				}
				return data;
			}

			this.search=function(){
				let data=this.preparedata();
				$scope.page = 0;
				$scope.cards = [];
				$scope.allResults = false;
				$scope.getdataService(data);
			}
		}

		


		
		let init=new initsearch();
		$scope.$on("$locationChangeStart",function(){
			init.search();
		});


		$scope.$watch("searchobj",function(newvalue,oldvalue,$scope){
			if(newvalue!=oldvalue){
				$scope.searchobj=newvalue;
				$location.search($httpParamSerializer($scope.searchobj));
			}
		},true);



		$scope.loadMore = function() {
			$scope.scrollrequest(_scroll_id);
		};



		$scope.simulateQuery = false;
		$scope.isDisabled    = false;
		$scope.querySearch   = querySearch;
		$scope.selectedItemChange = selectedItemChange;
		$scope.searchTextChange   = searchTextChange;
		$scope.newState = newState;

		function newState(state) {
			alert("This functionality is yet to be implemented!");
		} 

		function querySearch (query) {
			deferred = $q.defer();
			httpService.autocomplete(query).then(function(response){
				deferred.resolve(response);
			},function(resolve){

			});
			return deferred.promise;
		}

		var searchtext;
		function searchTextChange(text) {
			searchtext=text;
		}

		
		function selectedItemChange(item) {
			if(item!=undefined){
				item=item||{};
				$scope.searchobj.text=item.display;
			}
		}

		$scope.presEnter = function(e){
			var autoChild = document.getElementById('Auto').firstElementChild;
			var el = angular.element(autoChild);
			el.scope().$mdAutocompleteCtrl.hidden = true;
			$scope.searchobj.text=searchtext;
		};

		



	}]);


app.directive("googleLocationAutocomplete",function($window){
	return{
		scope:{
			ngModel:'=',
			geoLon:'=',
			geoLat:'=',
		},
		replace:true,
		restrict:'EA',
		link:function($scope,element,attr,controller,transclude){
			var id=element[0].id;
			$scope.initialize=function(id) {
				var address=(document.getElementById(id));
				var autocomplete = new google.maps.places.Autocomplete(address);
				autocomplete.setTypes(['geocode']);
				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return;
					}
					var address = '';
					if (place.address_components) {
						address = [
						(place.address_components[0] && place.address_components[0].short_name || ''),
						(place.address_components[1] && place.address_components[1].short_name || ''),
						(place.address_components[2] && place.address_components[2].short_name || '')
						].join(' ');
						$scope.codeAddress(id);
						$scope.$emit(id,document.getElementById(id).value);
					}
				});
			}
			$scope.codeAddress=function(id) {
				geocoder = new google.maps.Geocoder();
				var address = document.getElementById(id).value;
				geocoder.geocode( {'address': address}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						var latitude=results[0].geometry.location.lat();
						var longitude=results[0].geometry.location.lng();
						let obj={};
						$window.sessionStorage.setItem(id+"latitude",latitude);
						$window.sessionStorage.setItem(id+"longitude",longitude);
						$scope.$apply(function (){
							$scope.ngModel=address;
							$scope.geoLat=latitude;
							$scope.geoLon=longitude;
						});
						
					}
					else{
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}

			$scope.initialize(id);
		}
	}
});



app.directive("locationDetector",function(){
	return {
		scope:false,
		link:function(scope,attr,element){
			let location=undefined;

			function ip_callback(callback){
				if(location==undefined){
					var url="http://freegeoip.net/json/"+myip;
					var xmlHttp=new XMLHttpRequest();
					xmlHttp.onreadystatechange=function(){
						if(xmlHttp.readyState==4 && xmlHttp.status==200){
							callback(xmlHttp.responseText);
						}
					}
					xmlHttp.open('GET',url,true);
					xmlHttp.send(null);
				}
			}

			ip_callback(function(obj){
				obj=JSON.parse(obj);
				location={};
				location.address=obj.city+","+obj.region_name+","+obj.country_name;
				location.lat=obj.latitude;
				location.lon=obj.longitude;
				sessionStorage.setItem("locationinfo",JSON.stringify(location));
			});
		}
	}
})


app.factory('httpService', ['$http','$window','$q','$httpParamSerializer',
	function($http,$window,$q,$httpParamSerializer){
		var obj={};
		var cache={};
		var baseurl=$window.sessionStorage.getItem("baseurl");
		obj.getdata=function(data){
			var defer=$q.defer();
			var url=baseurl+"/search?"+$httpParamSerializer(data);
			$http.get(url).then(function(response){
				cache[url]=response.data;
				defer.resolve(response.data);
			},function(reason){
				defer.reject(reason);
			});
			return defer.promise;
		}


		obj.autocomplete=function(query){
			let data={};
			data.query=query;
			var defer=$q.defer();
			var url=baseurl+"/autocomplete?"+$httpParamSerializer(data);
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



app.directive("datePicker",function(){
	return {
		restrict:'EA',
		link:function($scope,element,$attr){
			angular.getTestability(element).whenStable(function() {
				$scope.$applyAsync(function(){
					$('.datepicker').bootstrapMaterialDatePicker(
						{ weekStart : 0,
							time: false ,
							format : 'DD/MM/YYYY',
							minDate: new Date(),
							clearButton:true }
							);

					$('.timepicker').bootstrapMaterialDatePicker
					({
						date: false,
						shortTime: false,
						format: 'HH:mm',
						clearButton:true
					});

					$('.datetimepicker').bootstrapMaterialDatePicker
					({
						weekStart:0,
						shortTime:false,
						time:true,
						minDate: new Date(),
						date:true,
						format: 'DD MMMM YYYY  HH:mm',
						clearButton:true
					});
				});

			});
		}
	}
});


