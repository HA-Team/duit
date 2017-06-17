app.controller('featuredProps', function($scope, tokkoApi) {
  setTimeout(function(){
    // findeoJs();
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    uiFunctions.buildFooter();
  }, 0);
  $scope.featured = [];
  $scope.apiReady = false;
  const args = {
    data:`{"current_localization_id":0,
    "current_localization_type":"country",
    "price_from":0,"price_to":999999999,
    "operation_types":[1,2],
    "property_types":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
    "currency":"ANY",
    "filters":[["is_starred_on_web","=","true"]]}`,
    order: 'desc',
  }
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

app.controller('homeSearch', function($scope) {
  $scope.operationType = 2;
  $scope.subTypes = propertiesSubTypes;
  $scope.updateChosen = function() {
    setTimeout(function(){
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  }
})

