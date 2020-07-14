app.controller('map', function($scope) {
  const myLatLng = {lat:-31.4228448, lng: -64.1890466};
  const map = new google.maps.Map(document.getElementById('propertyMap'), {
    center: myLatLng,
    zoom: 17
  });
  const marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Duit'
  });
});

app.controller('contactForm', function($rootScope, $scope, tokkoApi) {
  $rootScope.activeMenu = 'contactUs';
  $scope.submitText = 'Enviar';
  $scope.sending = false;
  $scope.success = false;
  $scope.error = false;
  $scope.send = function () {
    if ($scope.name && $scope.email && $scope.message) {
      $scope.submitText = 'Enviando';
      $scope.sending = true;
      const data = {
        name: $scope.name,
        email: $scope.email,
        phone: $scope.phone,
        text: $scope.message,
      }
      tokkoApi.insert('webcontact', data, function (response) {
        if (response.result=='success') {
          $scope.sending = false;
          $scope.submitText = 'Enviar';
          $scope.success = true;
          $scope.name = '';
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