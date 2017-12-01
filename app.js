(function(){
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController)
	.service('MenuSearchService',MenuSearchService)
	.directive('foundItems',FoundItems)
	.constant('Api', 'https://davids-restaurant.herokuapp.com/menu_items.json');

	function FoundItems(){
		var ddo={
			templateUrl:'foundItems.html',
			scope:{
				foundItem:'<',
				onRemove:'&',
				error:'<'

			},
			controller: NarrowItDownControllerDirective,
			controllerAs:'ctrlDirective',
			bindToController:true,
			link: NarrowItDownDirectiveLink
		};

		return ddo;

	};

	function NarrowItDownDirectiveLink(scope,element,attrs,controller){
		scope.$watch('ctrlDirective.nothingFound()', function(newValue,oldValue){
			if(newValue===true){
				displayNothingFound();
			}else{
				removeNothingFound();
			}
		});

		function displayNothingFound(){
			var nothingFoundElement=element.find('p');
			nothingFoundElement.css('display','inline');

		};

		function removeNothingFound(){
			var nothingFoundElement=element.find('p');
			nothingFoundElement.css('display','none')
		};

	};

	function NarrowItDownControllerDirective(){
		var ctrlDirective=this;
		ctrlDirective.nothingFound=function(){
			if(ctrlDirective.error){
				return true;
			};
			return false;
		};

		ctrlDirective.someFound=function(){
			if(ctrlDirective.foundItem.length===0){
				return false;
			};
			return true;
		};



	};


	NarrowItDownController.$inject=['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var ctrl=this;
		ctrl.found=[];
		ctrl.searchTerm='';
		ctrl.error=false;

		ctrl.getMatchedMenuItems=function(searchTerm){
			MenuSearchService.removeAll();
			var promise= MenuSearchService.getMatchedMenuItems(searchTerm);
			promise
			.then(function(succ){
				if(succ.length===0 || searchTerm==='' ){
					ctrl.found=[];
					ctrl.error=true;
				}else{
					ctrl.error=false;
					ctrl.found=succ;

				}
			})

		};

		ctrl.removeItem=function(index){
			MenuSearchService.removeItem(index);
		};





	};
	MenuSearchService.$inject=['$http','Api'];
	function MenuSearchService($http,Api){
		var service=this;
		var matchedItems=[];

		service.getMatchedMenuItems=function(searchTerm){

			var response=
			$http({
				url: Api
			})
			.then(function(succ){
				var list=succ.data.menu_items;
				for (var i = 0; i < list.length; i++) {
					var description=list[i].description;
					if(description.toLowerCase().indexOf(searchTerm.toLowerCase())!==-1){
						matchedItems.push(list[i])
					}
				}
				return matchedItems;
			})
			return response;
		};

		service.removeItem=function(index){
			matchedItems.splice(index,1);
		};

		service.removeAll=function(){
			matchedItems=[];
			return matchedItems;
		};
	};




})();
