app.controller('propsListingController', ['$location', '$rootScope', '$scope', 'tokkoApi', '$stateParams', '$state', '$anchorScroll', 'utils', 'sharedData', 'getFeaturedProperties', '$q', function($location, $rootScope, $scope, tokkoApi, $stateParams, $state, $anchorScroll, utils, sharedData, getFeaturedProperties, $q){
  var propsListing = this;
  
  // #region Private Properties

  let args = JSON.parse($stateParams.args);
  let data = JSON.parse(args.data);
  var getTokkoProperties = null;

  // #endregion
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'propertySearch';
  propsListing.results = [];
  propsListing.resultsCount = 0;
  propsListing.sideBarParams = {};
  propsListing.tags = [];
  propsListing.filters = {
    operations: {
      isActive: false,
      default: [...Array(2 + 1).keys()].slice(1),
      action: () => propsListing.changeFilter({ type: 'o', val: this.filters.operations.default })
    },
    types: {
      isActive: false,
      default: [...Array(25 + 1).keys()].slice(1).filter(type => type != 21), // This filter is used to avoid properties of type 'isla', because that type is used to fetch properties for using just its background images.
      action: () => propsListing.changeFilter({ type: 't', val: this.filters.types.default })
    },
    subTypes: {
      isActive: false,
      default: [],
      action: () => propsListing.changeFilter({ type: 'st', val: this.filters.subTypes.default })
    },
    rooms: {
      isActive: false,
      default: [],
      action: () => propsListing.changeFilter({ type: 'r', val: this.filters.rooms.default })
    },
    cities: {
      isActive: false,
      default: [],
      action: () => propsListing.changeFilter({ type: 'c', val: this.filters.cities.default })
    },
    locations: {
      isActive: false,
      default: [],
      action: () => propsListing.changeFilter({ type: 'l', val: this.filters.locations.default })
    }
  };

  console.log(propsListing.filters.types.default);

  propsListing.apiReady = true;
  propsListing.ifResults = true;
  propsListing.stopInfiniteScroll = true;
  propsListing.loadingMore = false;
  propsListing.isOrderOpen = false;
  propsListing.isFilterOpen = false;

  propsListing.operationType = data.operation_types;
  propsListing.propertyType = data.property_types;  

  // #endregion

  // #region Private Methods

  const setActiveSection = (operationType) => $rootScope.activeSection = operationType == 1 ? 'properties-sell' : 'properties-rent';

  const getProperties = (tokkoApi, rargs) => {
    let args = {data: rargs.data, order: rargs.order, order_by: rargs.order_by, limit: rargs.limit ? rargs.limit : 20, offset: rargs.offset ? rargs.offset : 0}
    if (args.offset == 0) {
      propsListing.apiReady = false;
      propsListing.results = [];
      
      tokkoApi.find('property/get_search_summary', args,  $q.defer()).then(result => {
        result = result.data;
        const cities = result.objects.locations.map(loc => {
          city = {
            id: loc.parent_id,
            name: loc.parent_name            
          };
    
          return city;
        });
    
        let types = result.objects.property_types;
        propsListing.sideBarParams = {
          locations: result.objects.locations,
          cities: cities.filter((val, ind, arr) => arr.findIndex(t => val.id && (t.id === val.id)) === ind),
          types: types.sort((a, b) => b.count - a.count),
          subTypes: (() => {
            if (propsListing.subTypeSelected && propsListing.subTypeSelected.length > 0 && types[0]) {
              return [sharedData.propertiesSubTypes[types[0].id].find(x => x.id === propsListing.subTypeSelected[0])]
            } else {
              return types.length === 1 ? sharedData.propertiesSubTypes[types[0].id] : [];
            }
          })(),
          operations: result.objects.operation_types.sort((a, b) => b.count - a.count),
          rooms: result.objects.suite_amount.sort((a, b) => b.count - a.count),
        };
    
        propsListing.sideBarParams.cities.forEach(city => {
            city.count = cities.filter(c => c.id == city.id).length;
        });
    
        if (propsListing.sideBarParams.rooms.find(room => room.amount == 0)) {
          const propsWithoutRoomsDiffThanHousesOrDepts = propsListing.sideBarParams.types.filter(type => type.id != 2 && type.id != 3).length > 0 ? propsListing.sideBarParams.types.reduce((total, type) => type.id != 2 && type.id != 3 ? total += type.count : 0, 0) : 0;
          propsListing.sideBarParams.rooms.find(room => room.amount == 0).count -= propsWithoutRoomsDiffThanHousesOrDepts;
        }
    
        propsListing.isAnyTypeHouseOrDept =propsListing.sideBarParams.types.some(type => type.id == 2 || type.id == 3);
    
        propsListing.resultsCount = result.meta.total_count;
      }, reject => null );
    }
    
    (getTokkoProperties = getFeaturedProperties.getProperties('property/search', args)).then(result => {
      console.log(result);
      result.objects.forEach((p) => {
        const isDevAlreadyInResults = propsListing.results.some(prop => prop.development?.id == p.development?.id);
  
        if (p.development && isDevAlreadyInResults) {
          const isTypeAlreadyInResults = propsListing.results.some(prop => prop.development?.id == p.development?.id && prop.full_prop.type.id == p.type.id);
  
          if (!isTypeAlreadyInResults) pushPropertyToResults(p);
          else {
            const existingProp = propsListing.results.filter(prop => prop.development?.id == p.development?.id && prop.full_prop.type.id == p.type.id)[0];
            const newPropPrice = p.operations[p.operations.length - 1].prices.slice(-1)[0].price;
  
            if (newPropPrice < existingProp.price) {
              existingProp.price = newPropPrice;
              existingProp.id = p.id;
            }
            existingProp.numberOfPropsForDevelopment ++;
          }
        }
        else pushPropertyToResults(p);
      });
  
      propsListing.results.length > 0 ? propsListing.ifResults = true : propsListing.ifResults = false;
      propsListing.apiReady = true;
      propsListing.stopInfiniteScroll = false;
      propsListing.loadingMore = false;
    }, reject => null);
  };

  const pushPropertyToResults = (prop) => {
    propsListing.results.push({
      id: prop.id,
      title: prop.publication_title,
      address: prop.address,
      agent: prop.branch ? prop.branch.name : '',
      area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
      type: prop.operations[0].operation_type,
      currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency === 'ARS' ? '$' : prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
      price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
      rooms: prop.suite_amount ? prop.suite_amount : 0,
      baths: prop.bathroom_amount ? prop.bathroom_amount : 0,
      parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
      cover_photo: prop.photos.length > 0 ? prop.photos[0].thumb : '/images/no-image.png',
      photos: prop.photos.length > 0 ? prop.photos : [{image: '/images/no-image.png'}],
      location: prop.location,
      development: prop.development,
      numberOfPropsForDevelopment: 1,
      full_prop: prop,
    });
  };

  const setInitialTags = () => {
    if (propsListing.operationType.length == 1) {
      propsListing.filters.operations.isActive = true;
      propsListing.filters.operations.name = propsListing.opName(propsListing.operationType[0]);
      propsListing.filters.operations.selected = propsListing.operationType[0];      
    }

    if (propsListing.propertyType.length == 1) {
      const name = sharedData.propertiesTypes.find(type => type.id == propsListing.propertyType[0]).name;
      propsListing.filters.types.isActive = true;
      propsListing.filters.types.name = name;
      propsListing.filters.types.selected = propsListing.propertyType[0];
    }

    if (data.filters[0] && data.filters[0].length > 0) {
      const rooms = data.filters[0][2];
      const name = propsListing.roomAmtName(rooms);
      propsListing.filters.rooms.isActive = true;
      propsListing.filters.rooms.name = name;
      propsListing.filters.rooms.selected = ["suite_amount", "=", rooms.toString()];
    }
  };

  const cleanFilter = (name) => {
    propsListing.filters[name].isActive = false;
    propsListing.filters[name].name = null;
    propsListing.filters[name].selected = null;
  }

  const handleFilter = (filter, name) => {
    if (filter.val == propsListing.filters[name].default) {
      cleanFilter(name);
    } else {
      propsListing.filters[name].isActive = true;
      propsListing.filters[name].name = filter.name;
      propsListing.filters[name].selected = filter.val;
    }
  }

  // #endregion

  // #region Scoped Methods

  propsListing.goLocation = (url) => $state.go(url);

  propsListing.opName = (type) => type == 1 ? 'Venta' : type == 2 ? 'Alquiler' : 'Otro';

  propsListing.roomAmtName = (amount) => parseInt(amount) > 0 ? (amount == 1 ? `${amount} Dormitorio` : `${amount} Dormitorios`) : "Loft ";

  propsListing.find = () => {
    getTokkoProperties.abort();
    let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));  

    data.operation_types = propsListing.operationType;
    data.property_types = propsListing.propertyType;
    data.with_custom_tags = propsListing.subTypeSelected;
    data.current_localization_id = propsListing.location;
    data.filters = [propsListing.rooms];

    if (propsListing.minPrice) data.price_from = propsListing.minPrice;
    if (propsListing.maxPrice) data.price_to = propsListing.maxPrice;

    if (data.filters[0] && data.filters[0][2] == '0') {
      data.property_types = data.property_types.filter(type => type == 2 || type == 3);
    }

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
      handleFilter(filter, 'operations');
    }

    if (filter.type === 't') {
      propsListing.propertyType = filter.val;
      propsListing.subTypeSelected = [];
      handleFilter(filter, 'types');
    }

    if (filter.type === 'st') {
      propsListing.subTypeSelected = filter.val;
      handleFilter(filter, 'subTypes');
    }

    if (filter.type === 'r') {
      propsListing.rooms = filter.val;
      handleFilter(filter, 'rooms');    
    }

    if (filter.type === 'c') {
      propsListing.location = propsListing.sideBarParams.locations.filter(loc => loc.parent_id && loc.parent_id == filter.val).map(loc => loc.location_id);
      cleanFilter('locations');
      handleFilter(filter, 'cities'); 
    }

    if (filter.type === 'l') {
      propsListing.location = filter.val;
      cleanFilter('cities');
      handleFilter(filter, 'locations'); 
    }

    if (filter.type === 'or') {
      propsListing.order = {order_by: propsListing.orderBy.val.split('_')[0], order: propsListing.orderBy.val.split('_')[1]}
    }

    propsListing.find();
  };

  propsListing.loadMoreProps = () => {
    args.offset += 20;
    propsListing.stopInfiniteScroll = true;
    propsListing.loadingMore = true;  
    getProperties(tokkoApi, args);

    const numberOfPropsInResults = propsListing.results.reduce((a, b) => a + b.numberOfPropsForDevelopment, 0);
    const areAllPropsDisplayed = !propsListing.sideBarParams || !propsListing.sideBarParams.operations ? true : propsListing.resultsCount == numberOfPropsInResults;

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

  propsListing.pluralize = utils.pluralize;

  propsListing.clearAllFilters = () => {
    propsListing.minPrice = propsListing.filters.minPrice.default;
    propsListing.maxPrice = propsListing.filters.maxPrice.default;
    propsListing.operationType = propsListing.filters.operations.default;
    propsListing.propertyType = propsListing.filters.types.default;
    propsListing.subTypeSelected = propsListing.filters.subTypes.default;
    propsListing.location = propsListing.filters.locations.default;
    propsListing.rooms = propsListing.filters.rooms.default;    
    propsListing.find();
  };

  propsListing.doesPropertyHasEnvironments = (p) => p.full_prop.type.id != 10 && p.full_prop.type.id != 1;

  propsListing.toggleMoreLocations = (event) => {
    const itemsContainerElement = event.target.previousElementSibling;
    const maxHeight = `${itemsContainerElement.scrollHeight}px`;

    if (itemsContainerElement.classList.contains("visible")) {
      itemsContainerElement.classList.remove("visible");
      itemsContainerElement.style.maxHeight = '';
    }
    else {
      itemsContainerElement.classList.add("visible");
      itemsContainerElement.style.maxHeight = maxHeight;
    }
  };

  // #endregion

  // #region On Init

  setActiveSection(propsListing.operationType);
  $anchorScroll();

  delete data.current_localization_id;
  args.data = JSON.stringify(data);
  getProperties(tokkoApi, args);

  setInitialTags();

  // #endregion

  // #region Events

  $rootScope.$on('changeFilter', (event, {operationType}) => {
    propsListing.tags = propsListing.tags.filter(tag => tag.type != 'o');
    propsListing.changeFilter({type: 'o', name: propsListing.opName(operationType), val: [operationType]});
  });

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