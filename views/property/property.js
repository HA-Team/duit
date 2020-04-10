const getFeatured = (scope, tokkoApi) => {
  scope.featured = [];
  scope.featReady = false;
  let data = tokkoSearchArgs.data;
  data.filters.push(["is_starred_on_web", "=", "true"]);
  const args = {data: JSON.stringify(data), order: 'desc'}
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        cover_photo: p.photos[0].thumb,
        parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        prop: p
      })
    });
    scope.featured = props;
    scope.featReady = true;
    scope.$apply();
    uiFunctions.buildCarousel();
  });  
};

const getSimilar = (scope, tokkoApi) => {
  scope.similar = [];
  scope.simReady = false;
  let data = tokkoSearchArgs.data;
  data.operation_types = scope.p.operation_type == 'Venta' ? [1] : [2];
  data.property_types = [scope.p.prop.type.id];
  data.filters = [];
  if(scope.p.prop.custom_tags.length > 0) {
    data.with_custom_tags = [scope.p.prop.custom_tags.slice(-1)[0].id];
  }
  const args = {data: JSON.stringify(data), order: 'desc'};
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        cover_photo: p.photos[0] ? p.photos[0].thumb : '/images/no-image.png',
        parkings: p.parking_lot_amount ? p.parking_lot_amount : 0,
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        prop: p
      })
    });
    scope.similar = props;
    scope.simReady = true;
    scope.$apply();
  });  
};

app.controller('property', function($rootScope, $scope, tokkoApi, $stateParams) {
  $rootScope.activeMenu = '';
  $scope.apiReady = false;
  const id = $stateParams.propertyId;
  tokkoApi.findOne('property', id, function(result){
    $scope.p =  {
      id: result.id,
      operation_type: result.operations[0].operation_type,
      currency: result.operations[result.operations.length-1].prices.slice(-1)[0].currency,
      price: result.operations[result.operations.length-1].prices.slice(-1)[0].price,
      rooms: result.suite_amount ? result.suite_amount : 0,
      enviroments: result.room_amount ? result.room_amount : 0,
      baths: result.bathroom_amount ? result.bathroom_amount : 0,
      toilets: result.toilet_amount ? result.toilet_amount : 0,
      cover_photo: result.photos[0].thumb,
      cover_photo_original: result.photos[0].image,
      parkings: result.parking_lot_amount ? result.parking_lot_amount : 0,
      area: result.type.id === 1 ? result.surface : result.roofed_surface,   
      state: result.location.short_location.replace(/\s\|.*/, ""),      
      prop: result,
    };

    $scope.featuresItems = [
      {
        icon: "",
        value: `${parseInt($scope.p.prop.total_surface)}m2`,
        name: "Superficie total"
      },
      {
        icon: "",
        value: `${parseInt($scope.p.prop.total_surface)}m2`,
        name: "Superficie cubierta"      
      },
      {
        icon: "",
        value: $scope.p.enviroments,
        name: "Ambientes"      
      },
      {
        icon: "",
        value: $scope.p.baths,
        name: "Baños"      
      },
      {
        icon: "",
        value: $scope.p.parkings,
        name: "Cocheras"      
      },
      {
        icon: "",
        value: $scope.p.toilets,
        name: "Toilets"      
      },
      {
        icon: "",
        value: $scope.p.prop.age,
        name: "Antiguedad"      
      },
      {
        icon: "",
        value: $scope.p.prop.disposition,
        name: "Disposición"      
      }
    ];

    let myLatLng = {lat: parseFloat($scope.p.prop.geo_lat), lng: parseFloat($scope.p.prop.geo_long)};
    let map = new google.maps.Map(document.getElementById('propertyMap'), {
      center: myLatLng,
      zoom: 17
    });
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: 'Duit'
    });
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.showMoreButton();
    uiFunctions.buildSlickCarousel();
    uiFunctions.buildMagnificPopup();
    getFeatured($scope, tokkoApi);
    getSimilar($scope, tokkoApi);
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
    }, 0)
  });
  
  $scope.currentPhotoNumber = 1;

  $scope.moveSliderLeft = () => {
    const slider = document.querySelector("#mobile-prop-detail .mobile-property-slider");
    const scrollWidth = slider.scrollWidth;
    const scrollLeft = slider.scrollLeft;
    const screenWidth = window.innerWidth;

    if (scrollLeft == 0) {
      slider.scrollLeft = scrollWidth - screenWidth;
      $scope.currentPhotoNumber = $scope.p.prop.photos.length;
    } else {
      $scope.currentPhotoNumber -= 1;
      slider.scrollLeft -= screenWidth;
    }
  };

  $scope.moveSliderRight = () => {
    const slider = document.querySelector("#mobile-prop-detail .mobile-property-slider");
    const scrollWidth = slider.scrollWidth;
    const scrollLeft = slider.scrollLeft;
    const screenWidth = window.innerWidth;
    
    if (scrollLeft == scrollWidth - screenWidth) {
      slider.scrollLeft = 0;
      $scope.currentPhotoNumber = 1;
    } else {      
      $scope.currentPhotoNumber += 1;
      slider.scrollLeft += screenWidth;
    }    
  };

  $scope.getDaysDifference = (date) => {
    const today = Date.now();    
    const newDate = new Date(date);
    const diffTime = Math.abs(newDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));   
  
    return diffDays;
  };

  $scope.toggleDescriptionDetail = () => {
    const detail = document.querySelector("#mobile-property-description .description-detail");

    if (detail.classList.contains("visible")) detail.classList.remove("visible");
    else detail.classList.add("visible");    
  }
});

app.controller('propContactForm', function($scope, tokkoApi) {
  $scope.submitText = 'Enviar';
  $scope.sending = false;
  $scope.success = false;
  $scope.error = false;
  $scope.send = function () {
    if ($scope.name || $scope.email) {
      $scope.submitText = 'Enviando';
      $scope.sending = true;
      const data = {
        email: $scope.email,
        phone: $scope.phone,
        text: $scope.message,
        properties: [$scope.p.id],
      };
      tokkoApi.insert('webcontact', data, function (response) {
        if (response.result=='success') {
          $scope.sending = false;
          $scope.submitText = 'Enviar';
          $scope.success = true;
          $scope.email = '';
          $scope.phone = '';
          $scope.message = '';
          setTimeout(function(){
            $scope.success = false;
            $scope.$apply()
          },3000);
          $scope.$apply();
        } else {
          $scope.error = true;
          $scope.$apply();
          setTimeout(function(){
            $scope.error = false;
            $scope.$apply()
          },3000);
        }
      });
    }
  };
});