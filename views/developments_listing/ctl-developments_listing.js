app.controller('devsListing', ['$rootScope', '$scope', 'tokkoApi', function($rootScope, $scope, tokkoApi){
  // #region Scoped Properties

  $rootScope.activeMenu = 'developments';

  $scope.results = [];
  $scope.resultsMapped = [];
  $scope.resultsCount = 0;
  $scope.apiReady = false;
  $scope.ifResults = true;

  // #endregion

  // #region Private Properties

  let args = {order: 'desc', limit: 100};

  // #endregion

  // #region On Init

  tokkoApi.find('development', args, function(result) {
    $scope.results = result;
    $scope.resultsMapped = result.map(develop => {    
      return {
        id: develop.id,
        name: develop.name,
        location: develop.location,
        photos: develop.photos,
        hRef: `/#!/development/${develop.id}`
      };
    });

    $scope.resultsCount = result.length;

    if ($scope.resultsCount == 0) $scope.ifResults = false;

    $scope.apiReady = true;
    $scope.$apply();

    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
  });

  // #endregion
}]);