app.controller('mobile-header', function($scope, pageMoveUtils) {
    $scope.isHamburgOpen = false;
    
    $scope.toggleMenu = function () {
      const filterModal = document.getElementById("mobile-props-filter-modal");
      const orderModal = document.getElementById("mobile-props-order-modal");
      
      $scope.isHamburgOpen = !$scope.isHamburgOpen;     
      
      if (filterModal) filterModal.classList.remove("open");
      
      if (orderModal) orderModal.classList.remove("open");
    };
  
    var prevScrollpos = window.pageYOffset;
    
    window.onscroll = function() {
      var currentScrollPos = window.pageYOffset;
  
      document.getElementById("mobile-header").style.top = prevScrollpos > currentScrollPos ? "0" : "-75px";
      
      prevScrollpos = currentScrollPos;
    };

    $scope.goToSection = (id) => pageMoveUtils.goToSection(id);
  });