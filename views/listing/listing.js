const getProperties = ($scope, tokkoApi, rargs) => {
  let args = {data: rargs.data, order: rargs.order, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
  if (args.offset == 0) {
    // $('.sidebar-col').toggleClass('busy-sidebar');
    $scope.apiReady = false;
    $scope.ifResults = true;
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
    $scope.results.length > 0 ? $scope.ifResults = true : $scope.ifResults = false;
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

// const applyFilters = ($scope) => {
//   return {
//     filters: (prop) => {
//       let min = $scope.minPrice ? $scope.minPrice : 0;
//       let max = $scope.maxPrice ? $scope.maxPrice : 9999999;
//       let rooms = $scope.rooms && $scope.rooms != 0 ? $scope.rooms : prop.rooms;
//       let loc = $scope.location && $scope.location.id != 0 ? $scope.location.id : prop.location.id; 
//       return (prop.price <= max && prop.price >= min && prop.rooms == rooms && prop.location.id == loc);
//     }
//   }
// }

app.controller('listing', function($location, $rootScope, $scope, tokkoApi, $stateParams, $state, $anchorScroll){
  $rootScope.activeMenu = '';
  $scope.results = [];
  $scope.resultsCount = 0;
  $scope.sideBarParams = {};
  $scope.filteredResults = [];
  $scope.apiReady = true;
  $scope.ifResults = false;
  $scope.goLocation = (url) => {
    $state.go(url);
  }
  $scope.opName = (type) => {
    if (type === 1) {return 'Venta'};
    if (type === 2) {return 'Alquiler'} else {
      return 'Otro'
    }
  }
  $scope.roomAmtName = (amount) => {
    return parseInt(amount) > 0 ? amount + " Dormitorios " : "Loft ";
  }
  args = JSON.parse($stateParams.args);
  $scope.operationType = JSON.parse(args.data).operation_types;
  $scope.propertyType = JSON.parse(args.data).property_types;
  $scope.subTypeSelected = JSON.parse(args.data).with_custom_tags;
  $anchorScroll();
  getProperties($scope, tokkoApi, args);
  $scope.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
    data.operation_types = $scope.operationType;
    data.property_types = $scope.propertyType;
    data.with_custom_tags = $scope.subTypeSelected;
    data.current_localization_id = $scope.location;
    data.filters = [$scope.rooms];
    if ($scope.minPrice) data.price_from = $scope.minPrice;
    if ($scope.maxPrice) data.price_to = $scope.maxPrice;
    // if ($scope.subTypeSelected) {data.with_custom_tags = $scope.subTypeSelected;}
    args.data = JSON.stringify(data);
    args.offset = 0;
    getProperties($scope, tokkoApi, args);
    $location.search({args: JSON.stringify(args)});
  }
  $scope.changeFilter = (filter) => {
    if (filter.type === 'o') {
      $scope.operationType = filter.val;
    }
    if (filter.type === 't') {
      $scope.propertyType = filter.val;
      $scope.subTypeSelected = [];
    }
    if (filter.type === 'st') {
      $scope.subTypeSelected = filter.val;
    }
    if (filter.type === 'l') {
      $scope.location = filter.val;
    }
    if (filter.type === 'r') {
      $scope.rooms = filter.val;
    }
    $scope.find();
  }
  setTimeout(() => {
    uiFunctions.buildChosen();
  },0)
  $scope.updateChosen = () => {
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };
  $scope.filter = () => {
    $scope.filteredResults = $scope.results.filter(applyFilters($scope)['filters']);
    if($scope.filteredResults.length > 0) {
      $scope.ifResults = true;
      setTimeout(() => {
        uiFunctions.buildCarousel();
        uiFunctions.gridSwitcher();
      }, 0)
    } else {$scope.ifResults = false}
  }
  $scope.loadMoreProps = () => {
    args.offset += 20; 
    getProperties($scope, tokkoApi, args);
  }
});