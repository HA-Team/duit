const getProperties = ($scope, tokkoApi, rargs) => {
  let args = {data: rargs.data, order: rargs.order, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
  if (args.offset == 0) {
    // $('.sidebar-col').toggleClass('busy-sidebar');
    $scope.apiReady = false;
    $scope.results = [];
    tokkoApi.find('property/get_search_summary', args, function(result) {
      let types = result.objects.property_types
      $scope.sideBarParams = {
        locations: result.objects.locations,
        types: types,
        subTypes: (() => {
          if ($scope.subTypeSelected.length > 0) {
            return [propertiesSubTypes[types[0].id].find(x => x.id === $scope.subTypeSelected[0])]
          } else {
            return types.length === 1 ? propertiesSubTypes[types[0].id] : [];
          }
        })(),
        operations: result.objects.operation_types,
        rooms: result.objects.suite_amount,
      };
      $scope.resultsCount = result.meta.total_count;
      $scope.results.length > 0 ? $scope.ifResults = true : $scope.ifResults = false;
    });
  }
  tokkoApi.find('property/search', args, function(result){
    // let props = [];
    result.forEach((p) => {
      $scope.results.push({
        id: p.id,
        title: p.publication_title,
        address: p.address,
        agent: p.branch ? p.branch.name : '',
        area: p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.room_amount ? p.room_amount : 0,
        baths: p.bathroom_amount ? p.bathroom_amount : 0,
        parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
        // Not working yet because there is props without front cover photo asigned
        //cover_photo: p.photos.map(function(p){if(p.is_front_cover){return p.thumb}})[0],
        // Instead we take the first photo as cover.
        cover_photo: p.photos.length > 0 ? p.photos[0].thumb : '/images/no-image.png',
        photos: p.photos.length > 0 ? p.photos : [{image: '/images/no-image.png'}],
        location: p.location,
        full_prop: p,
      });
    });
    // $scope.results = props;
    // $scope.filteredResults = $scope.results;
    // console.log($scope.results);
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
    $scope.updateChosen();
  });
  // $('.sidebar-col').toggleClass('busy-sidebar');
}