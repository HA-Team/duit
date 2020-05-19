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

const swipeSlider = function(e, slider, scope, length, currentNumberName, side) {
  e.stopPropagation();
  
  const pxToMove = [...slider.children].find(child => child.classList.contains("mobile-property-recomended-item")).offsetWidth; 

  scope.moveSlider(slider, length, currentNumberName, side, pxToMove);
};

app.controller('property', function($rootScope, $scope, tokkoApi, $stateParams) {      
  $rootScope.activeMenu = '';
  $scope.apiReady = false;
  $scope.isContactModalOpen = false;
  $scope.isGalleryOpen = false;
  $scope.generalFeaturesToShow = 5;

  $rootScope.sliderCounters = {
    currentPhoto: 1,
    currentFeatured: 1,
    currentSimilar: 1
  };
  
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
        icon: "fas fa-ruler-vertical",
        value: `${parseInt($scope.p.prop.total_surface)}m2`,
        name: "Superficie total",
        isVisible: parseInt($scope.p.prop.total_surface) > 0
      },
      {
        icon: "fas fa-door-open",
        value: $scope.p.enviroments,
        name: `Dormitorio${$scope.p.enviroments > 1 ? 's' : ''}`,
        isVisible: $scope.p.enviroments > 0
      },
      {
        icon: "fas fa-bath",
        value: $scope.p.baths,
        name: `Baño${$scope.p.baths > 1 ? 's' : ''}`,
        isVisible: $scope.p.baths > 0      
      },
      {
        icon: "fas fa-car",
        value: $scope.p.parkings,
        name: `Cochera${$scope.p.parkings > 1 ? 's' : ''}`,
        isVisible: $scope.p.parkings > 0 
      },
      {
        icon: "fas fa-toilet",
        value: $scope.p.toilets,
        name: `Toilet${$scope.p.toilets > 1 ? 's' : ''}`,
        isVisible: $scope.p.toilets > 0    
      },
      {
        icon: "far fa-calendar-alt",
        value: $scope.p.prop.age,
        name: "Antiguedad",
        isVisible: $scope.p.prop.age > 0      
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

    let mobileMap = new google.maps.Map(document.getElementById('mobile-property-map'), {
      center: myLatLng,
      zoom: 17
    });
    let mobileMarker = new google.maps.Marker({
      position: myLatLng,
      map: mobileMap,
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
      google.maps.event.trigger(mobileMap, 'resize');
    }, 0);

    const querySubject = `Consulta por propiedad %23${$scope.p.id}: ${$scope.p.prop.publication_title}`.replace(/\s/g, '%20');    

    const cellPhone = $scope.p.prop.producer.cellphone ? $scope.p.prop.producer.cellphone : $scope.p.prop.producer.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');    
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  

    const emailUri = `mailto:${$scope.p.prop.producer.email}?Subject=${querySubject}`;        
    
    document.querySelectorAll("#mobile-prop-detail .contact-globe-modal-icons a").forEach(item => {
      if (item.children[0].classList.contains('fa-whatsapp')) item.setAttribute("href", whatsAppUri);            
      if (item.children[0].classList.contains('fa-envelope')) item.setAttribute("href", emailUri);
    });      

    const sides = [
      { 
        side: 'left',
        oposite: 'right'
      },
      { 
        side: 'right',
        oposite: 'left'
      },
    ];
    
    const gallerySlider = document.querySelector("#mobile-property-gallery-slider .mobile-property-slider");
    sides.forEach(side => gallerySlider.addEventListener(`swiped-${side.side}`, () => {
      $scope.moveSlider(gallerySlider, $scope.p.prop.photos.length, 'currentPhoto', side.oposite);
      $scope.$apply();
    }));         

    const featuredSlider = document.querySelector("#mobile-property-featured-slider");
    sides.forEach(side => featuredSlider.addEventListener(`swiped-${side.side}`, function(e) {
      swipeSlider(e, this, $scope, $scope.featured.length, 'currentFeatured', side.oposite);
      $scope.$apply();
    }, {capture: true}));          

    const similarSlider = document.querySelector("#mobile-property-similar-slider");
    sides.forEach(side => similarSlider.addEventListener(`swiped-${side.side}`, function(e) {
      swipeSlider(e, this, $scope, $scope.similar.length, 'currentSimilar', side.oposite);
      $scope.$apply();
    }, {capture: true}));            
  });   

  $scope.moveSlider = (element, arrLength, index, side, pxToMove) => {                                             
    if (!pxToMove) pxToMove = window.innerWidth;         
     
    if (side == 'left') {
      if ($rootScope.sliderCounters[index] == 1) {
        $rootScope.sliderCounters[index] = arrLength;
        element.scrollLeft = pxToMove * (arrLength - 1);      
      } else {
        $rootScope.sliderCounters[index] -= 1;  
        element.scrollLeft = pxToMove * ($rootScope.sliderCounters[index] - 1);    
      }    
    }

    if (side == 'right') {
      if ($rootScope.sliderCounters[index] == arrLength) {
        $rootScope.sliderCounters[index] = 1;   
        element.scrollLeft = 0;   
      } else {      
        $rootScope.sliderCounters[index] += 1;      
        element.scrollLeft = pxToMove * ($rootScope.sliderCounters[index] - 1);
      } 
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
    const detail = document.querySelector("#mobile-prop-detail .description-detail");
    const preElement = detail.querySelector("pre");
    const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;        

    if (detail.classList.contains("visible")) {
      detail.classList.remove("visible");
      detail.style.maxHeight = '';
    }
    else {
      detail.classList.add("visible");    
      detail.style.maxHeight = maxHeight;
    }
  };

  const generalFeaturesList = document.querySelector(".mobile-property-general-features ul"); 
  const limitedHeight = `${$scope.generalFeaturesToShow * 40}px`;
  generalFeaturesList.style.maxHeight = limitedHeight;

  $scope.toggleGeneralFeatures = () => {          
    const maxHeight = `${$scope.p.prop.tags.length * 40}px`;        

    if (generalFeaturesList.classList.contains("open")) {
      generalFeaturesList.classList.remove("open");
      generalFeaturesList.style.maxHeight = limitedHeight;
    }
    else {
      generalFeaturesList.classList.add("open");    
      generalFeaturesList.style.maxHeight = maxHeight;
    }
  }

  $scope.toggleContactModal = () => $scope.isContactModalOpen = !$scope.isContactModalOpen;

  $scope.toggleGallery = () => {        
    const header = document.querySelector("#mobile-header");
    const contact = document.querySelector("#mobile-prop-detail .mobile-property-contact");
    const body = document.querySelector("body");
    
    $scope.isGalleryOpen = !$scope.isGalleryOpen;

    if ($scope.isGalleryOpen) {
      header.style.display = "none";
      contact.style.display = "none";      
      body.style.overflow = "hidden";
    }
    else {
      header.style.display = "block";
      contact.style.display = "flex";      
      body.style.overflow = "visible";
    }
  };

  $scope.contactGlobeOpenIcon = {
    iconClass: 'fab fa-whatsapp',
    color: 'var(--whatsapp-green)',
    fontSize: '3rem'    
  };

  $scope.contactGlobeCloseIcon = {
    iconClass: 'fa fa-times',
    color: 'var(--soft-grey)',
    fontSize: '3rem' 
  };

  $scope.contactGlobeActions = [
    {
      hRef: '#',
      iconClass: 'fab fa-whatsapp',
      color: 'var(--whatsapp-green)',      
    },
    {
      hRef: '#',
      iconClass: 'fa fa-envelope', 
      fontSize: '2.7rem'       
    }
  ];
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