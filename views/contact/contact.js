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

app.controller('contactForm', function($scope, tokkoApi) {
  $scope.send = () => {
    const data = {
      name: $scope.name,
      email: $scope.email,
      phone: $scope.phone,
      text: $scope.message,
    }
    tokkoApi.insert('webcontact', data, (response) => {
      if (response.result=='success') {
        alert('Mensaje enviado correctamente');
      }
    });
  };
});