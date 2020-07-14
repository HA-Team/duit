app.controller('footer', function() {
  uiFunctions.buildFooter();
  $(window).trigger('load')
});

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

app.controller('headerLogin', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
  $scope.loggedIn = () => {
    return Meteor.user() ? true : false;
  };
  $scope.logOut = () => {
    Meteor.logout((err) => {
      $rootScope.favorites.props = [];
      $rootScope.$apply();
      $state.go('home');
    });
  }
}]);