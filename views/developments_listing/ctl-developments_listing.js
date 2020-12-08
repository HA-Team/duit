app.controller('devsListingController', ['$rootScope', '$scope', 'tokkoApi', 'getFeaturedProperties', '$filter', '$timeout', 'sharedData', function($rootScope, $scope, tokkoApi, getFeaturedProperties, $filter, $timeout, sharedData) {
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

  let results = [];

  // #endregion

  // #region On Init

  document.title = 'Duit Propiedades Inmobiliaria';

  var getDevsInterval = setInterval(() => {
    if (sharedData.devs.length > 0) {
      devsListing.results = sharedData.devs;

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
        });
      });

      devsListing.apiReady = true;

      $scope.$apply();
      
      clearInterval(getDevsInterval);
    }
  }, 200);

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