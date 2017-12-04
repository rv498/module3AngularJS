(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItems);

function foundItems(){
  var ddo = {
    restrict: "E",
    templateUrl: "foundItems.html",
    scope: {
      foundItems: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'ctrl',
    bindToController: true
  };

  return ddo;
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function(result) {
      var foundItems = result.data.menu_items.filter(function(value) {
        return value.description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1;
      });

      return foundItems;
    });

    return response;
  };
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var ctrl = this;

  ctrl.narrowItems = function () {
    var searchTerm = ctrl.searchTerm || '';
    if (searchTerm.trim() === '') {
      ctrl.found = [];
      return;
    }

    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    promise.then(function (response) {
      ctrl.found = response;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  ctrl.removeItem = function(index) {
    ctrl.found.splice(index, 1);
  };
}

})();
