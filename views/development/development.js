app.controller('development', function($rootScope, $scope, tokkoApi, $stateParams, getFeaturedProperties) {
  $rootScope.activeMenu = '';
  $scope.apiReady = false;
  const id = $stateParams.devId;
  tokkoApi.findOne('development', id, function(result){
    $scope.d = result;
    let myLatLng = {lat: parseFloat(result.geo_lat), lng: parseFloat(result.geo_long)};
    let map = new google.maps.Map(document.getElementById('propertyMap'), {
      center: myLatLng,
      zoom: 17
    });
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: result.name,
    });
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.showMoreButton();
    uiFunctions.buildSlickCarousel();
    uiFunctions.buildMagnificPopup();
    getFeaturedProperties.getFeatured($scope, tokkoApi);
    getFeaturedProperties.getDevProps($scope, tokkoApi);
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
    }, 0)
  });
});

app.controller('propContactForm', function($scope, tokkoApi) {
  $scope.submitText = 'Enviar';
  $scope.sending = false;
  $scope.success = false;
  $scope.error = false;
  $scope.send = function () {
    if ($scope.name || $scope.email) {
      $scope.submitText = 'Enviando';
      $scope.sending = true;
      const data = {
        email: $scope.email,
        phone: $scope.phone,
        text: $scope.message,
        properties: [$scope.d.id],
      };
      tokkoApi.insert('webcontact', data, function (response) {
        if (response.result=='success') {
          $scope.sending = false;
          $scope.submitText = 'Enviar';
          $scope.success = true;
          $scope.email = '';
          $scope.phone = '';
          $scope.message = '';
          setTimeout(function(){
            $scope.success = false;
            $scope.$apply()
          },3000);
          $scope.$apply();
        } else {
          $scope.error = true;
          $scope.$apply();
          setTimeout(function(){
            $scope.error = false;
            $scope.$apply()
          },3000);
        }
      });
    }
  };
});
