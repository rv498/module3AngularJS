(function () {
'use strict';

angular.module('NarrowItDownApp', [])
  .controller("NarrowItDownController",NarrowItDownController)
  .service("MenuSearchService",MenuSearchService)
  .directive("foundItems",foundItems);

NarrowItDownController.$inject = ["MenuSearchService"];
function NarrowItDownController(MenuSearchService){
  var vm = this;
  vm.found = [];
  vm.search = function(){
    vm.found = MenuSearchService.getMatchedMenuItems(vm.searchTerm);
  }
  vm.remove = function(index){
    vm.found.splice(index,1);
  }
}

MenuSearchService.$inject = ["$http"];

function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    if (!service.data) service.getData();
    if (searchTerm === "") return [];
    var items = service.data.menu_items;
    var found = [];

    for (var i=0; i < items.length; i++) {
      var desc = items[i].description;
      // console.log(desc);
      if (desc.indexOf(searchTerm) !== -1){
        found.push(items[i]);
      }
    }

    console.dir(found);
    return found;
  };

  service.getData = function() {
    $http({
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(
      function (result) {
        console.log(result.data);
        service.data = result.data;
      },
      function (result) {
        console.log(result.data);
        service.getData();
      });
  }

  service.getData();
}

function foundItems(){
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    }/*,
    controller: ShoppingListDirectiveController,
    controllerAs: 'list',
    bindToController: true*/
  };

  return ddo;
}
})();