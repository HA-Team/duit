app.controller('devsListingController', ['$rootScope', '$scope', 'tokkoApi', 'getFeaturedProperties', '$filter', '$timeout', function($rootScope, $scope, tokkoApi, getFeaturedProperties, $filter, $timeout) {
  var devsListing = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'developments';

  devsListing.results = [];
  devsListing.resultsMapped = [];
  devsListing.resultsCount = 0;
  devsListing.apiReady = false;
  devsListing.ifResults = true;

  // #endregion

  // #region Private Properties

  let args = {order: 'desc', limit: 100};
  let results = [];

  // #endregion

  // #region Private Methods
  
  const getPropertiesMinPrice = () => {
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
      });
    });
  };

  // #endregion

  // #region On Init

  tokkoApi.find('development', args, function(result) {
    devsListing.results = result;
    results = result;
    devsListing.resultsMapped = result.map(develop => {    
      return {
        id: develop.id,
        name: develop.name,
        location: develop.location,
        photos: develop.photos,
        hRef: `/#!/development/${develop.id}`
      };
    });

    getPropertiesMinPrice();

    devsListing.resultsCount = result.length;

    if (devsListing.resultsCount == 0) devsListing.ifResults = false;

    devsListing.apiReady = true;
    $scope.$apply();
  });

  // #endregion

  // #region Scoped Methods

  devsListing.fitlerList = () => {
    if (devsListing.apiReady) {
      devsListing.apiReady = false;
      devsListing.results = results.filter(dev => dev.location.short_location.toLowerCase().includes(devsListing.filterValue.toLowerCase()));
      $timeout(() => devsListing.apiReady = true, 500);
    }
  }

  // #endregion

}]);