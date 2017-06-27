const getProperties = ($scope, tokkoApi, args) => {
  $scope.apiReady = false;
  $scope.ifResults = true;
  args = {data: args.data, order: args.order}
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    let locations = [{id:0, name:'Todos'}];
    result.forEach((p) => {
      props.push({
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
        cover_photo: p.photos[0].thumb,
        photos: p.photos,
        location: p.location,
        // full_prop: p,
      });
      let loc = {id: p.location.id, name: p.location.name};
      if (!locations.some(function(obj){return obj.id == loc.id})) {
        locations.push(loc);
      }
    });
    props.length > 0 ? $scope.ifResults = true : $scope.ifResults = false;
    $scope.results = props;
    $scope.filteredResults = props;
    $scope.locations = locations;
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    uiFunctions.gridSwitcher();
    $scope.updateChosen();
  });
}

const applyFilters = ($scope) => {
  return {
    filters: (prop) => {
      let min = $scope.minPrice ? $scope.minPrice : 0;
      let max = $scope.maxPrice ? $scope.maxPrice : 9999999;
      let rooms = $scope.rooms && $scope.rooms != 0 ? $scope.rooms : prop.rooms;
      let loc = $scope.location && $scope.location.id != 0 ? $scope.location.id : prop.location.id; 
      return (prop.price <= max && prop.price >= min && prop.rooms == rooms && prop.location.id == loc);
    }
  }
}

app.controller('listing', function($rootScope, $scope, tokkoApi, $stateParams, $state){
  $rootScope.activeMenu = '';
  $scope.results = [];
  $scope.locations = [];
  $scope.filteredResults = [];
  $scope.apiReady = true;
  $scope.ifResults = false;
  $scope.subTypes = propertiesSubTypes;
  let args = JSON.parse($stateParams.args);
  $scope.operationType = JSON.parse(args.data).operation_types[0];
  $scope.propertyType = JSON.parse(args.data).property_types[0];
  $scope.subTypeSelected = JSON.parse(args.data).with_custom_tags[0];
  getProperties($scope, tokkoApi, args);
  $scope.find = () => {
    let data = tokkoSearchArgs.data;
    data.operation_types = [$scope.operationType];
    data.property_types = [$scope.propertyType];
    data.with_custom_tags = [$scope.subTypeSelected.id];
    let args = {data: JSON.stringify(data), order: 'desc'};
    // getProperties($scope, tokkoApi, {args: args});
    $state.go('propertySearch', {args: JSON.stringify(args)});
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
});