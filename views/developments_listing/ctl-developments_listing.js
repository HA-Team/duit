app.controller('devsListingController', ['$rootScope', '$scope', 'tokkoApi', function($rootScope, $scope, tokkoApi){
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

  // #endregion

  // #region On Init

  tokkoApi.find('development', args, function(result) {
    devsListing.results = result;
    devsListing.resultsMapped = result.map(develop => {    
      return {
        id: develop.id,
        name: develop.name,
        location: develop.location,
        photos: develop.photos,
        hRef: `/#!/development/${develop.id}`
      };
    });

    devsListing.resultsCount = result.length;

    if (devsListing.resultsCount == 0) devsListing.ifResults = false;

    devsListing.apiReady = true;
    $scope.$apply();

    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
  });

  // #endregion
}]);