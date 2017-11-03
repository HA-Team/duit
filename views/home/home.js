app.controller('featuredProps', function($scope, tokkoApi) {
  $scope.featured = [];
  $scope.apiReady = false;
  let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
  data.filters.push(["is_starred_on_web", "=", "true"]);
  let args = {data: JSON.stringify(data), order: 'desc'}
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        title: p.publication_title,
        area: p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.suite_amount,
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

app.controller('homeSearch', function($rootScope, $scope, $state) {
  $rootScope.activeMenu = 'home';
  $scope.operationType = [2];
  $scope.subTypes = [];
  $scope.updateChosen = function() {
    $scope.subTypes = propertiesSubTypes[$scope.propertyType]
    console.log($scope.subtypes);
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };
  setTimeout(function(){
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    uiFunctions.buildSearchTypeButtons();
    uiFunctions.buildBackToTop();
  }, 0);
  $scope.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
    data.operation_types = [$scope.operationType[0]];
    if ($scope.propertyType) data.property_types = [$scope.propertyType[0]];
    if ($scope.subTypeSelected) data.with_custom_tags = [$scope.subTypeSelected.id];
    let args = {data: JSON.stringify(data), order: 'desc', offset: 0};
    $state.go('propertySearch', {args: JSON.stringify(args)});
    // $http.post("/propertySearch/",$httpParamSerializer(args));
    // $location.path("/propertySearch/"+{data: JSON.stringify(data), order: 'desc'});
  }
});

