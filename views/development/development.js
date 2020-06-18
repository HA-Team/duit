// const getFeatured = (scope, tokkoApi) => {
//   scope.featured = [];
//   scope.featReady = false;
//   let data = tokkoSearchArgs.data;
//   data.filters.push(["is_starred_on_web", "=", "true"]);
//   const args = {data: JSON.stringify(data), order: 'desc'}
//   tokkoApi.find('property/search', args, function(result){
//     let props = [];
//     result.forEach((p) => {
//       props.push({
//         id: p.id,
//         type: p.operations[0].operation_type,
//         currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
//         price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
//         cover_photo: p.photos[0].thumb,
//         parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
//         prop: p
//       })
//     });
//     scope.featured = props;
//     scope.featReady = true;
//     scope.$apply();
//     uiFunctions.buildCarousel();
//   });  
// };

const getDevProps = (scope, tokkoApi) => {
  scope.devProps = [];
  scope.devPropsReady = false;
  const args = {development: scope.d.id, order: 'desc'};
  tokkoApi.find('property', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        cover_photo: p.photos[0].image,
        parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        sell: p.operations.filter(p => p.operation_type == "Venta")[0]?.prices.slice(-1)[0],
        rent: p.operations.filter(p => p.operation_type == "Alquiler")[0]?.prices.slice(-1)[0],
        parkings_av: p.parking_lot_amount > 0 ? "Si" : "No",
        prop: p
      })
    });
    scope.devProps = props;
    scope.devPropsReady = true;
    scope.$apply();
  });  
};

app.controller('development', function($rootScope, $scope, tokkoApi, $stateParams) {
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
    getFeatured($scope, tokkoApi);
    getDevProps($scope, tokkoApi);
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
