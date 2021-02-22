app.controller('homeSearchController', ['$rootScope', '$scope', '$state', '$timeout', 'navigation', 'sharedData', function($rootScope, $scope, $state, $timeout, navigation, sharedData) {
  var homeSearch = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'home';

  homeSearch.operationType = [2];
  homeSearch.isPropertyTypeOpen = false;
  homeSearch.wasFindPropertiesButtonClicked = false;
  homeSearch.isPropertyPlaceholderWarningActive = false;
  homeSearch.propertiesTypes = sharedData.propertiesTypes;
  // #endregion

  // #region On Init

  $timeout(function(){
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    uiFunctions.buildSearchTypeButtons();
    uiFunctions.buildBackToTop();
  });

  // #endregion

  // #region Scoped Methods

  homeSearch.updateTypeChosen = function(newType) { 
    const isTypeSelectedPlaceholder = homeSearch.propertiesTypes[0] != -1;
    const isPlaceholderOnList = homeSearch.propertiesTypes.some(type => type.id == -1);

    homeSearch.propertyType = newType;

    homeSearch.isPropertyTypeOpen = false;
    homeSearch.isPropertyPlaceholderWarningActive = false;

    if (isPlaceholderOnList && isTypeSelectedPlaceholder) homeSearch.propertiesTypes.shift();
    
    homeSearch.propertiesTypes = sharedData.propertiesTypes.filter(type => type.id != newType.id);
  };

  homeSearch.togglePropertyTypeDropdown = () => homeSearch.isPropertyTypeOpen = !homeSearch.isPropertyTypeOpen;

  homeSearch.findProperties = () => {
    homeSearch.wasFindPropertiesButtonClicked = true;

    if (homeSearch.propertyType.id == -1) {
      homeSearch.isPropertyPlaceholderWarningActive = true;

      $timeout(() => homeSearch.isPropertyPlaceholderWarningActive = false, 2000);
    }
    else {
      if (homeSearch.propertyType.goTo) navigation.goToSection(homeSearch.propertyType.goTo.page, homeSearch.propertyType.goTo.section);
      else {
        homeSearch.isPropertyPlaceHolderWarningActive = false;
        homeSearch.find();
      }
    }
  };

  homeSearch.find = () => {
    let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
    data.operation_types = [homeSearch.operationType[0]];
    if (homeSearch.propertyType) data.property_types = [homeSearch.propertyType.id];
    let args = {data: JSON.stringify(data), offset: 0};
    $state.go('propiedades', {args: JSON.stringify(args)});
  };

  // #endregion

  // #region Events

  $scope.$on('homeSearchServiceLinkClicked', (event, {type}) => {
    const button = document.querySelector(`#home-search-bar .search-type input[value='${type}']`).parentElement;    

    const notClickedButtons = document.querySelectorAll(`#home-search-bar .search-type input:not([value='${type}'])`);
    
    button.classList.add("active");
    notClickedButtons.forEach(element => element.parentElement.classList.remove("active"));

    homeSearch.operationType = [type];
  });

  // #endregion

  // #region Scoped Objects

  homeSearch.propertyType = {
    id: -1,
    name: "Tipo de Propiedad"
  };

  // #endregion
}]);