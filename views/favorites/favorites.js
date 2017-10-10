app.controller('favorites', function($location, $rootScope, $scope, tokkoApi, $state, $anchorScroll){
  $rootScope.activeMenu = '';
  $scope.results = [];
  $scope.apiReady = true;
  $scope.ifResults = true;
  $rootScope.$watch('favorites.dataLoaded', function(dataLoaded) {
    if (dataLoaded) {
      $rootScope.favorites.props.forEach((p) => {
        $scope.results.push({
          id: p.id,
          title: p.publication_title,
          address: p.address,
          agent: p.branch ? p.branch.name : '',
          area: p.roofed_surface,
          type: p.operations[0].operation_type,
          currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
          price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
          rooms: p.suite_amount ? p.suite_amount : 0,
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
      $scope.resultsCount = $scope.results.length;
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
      $anchorScroll();
      setTimeout(() => {
        uiFunctions.buildChosen();
        uiFunctions.buildCarousel();
        uiFunctions.gridSwitcher();
      },0)
      $scope.updateChosen = () => {
        setTimeout(() => {
          $('.chosen-select-no-single').trigger("chosen:updated");
        }, 0);
      };
    }
  });
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