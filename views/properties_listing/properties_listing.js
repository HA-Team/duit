app.controller('propsListing', function($location, $rootScope, $scope, tokkoApi, $stateParams, $state, $anchorScroll){
  $rootScope.activeMenu = '';
  $scope.results = [];
  $scope.resultsCount = 0;
  $scope.sideBarParams = {};
  $scope.filteredResults = [];
  $scope.apiReady = true;
  $scope.ifResults = true;
  $scope.stopInfiniteScroll = true;
  $scope.loadingMore = false;
  $scope.orderOptions = [
    {val: 'price_asc', text: 'Menor Precio'},
    {val: 'price_desc', text: 'Mayor Precio'},
    {val: 'id_asc', text: 'Más Recientes'}
  ]
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
    args.order_by = $scope.order.order_by ? $scope.order.order_by : 'price';
    args.order = $scope.order.order ? $scope.order.order : 'asc';
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
    if (filter.type === 'or') {
      $scope.order = {order_by: $scope.orderBy.val.split('_')[0], order: $scope.orderBy.val.split('_')[1]}
    }
    $scope.find();
  }
  setTimeout(() => {
    uiFunctions.buildChosen();
    $('.chosen-select-no-single').val('price_asc');
    $('.chosen-select-no-single').trigger("chosen:updated");
  },0);
  $scope.updateChosen = () => {
    setTimeout(() => {
      $('.chosen-select-no-single').trigger("chosen:updated");
    }, 0);
  };
  $scope.loadMoreProps = () => {
    args.offset += 20;
    $scope.stopInfiniteScroll = true;
    $scope.loadingMore = true;
    getProperties($scope, tokkoApi, args);
  };
  $scope.addFavorite = ($event, propId) => {
    $event.preventDefault();
    $($event.currentTarget).toggleClass('liked');
    if (Meteor.user()) {
      tokkoApi.findOne('property', propId, function(result){
        let propObj = result;
        Meteor.call('insertFavorite', { userId: Meteor.user()._id, prop: propObj})
      });
    }
  };
});