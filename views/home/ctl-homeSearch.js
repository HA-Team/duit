app.controller('homeSearch', ['$rootScope', '$scope', '$state', 'navigation', function($rootScope, $scope, $state, navigation) {
  // #region Public Properties

  $rootScope.activeMenu = 'home';
  $scope.operationType = [2];

  $scope.isPropertyTypeOpen = false;

  $scope.wasFindPropertiesButtonClicked = false;
  $scope.isPropertyPlaceholderWarningActive = false;

  $scope.propertiesTypes = propertiesTypes;

  // #endregion

  // #region On Init

  setTimeout(function(){
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    uiFunctions.buildSearchTypeButtons();
    uiFunctions.buildBackToTop();
  }, 0);

  // #endregion

  // #region Public Methods

  $scope.updateTypeChosen = function(newType) { 
    const isTypeSelectedPlaceholder = $scope.propertiesTypes[0] != -1;
    const isPlaceholderOnList = $scope.propertiesTypes.some(type => type.id == -1);

    $scope.propertyType = newType;

    $scope.isPropertyTypeOpen = false;
    $scope.isPropertyPlaceholderWarningActive = false;

    if (isPlaceholderOnList && isTypeSelectedPlaceholder) $scope.propertiesTypes.shift();
    
    $scope.propertiesTypes = propertiesTypes.filter(type => type.id != newType.id);
  };

  $scope.togglePropertyTypeDropdown = () => $scope.isPropertyTypeOpen = !$scope.isPropertyTypeOpen;

  $scope.closeOpenSelects = () => $scope.isPropertyTypeOpen = false;

  $scope.findProperties = () => {
    $scope.wasFindPropertiesButtonClicked = true;

    if ($scope.propertyType.id == -1) {
      $scope.isPropertyPlaceholderWarningActive = true;

      setTimeout(() => {
        $scope.isPropertyPlaceholderWarningActive = false;
        $scope.$apply();
      }, 2000);
    }
    else {
      if ($scope.propertyType.goTo) navigation.goToSection($scope.propertyType.goTo.page, $scope.propertyType.goTo.section);
      else {
        $scope.isPropertyPlaceHolderWarningActive = false;
        $scope.find();
      }
    }
  };

  $scope.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
    data.operation_types = [$scope.operationType[0]];
    if ($scope.propertyType) data.property_types = [$scope.propertyType.id];
    let args = {data: JSON.stringify(data), offset: 0};
    $state.go('propertySearch', {args: JSON.stringify(args)});
  };

  // #endregion

  // #region Events

  $scope.$on('homeSearchServiceLinkClicked', (event, {type}) => {
    const button = document.querySelector(`#home-search-bar .search-type input[value='${type}']`).parentElement;    

    const notClickedButtons = document.querySelectorAll(`#home-search-bar .search-type input:not([value='${type}'])`);
    
    button.classList.add("active");
    notClickedButtons.forEach(element => element.parentElement.classList.remove("active"));

    $scope.operationType = [type];
  });

  // #endregion

  // #region Public Objects

  $scope.propertyType = {
    id: -1,
    name: "Tipo de Propiedad"
  };

  // #endregion
}]);