app.controller('mobile-header', function($scope, pageMoveUtils, $location) {
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

    $scope.goToSection = (goHome, id) => {
      if (!$location.url('') && goHome) {
        $location.url = '';
        setTimeout(() => pageMoveUtils.goToSection(id), 50);
      }
      else pageMoveUtils.goToSection(id)
    }
  });