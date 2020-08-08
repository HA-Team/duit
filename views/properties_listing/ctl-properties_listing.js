app.controller('propsListingController', ['$location', '$rootScope', '$scope', 'tokkoApi', '$stateParams', '$state', '$anchorScroll', function($location, $rootScope, $scope, tokkoApi, $stateParams, $state, $anchorScroll){
  var propsListing = this;
  
  // #region Private Properties

  let args = JSON.parse($stateParams.args);

  // #endregion
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'propertySearch';
  propsListing.results = [];
  propsListing.resultsCount = 0;
  propsListing.sideBarParams = {};
  propsListing.filteredResults = [];
  propsListing.apiReady = true;
  propsListing.ifResults = true;
  propsListing.stopInfiniteScroll = true;
  propsListing.loadingMore = false;
  propsListing.isOrderOpen = false;
  propsListing.isFilterOpen = false;

  propsListing.operationType = JSON.parse(args.data).operation_types;
  propsListing.propertyType = JSON.parse(args.data).property_types;
  propsListing.subTypeSelected = JSON.parse(args.data).with_custom_tags;

  // #endregion

  // #region Private Methods

  const setActiveSection = (operationType) => $rootScope.activeSection = operationType == 1 ? 'properties-sell' : 'properties-rent';

  const getProperties = (tokkoApi, rargs) => {
    let args = {data: rargs.data, order: rargs.order, order_by: rargs.order_by, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
    if (args.offset == 0) {
      propsListing.apiReady = false;
      propsListing.results = [];
      tokkoApi.find('property/get_search_summary', args, function(result) {
        let types = result.objects.property_types
        propsListing.sideBarParams = {
          locations: result.objects.locations,
          types: types.sort((a, b) => b.count - a.count),
          subTypes: (() => {
            if (propsListing.subTypeSelected && propsListing.subTypeSelected.length > 0) {
              return [propertiesSubTypes[types[0].id].find(x => x.id === propsListing.subTypeSelected[0])]
            } else {
              return types.length === 1 ? propertiesSubTypes[types[0].id] : [];
            }
          })(),
          operations: result.objects.operation_types.sort((a, b) => b.count - a.count),
          rooms: result.objects.suite_amount.sort((a, b) => b.count - a.count),
        };
        propsListing.resultsCount = result.meta.total_count;
        $scope.$apply();
      });
    }
    tokkoApi.find('property/search', args, function(result){
      result.forEach((p) => {
        propsListing.results.push({
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
      propsListing.results.length > 0 ? propsListing.ifResults = true : propsListing.ifResults = false;
      propsListing.apiReady = true;
      propsListing.stopInfiniteScroll = false;
      propsListing.loadingMore = false;
      $scope.$apply();
      uiFunctions.buildCarousel();
      uiFunctions.gridSwitcher();
      propsListing.updateChosen();
    });
  };

  // #endregion

  // #region On Init

  setActiveSection(propsListing.operationType);
  $anchorScroll();
  getProperties(tokkoApi, args);

  setTimeout(() => {
    uiFunctions.buildChosen();
    $('.chosen-select-no-single').val('price_asc');
    $('.chosen-select-no-single').trigger("chosen:updated");
  },0);

  // #endregion

  // #region Scoped Methods

  propsListing.goLocation = (url) => $state.go(url);

  propsListing.opName = (type) => type === 1 ? 'Venta' : type === 2 ? 'Alquiler' : 'Otro';

  propsListing.roomAmtName = (amount) => parseInt(amount) > 0 ? (amount == 1 ? `${amount} Dormitorio` : `${amount} Dormitorios`) : "Loft ";

  propsListing.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));    
    data.operation_types = propsListing.operationType;
    data.property_types = propsListing.propertyType;
    data.with_custom_tags = propsListing.subTypeSelected;
    data.current_localization_id = propsListing.location;
    data.filters = [propsListing.rooms];
    if (propsListing.minPrice) data.price_from = propsListing.minPrice;
    if (propsListing.maxPrice) data.price_to = propsListing.maxPrice;
    args.data = JSON.stringify(data);
    args.order_by = propsListing.order ? propsListing.order.order_by : 'price';
    args.order = propsListing.order ? propsListing.order.order : 'asc';
    args.offset = 0;
    getProperties(tokkoApi, args);
    $location.search({args: JSON.stringify(args)});

    setActiveSection(propsListing.operationType);
  };

  propsListing.changeFilter = (filter) => {    
    if (filter.type === 'o') {
      propsListing.operationType = filter.val;
    }
    if (filter.type === 't') {
      propsListing.propertyType = filter.val;
      propsListing.subTypeSelected = [];
    }
    if (filter.type === 'st') {
      propsListing.subTypeSelected = filter.val;
    }
    if (filter.type === 'l') {
      propsListing.location = filter.val;
    }
    if (filter.type === 'r') {
      propsListing.rooms = filter.val;
    }
    if (filter.type === 'or') {
      propsListing.order = {order_by: propsListing.orderBy.val.split('_')[0], order: propsListing.orderBy.val.split('_')[1]}
    }
    propsListing.find();
  };

  propsListing.updateChosen = () => {
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };

  propsListing.loadMoreProps = () => {
    const areAllPropsDisplayed = !propsListing.sideBarParams || !propsListing.sideBarParams.operations ? true : propsListing.sideBarParams.operations.reduce((a, b) => a + b.count, 0) == propsListing.results.length;
    
    args.offset += 20;
    propsListing.stopInfiniteScroll = true;
    propsListing.loadingMore = true;  
    getProperties(tokkoApi, args);

    if (areAllPropsDisplayed) propsListing.loadingMore = false;    
  };

  propsListing.toggleOrderModal = () => propsListing.isOrderOpen = !propsListing.isOrderOpen;

  propsListing.toggleFilterModal = () => propsListing.isFilterOpen = !propsListing.isFilterOpen;    

  propsListing.changeOrder = (newVal) => {
    propsListing.orderBy = newVal;
    propsListing.isOrderOpen = false;
    propsListing.changeFilter({type: 'or'});
  };

  propsListing.toggleActiveItem = (e) => { 
    e.stopPropagation();
        
    let item = e.target;

    while (!item.classList.contains("mobile-filter-modal-item")) item = item.parentElement;

    if (item.classList.contains("active")) item.classList.remove("active");
    else item.classList.add("active");
  };

  propsListing.pluralize = (name) => ['a','e','i','o','u'].includes(name.slice(-1)) ? `${name}s` : `${name}es`;

  propsListing.clearAllFilters = () => {
    propsListing.minPrice = '';
    propsListing.maxPrice = '';
    propsListing.operationType = [...Array(2 + 1).keys()].slice(1);
    propsListing.propertyType = [...Array(25 + 1).keys()].slice(1);
    propsListing.subTypeSelected = [];
    propsListing.location = [];
    propsListing.rooms = [];    
    propsListing.find();
  };

  // #endregion

  // #region Events

  $rootScope.$on('changeFilter', (event, {operationType}) => propsListing.changeFilter({type: 'o', val: [operationType]}));

  // #endregion

  // #region Scoped Objects

  propsListing.orderBy = {val: 'price_asc', text: 'Menor Precio'};

  propsListing.orderOptions = [
    {val: 'price_asc', text: 'Menor Precio'},
    {val: 'price_desc', text: 'Mayor Precio'},
    {val: 'id_asc', text: 'Más Recientes'}
  ];

  // #endregion
}]);