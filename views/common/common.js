app.controller('footer', function($scope) {
  uiFunctions.buildFooter();
  $(window).trigger('load')
});

app.controller('navigation', function($scope, $rootScope, $state){
  $rootScope.activeMenu = 'home';
  $scope.setActive = function(state) {
    $rootScope.activeMenu = state
    // console.log($state.getCurrentPath()[1].state.name)
  }
})