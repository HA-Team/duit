app.controller('footer', function($scope) {
  uiFunctions.buildFooter();
  $(window).trigger('load')
});

app.controller('navigation', function($scope, $rootScope, $state){
  $rootScope.activeMenu = 'home';
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0);
  $scope.setActive = function(state) {
    $rootScope.activeMenu = state
    // console.log($state.getCurrentPath()[1].state.name)
  }
});

app.controller('headerLogin', function($rootScope, $scope, $state) {
  $scope.loggedIn = () => {
    return Meteor.user() ? true : false;
  };
  $scope.logOut = () => {
    Meteor.logout((err) => {
      $rootScope.favorites.props = [];
      $rootScope.$apply();
      $state.go('home');
      // window.location.reload();
    });
  }
});

app.controller('mobile-header', function($scope) {
  $scope.isHamburgOpen = false;
});