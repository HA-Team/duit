app.controller('homeSearch', function($rootScope, $scope, $state) {
    $rootScope.activeMenu = 'home';
    $scope.operationType = [2];
    $scope.subTypes = [];  
  
    $scope.isPropertyTypeOpen = false;
    $scope.isSubPropertyTypeOpen = false;
  
    $scope.wasFindPropertiesButtonClicked = false;
    $scope.isPropertyPlaceholderWarningActive = false;  
  
    $scope.subTypeSelected = {
      id: -1,
      name:"Condición"
    };
  
    $scope.propertyType = {
      id: -1,
      name: "Tipo de Propiedad"
    };
  
    $scope.propertiesTypes = propertiesTypes;    
  
    $scope.updateTypeChosen = function(newType) {  
      $scope.propertyType = newType;
  
      $scope.isPropertyTypeOpen = false;
      $scope.isSubPropertyTypeOpen = false;
      $scope.isPropertyPlaceholderWarningActive = false;
  
      if ($scope.propertiesTypes.some(type => type.id == -1) && $scope.propertiesTypes[0] != -1) $scope.propertiesTypes.shift();            
      
      $scope.subTypeSelected = propertiesSubTypes[$scope.propertyType.id][0]; 
      
      $scope.subTypes = propertiesSubTypes[$scope.propertyType.id].filter(type => type.id != $scope.subTypeSelected.id);
      
      $scope.propertiesTypes = propertiesTypes.filter(type => type.id != newType.id); 
    };
  
    $scope.updateSubTypeChosen = (newType) => {
      $scope.subTypeSelected = newType;
  
      $scope.isPropertyTypeOpen = false;
      $scope.isSubPropertyTypeOpen = false;
  
      $scope.subTypes = propertiesSubTypes[$scope.propertyType.id].filter(type => type.id != $scope.subTypeSelected.id);
    };
  
    $scope.togglePropertyTypeDropdown = () => {    
      $scope.isSubPropertyTypeOpen = false;
      $scope.isPropertyTypeOpen = !$scope.isPropertyTypeOpen;
    };
  
    $scope.toggleSubPropertyTypeDropdown = () => {
      $scope.isPropertyTypeOpen = false;
      if ($scope.propertyType.id != -1 && $scope.subTypes.length > 1) $scope.isSubPropertyTypeOpen = !$scope.isSubPropertyTypeOpen;
    };
  
    $scope.closeOpenSelects = () => {
      $scope.isPropertyTypeOpen = false;
      $scope.isSubPropertyTypeOpen = false;
    };
  
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
        $scope.isPropertyPlaceHolderWarningActive = false;
        $scope.find();
      }
    }
  
    setTimeout(function(){
      uiFunctions.buildParallax();
      uiFunctions.buildChosen();
      uiFunctions.buildSearchTypeButtons();
      uiFunctions.buildBackToTop();
    }, 0);
  
    $scope.find = () => {
      let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
      data.operation_types = [$scope.operationType[0]];    
      if ($scope.propertyType) data.property_types = [$scope.propertyType.id];
      if ($scope.subTypeSelected) {
        data.with_custom_tags = $scope.subTypeSelected.id == 0 ? [] : [$scope.subTypeSelected.id];
      }
      let args = {data: JSON.stringify(data), offset: 0};
      $state.go('propertySearch', {args: JSON.stringify(args)});
    };
  });