app.controller('featuredProps', function($scope, tokkoApi) {
  $scope.featured = [];
  $scope.featuredPropsReady = false;
  $scope.duit360PropsReady = false;

  let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
  data.filters.push(["is_starred_on_web", "=", "true"]);
  let args = {data: JSON.stringify(data), order: 'desc'};
  
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    
    result.forEach((p) => {
      props.push({
        id: p.id,
        title: p.publication_title,
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.suite_amount,
        baths: p.bathroom_amount,
        parkings: p.parking_lot_amount,
        cover_photo: p.photos[0].image,
        prop: p,
      })
    });

    $scope.featured = props;
    
    $scope.featuredGalleryMap = $scope.featured.map(item => {
      return {
        id: item.id,
        photo: item.cover_photo,
        price: item.price,
        currency: item.currency,
        subTitle: item.prop.location.short_location         
      }
    });  

    $scope.featuredPropsReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    $(window).trigger('resize');
  });
});