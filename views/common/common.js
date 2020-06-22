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
    $rootScope.activeMenu = state;
  };
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
    });
  }
});

app.controller('mobile-header', function($scope) {
  $scope.isHamburgOpen = false;
  
  $scope.toggleMenu = function () {
    const filterModal = document.getElementById("mobile-props-filter-modal");
    const orderModal = document.getElementById("mobile-props-order-modal");
    
    $scope.isHamburgOpen = !$scope.isHamburgOpen;     
    
    if (filterModal) filterModal.classList.remove("open");
    
    if (orderModal) orderModal.classList.remove("open");
  }

  var prevScrollpos = window.pageYOffset;
  
  window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      document.getElementById("mobile-header").style.top = "0";
    } else {
      document.getElementById("mobile-header").style.top = "-75px";
    }
    prevScrollpos = currentScrollPos;
  }
});