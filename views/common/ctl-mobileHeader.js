app.controller('mobile-header', function($rootScope, $scope, navigation, $state) {
    $scope.isHamburgOpen = false;

    const operationTypes = {
      venta: 1,
      alquiler: 2
    };
    
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
    
    const getOperationArgs = (opType) => {
      let data = JSON.parse(_.clone(tokkoSearchArgs.sData));      
      
      data.operation_types = [opType];
      data.with_custom_tags = [];
      
      let args = {data: JSON.stringify(data), offset: 0};
      
      return args;
    }

    $scope.goToSection = (page, section, args) => {  
      $scope.toggleMenu();
      
      if ($rootScope.activeMenu != page) {        
        $state.go(page, {args: JSON.stringify(args)});          
        setTimeout(() => navigation.goToSection(page, section), 100);            
      }
      else {        
        navigation.goToSection(page, section);        
      }      
    };

    $scope.sections = [
      {
        title: 'Home',
        page: 'home',
        section: ''
      },
      {
        title: 'Alquiler',
        page: 'propertySearch',
        args: getOperationArgs(operationTypes.alquiler),
        section: 'properties-rent'       
      },
      {
        title: 'Venta',
        page: 'propertySearch',
        args: getOperationArgs(operationTypes.venta),
        section: 'properties-sell'
      },
      {
        title: 'Emprendimientos',
        page: 'developments',
        section: ''
      },
      {
        title: 'Duit Destacadas 360º',
        page: 'home',
        section: 'home-featured-anchor'
      },
      {
        title: 'Servicios',
        page: 'home',
        section: 'home-services'
      },
      {
        title: 'Consejeros',
        page: 'home',
        section: 'home-assesors'
      },
      {
        title: 'Contacto',
        page: 'home',
        section: 'home-contact'
      }
    ];
  });