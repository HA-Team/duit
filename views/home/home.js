app.controller('featuredProps', function($scope, tokkoApi) {
  setTimeout(function(){
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    // uiFunctions.buildFooter();
    uiFunctions.buildSearchTypeButtons();
    uiFunctions.buildBackToTop();
  }, 0);
  $scope.featured = [];
  $scope.apiReady = false;
  let data = tokkoSearchArgs.data;
  data.filters.push(["is_starred_on_web", "=", "true"]);
  const args = {data: JSON.stringify(data), order: 'desc'}
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        address: p.address,
        area: p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.room_amount,
        baths: p.bathroom_amount,
        parkings: p.parking_lot_amount,
        // Not working yet because there is props without front cover photo asigned
        //cover_photo: p.photos.map(function(p){if(p.is_front_cover){return p.thumb}})[0],
        // Instead we take the first photo as cover.
        cover_photo: p.photos[0].thumb,
      })
    });
    $scope.featured = props;
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    $(window).trigger('resize');
  });
})

app.controller('homeSearch', function($scope, $state) {
  $scope.operationType = 2;
  $scope.subTypes = propertiesSubTypes;
  $scope.updateChosen = () => {
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };
  $scope.find = () => {
    let data = tokkoSearchArgs.data;
    data.operation_types = [$scope.operationType];
    data.property_types = [$scope.propertyType];
    data.with_custom_tags = [$scope.subTypeSelected.id];
    const args = {data: JSON.stringify(data), order: 'desc'};
    // console.log(args);
    $state.go('propertySearch', {args: args});
    // $http.post("/propertySearch/",$httpParamSerializer(args));
    // $location.path("/propertySearch/"+{data: JSON.stringify(data), order: 'desc'});
  }
})

