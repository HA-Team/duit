app.controller('devsListingController', ['$rootScope', '$scope', 'tokkoApi', 'getFeaturedProperties', '$filter', '$timeout', function($rootScope, $scope, tokkoApi, getFeaturedProperties, $filter, $timeout) {
  var devsListing = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'developments';

  devsListing.results = [];
  devsListing.resultsMapped = [];
  devsListing.filterResults = [];
  devsListing.filterValue = '';
  devsListing.resultsCount = 0;
  devsListing.apiReady = false;
  devsListing.ifResults = true;
  devsListing.filterOpen = false;

  // #endregion

  // #region Private Properties

  let args = {order: 'desc', limit: 100};
  let results = [];

  // #endregion

  // #region Private Methods
  
  const getPropertiesMinPrice = () => {
    let counter = 0;

    devsListing.results.forEach(dev => {
      getFeaturedProperties.getDevelopmentProps(dev.id, result => {
        if (result.length > 0) {          
          const minPriceProp = result.reduce((min, prop) => {
            const price = prop.operations[prop.operations.length - 1].prices.slice(-1)[0].price;
  
            return price < min.operations[min.operations.length - 1].prices.slice(-1)[0].price ? prop : min;
          }, result[0]);

          const price = minPriceProp.operations[minPriceProp.operations.length - 1].prices.slice(-1)[0];
          
          dev.minPrice = $filter('currency')(price.price, `${price.currency} `, 0);

          $scope.$apply();
        }

        counter ++;

        if (counter == devsListing.results.length) {
          devsListing.results = devsListing.results.filter(dev => dev.minPrice);
          results = devsListing.results;

          devsListing.resultsMapped = devsListing.results.map(develop => {    
            return {
              id: develop.id,
              name: develop.name,
              location: develop.location,
              photos: develop.photos,
              hRef: `/#!/development/${develop.id}`
            };
          });

          devsListing.resultsCount = results.length;

          if (devsListing.resultsCount == 0) devsListing.ifResults = false;

          devsListing.filterResults = devsListing.results.map(dev => dev.name);

          devsListing.results.forEach(dev => {
            const locs = dev.location.short_location.split('|').map(loc => loc.trim());
            locs.forEach(loc => {
              if (!devsListing.filterResults.includes(loc)) devsListing.filterResults.push(loc);
            })
          });
          
          devsListing.apiReady = true;

          $scope.$apply();
        }
      });
    });
  };

  // #endregion

  // #region On Init

  tokkoApi.find('development', args, function(result) {
    devsListing.results = result;

    getPropertiesMinPrice();
  });

  // #endregion

  // #region Scoped Methods

  devsListing.fitlerList = () => {
    devsListing.apiReady = false;

    if (devsListing.filterValue) {
      devsListing.results = results.filter(dev => {
        return dev.location.short_location.toLowerCase().includes(devsListing.filterValue.toLowerCase()) || dev.name.toLowerCase().includes(devsListing.filterValue.toLowerCase());
      });
    } else {
      devsListing.results = results;
    }

    $timeout(() => {
      devsListing.apiReady = true;
      devsListing.filterValue = '';
    }, 500);
  };

  devsListing.updateFilter = () => {
    devsListing.filterOpen = true;
  };

  devsListing.closeFilter = () => $timeout( () => devsListing.filterOpen = false);

  // #endregion

}]);