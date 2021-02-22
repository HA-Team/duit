app.controller('headerController', ['$rootScope', '$location', 'navigation', 'sharedData', function($rootScope, $location, navigation, sharedData) {
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

  // #region Private Methods

  const getOperationArgs = (opType) => {
    let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));      
    
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
    const mobileHeader = document.getElementById("mobile-header");
    const stickyHeader = document.getElementById("sticky-header");
    const mainHeader = document.getElementById("main-header");
    
    var currentScrollPos = window.pageYOffset;

    stickyHeader.style.top = window.pageYOffset > mainHeader.offsetHeight ? "0" : "-75px";
    mobileHeader.style.top = prevScrollpos > currentScrollPos ? "0" : "-75px";
    
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
      page: 'propiedades',
      args: getOperationArgs(operationTypes.alquiler),
      section: 'alquiler',
      action: () => $rootScope.$broadcast('changeFilter', { operationType: 2 })     
    },
    {
      title: 'Venta',
      page: 'propiedades',
      args: getOperationArgs(operationTypes.venta),
      section: 'venta',
      action: () => $rootScope.$broadcast('changeFilter', { operationType: 1 }) 
    },
    {
      title: 'Emprendimientos',
      page: 'emprendimientos',
      section: ''
    },
    {
      title: 'Duit 360º',
      page: 'home',
      section: 'destacados'
    },
    {
      title: 'Servicios',
      page: 'home',
      section: 'servicios'
    },
    {
      title: 'Consejeros',
      page: 'home',
      section: 'consejeros'
    },
    {
      title: 'Contacto',
      page: 'home',
      section: 'contacto'
    }
  ];

  // #endregion
}]);