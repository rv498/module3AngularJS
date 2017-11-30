        method: "GET",
        url: ('https://guilhermego.github.io/menu_items.json')
        //url: ('https://davids-restaurant.herokuapp.com/menu_items.json')
      })
      .then(function (response) {
        var items = response.data;
        //var searchItem = 'rice'; // provisório
        var foundItems = [];
        // Looping and searching...
        for (var i = 0; i < items.menu_items.length; i++) {
          if (items.menu_items[i].name.toLowerCase().indexOf(searchItem) !== -1 ) {
            foundItems.push(items.menu_items[i]);
          }
        }
        //console.log(service.foundItems);;
        return foundItems;
      })
      .catch(function (response) {
        console.log("Something went wrong!");
      });

      return response;
    };

  }

})();