app.controller('devsListing', function($rootScope, $scope, tokkoApi){
  $rootScope.activeMenu = 'developments';
  $scope.results = [];
  $scope.resultsCount = 0;
  $scope.apiReady = false;
  $scope.ifResults = true;
  let args = {order: 'desc'}
  tokkoApi.find('development', args, function(result) {
    $scope.results = result;
    $scope.resultsCount = result.length;
    if ($scope.resultsCount == 0) $scope.ifResults = false;
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
  });
});