app.controller('headerController', ['$rootScope', '$location', 'navigation', function($rootScope, $location, navigation) {
  var header = this;
  
  // #region Scoped Properties
  
  $rootScope.activeMenu = $location.$$path.replace('/', '');
  $rootScope.activeSection = $location.hash(); 
  
  header.isHamburgOpen = false;

  // #endregion
  
  // #region Private Properties

  const operationTypes = {
    venta: 1,
    alquiler: 2
  };

  var prevScrollpos = window.pageYOffset;

  // #endregion

  // #region On Init

  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0);

  // #endregion

  // #region Private Methods

  const getOperationArgs = (opType) => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));      
    
    data.operation_types = [opType];
    data.with_custom_tags = [];
    
    let args = {data: JSON.stringify(data), offset: 0};
    
    return args;
  }

  // #endregion
  
  // #region Scoped Methods

  header.toggleMenu = function () {
    const filterModal = document.getElementById("mobile-props-filter-modal");
    const orderModal = document.getElementById("mobile-props-order-modal");
    
    header.isHamburgOpen = !header.isHamburgOpen;     
    
    if (filterModal) filterModal.classList.remove("open");
    
    if (orderModal) orderModal.classList.remove("open");
  };

  header.goToSection = (page, section, args) => {  
    header.toggleMenu();
    navigation.goToSection(page, section, args);      
  };

  // #endregion

  // #region Events

  window.onscroll = function() {
    var currentScrollPos = window.pageYOffset;

    document.getElementById("mobile-header").style.top = prevScrollpos > currentScrollPos ? "0" : "-75px";
    
    prevScrollpos = currentScrollPos;
  };

  // #endregion

  // #region Scoped Objects

  header.sections = [
    {
      title: 'Home',
      page: 'home',
      section: ''
    },
    {
      title: 'Alquiler',
      page: 'propertySearch',
      args: getOperationArgs(operationTypes.alquiler),
      section: 'properties-rent',
      action: () => $rootScope.$broadcast('changeFilter', { operationType: 2 })     
    },
    {
      title: 'Venta',
      page: 'propertySearch',
      args: getOperationArgs(operationTypes.venta),
      section: 'properties-sell',
      action: () => $rootScope.$broadcast('changeFilter', { operationType: 1 }) 
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
      section: 'home-agents'
    },
    {
      title: 'Contacto',
      page: 'home',
      section: 'home-contact'
    }
  ];

  // #endregion
}]);