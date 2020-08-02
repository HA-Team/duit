app.controller('propsListing', ['$location', '$rootScope', '$scope', 'tokkoApi', '$stateParams', '$state', '$anchorScroll', function($location, $rootScope, $scope, tokkoApi, $stateParams, $state, $anchorScroll){
  // #region Private Properties

  let args = JSON.parse($stateParams.args);

  // #endregion
  
  // #region Public Properties

  $rootScope.activeMenu = 'propertySearch';
  $scope.results = [];
  $scope.resultsCount = 0;
  $scope.sideBarParams = {};
  $scope.filteredResults = [];
  $scope.apiReady = true;
  $scope.ifResults = true;
  $scope.stopInfiniteScroll = true;
  $scope.loadingMore = false;
  $scope.isOrderOpen = false;
  $scope.isFilterOpen = false;

  $scope.operationType = JSON.parse(args.data).operation_types;

  $scope.propertyType = JSON.parse(args.data).property_types;
  $scope.subTypeSelected = JSON.parse(args.data).with_custom_tags;

  // #endregion

  // #region Private Methods

  const setActiveSection = (operationType) => $rootScope.activeSection = operationType == 1 ? 'properties-sell' : 'properties-rent';

  const getProperties = ($scope, tokkoApi, rargs) => {
    let args = {data: rargs.data, order: rargs.order, order_by: rargs.order_by, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
    if (args.offset == 0) {
      $scope.apiReady = false;
      $scope.results = [];
      tokkoApi.find('property/get_search_summary', args, function(result) {
        let types = result.objects.property_types
        $scope.sideBarParams = {
          locations: result.objects.locations,
          types: types.sort((a, b) => b.count - a.count),
          subTypes: (() => {
            if ($scope.subTypeSelected && $scope.subTypeSelected.length > 0) {
              return [propertiesSubTypes[types[0].id].find(x => x.id === $scope.subTypeSelected[0])]
            } else {
              return types.length === 1 ? propertiesSubTypes[types[0].id] : [];
            }
          })(),
          operations: result.objects.operation_types.sort((a, b) => b.count - a.count),
          rooms: result.objects.suite_amount.sort((a, b) => b.count - a.count),
        };
        $scope.resultsCount = result.meta.total_count;
        $scope.$apply();
      });
    }
    tokkoApi.find('property/search', args, function(result){
      result.forEach((p) => {
        $scope.results.push({
          id: p.id,
          title: p.publication_title,
          address: p.address,
          agent: p.branch ? p.branch.name : '',
          area: p.type.id === 1 ? p.surface : p.roofed_surface,
          type: p.operations[0].operation_type,
          currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency === 'ARS' ? '$' : p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
          price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
          rooms: p.suite_amount ? p.suite_amount : 0,
          baths: p.bathroom_amount ? p.bathroom_amount : 0,
          parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
          cover_photo: p.photos.length > 0 ? p.photos[0].thumb : '/images/no-image.png',
          photos: p.photos.length > 0 ? p.photos : [{image: '/images/no-image.png'}],
          location: p.location,
          full_prop: p,
        });
      });
      $scope.results.length > 0 ? $scope.ifResults = true : $scope.ifResults = false;
      $scope.apiReady = true;
      $scope.stopInfiniteScroll = false;
      $scope.loadingMore = false;
      $scope.$apply();
      uiFunctions.buildCarousel();
      uiFunctions.gridSwitcher();
      $scope.updateChosen();
    });
  };

  // #endregion

  // #region On Init

  setActiveSection($scope.operationType);
  $anchorScroll();
  getProperties($scope, tokkoApi, args);

  setTimeout(() => {
    uiFunctions.buildChosen();
    $('.chosen-select-no-single').val('price_asc');
    $('.chosen-select-no-single').trigger("chosen:updated");
  },0);

  // #endregion

  // #region Public Methods

  $scope.goLocation = (url) => $state.go(url);

  $scope.opName = (type) => type === 1 ? 'Venta' : type === 2 ? 'Alquiler' : 'Otro';

  $scope.roomAmtName = (amount) => parseInt(amount) > 0 ? (amount == 1 ? `${amount} Dormitorio` : `${amount} Dormitorios`) : "Loft ";

  $scope.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));    
    data.operation_types = $scope.operationType;
    data.property_types = $scope.propertyType;
    data.with_custom_tags = $scope.subTypeSelected;
    data.current_localization_id = $scope.location;
    data.filters = [$scope.rooms];
    if ($scope.minPrice) data.price_from = $scope.minPrice;
    if ($scope.maxPrice) data.price_to = $scope.maxPrice;
    args.data = JSON.stringify(data);
    args.order_by = $scope.order ? $scope.order.order_by : 'price';
    args.order = $scope.order ? $scope.order.order : 'asc';
    args.offset = 0;
    getProperties($scope, tokkoApi, args);
    $location.search({args: JSON.stringify(args)});

    setActiveSection($scope.operationType);
  };

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
    if (filter.type === 'or') {
      $scope.order = {order_by: $scope.orderBy.val.split('_')[0], order: $scope.orderBy.val.split('_')[1]}
    }
    $scope.find();
  };

  $scope.updateChosen = () => {
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };

  $scope.loadMoreProps = () => {
    const areAllPropsDisplayed = !$scope.sideBarParams || !$scope.sideBarParams.operations ? true : $scope.sideBarParams.operations.reduce((a, b) => a + b.count, 0) == $scope.results.length;
    
    args.offset += 20;
    $scope.stopInfiniteScroll = true;
    $scope.loadingMore = true;  
    getProperties($scope, tokkoApi, args);

    if (areAllPropsDisplayed) $scope.loadingMore = false;    
  };

  $scope.toggleOrderModal = () => $scope.isOrderOpen = !$scope.isOrderOpen;

  $scope.toggleFilterModal = () => $scope.isFilterOpen = !$scope.isFilterOpen;    

  $scope.changeOrder = (newVal) => {
    $scope.orderBy = newVal;
    $scope.isOrderOpen = false;
    $scope.changeFilter({type: 'or'});
  };

  $scope.toggleActiveItem = (e) => { 
    e.stopPropagation();
        
    let item = e.target;

    while (!item.classList.contains("mobile-filter-modal-item")) item = item.parentElement;

    if (item.classList.contains("active")) item.classList.remove("active");
    else item.classList.add("active");
  };

  $scope.pluralize = (name) => ['a','e','i','o','u'].includes(name.slice(-1)) ? `${name}s` : `${name}es`;

  $scope.clearAllFilters = () => {
    $scope.minPrice = '';
    $scope.maxPrice = '';
    $scope.operationType = [...Array(2 + 1).keys()].slice(1);
    $scope.propertyType = [...Array(25 + 1).keys()].slice(1);
    $scope.subTypeSelected = [];
    $scope.location = [];
    $scope.rooms = [];    
    $scope.find();
  };

  // #endregion

  // #region Events

  $rootScope.$on('changeFilter', (event, {operationType}) => $scope.changeFilter({type: 'o', val: [operationType]}));

  // #endregion

  // #region Public Objects

  $scope.orderBy = {val: 'price_asc', text: 'Menor Precio'};

  $scope.orderOptions = [
    {val: 'price_asc', text: 'Menor Precio'},
    {val: 'price_desc', text: 'Mayor Precio'},
    {val: 'id_asc', text: 'Más Recientes'}
  ];

  // #endregion
}]);