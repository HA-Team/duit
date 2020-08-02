app.controller('navigation', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
  $rootScope.activeMenu = $location.$$path.replace('/', '');
  $rootScope.activeSection = $location.hash();      
  
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0);
  $scope.setActive = function(page, section) {
    $rootScope.activeMenu = page;
    $rootScope.activeSection = section ? section : '';
  };
}]);