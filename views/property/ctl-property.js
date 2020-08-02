app.controller('property', ['$rootScope', '$scope', 'tokkoApi', '$stateParams', 'getFeaturedProperties', 'utils', function($rootScope, $scope, tokkoApi, $stateParams, getFeaturedProperties, utils) {   
  // #region Public Properties

  $scope.utils = utils;  
  $rootScope.activeMenu = 'propertySearch';
  $scope.apiReady = false;
  $scope.isContactModalOpen = false;
  $scope.isGalleryOpen = false;
  $scope.featuredPropsReady = false;
  $scope.similarReady = false;
  $scope.generalFeaturesToShow = 5;

  // #endregion

  // #region Private Properties

  const id = $stateParams.propertyId;

  const generalFeaturesList = document.querySelector(".mobile-property-general-features ul"); 
  const limitedHeight = `${$scope.generalFeaturesToShow * 40}px`;
  generalFeaturesList.style.maxHeight = limitedHeight;

  // #endregion

  // #region On Init

  getFeaturedProps();

  tokkoApi.findOne('property', id, (result) => {
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
      videos: result.videos,
      hasDuit360: result.videos.some(video => video.provider_id == 6)
    };

    $rootScope.activeSection = $scope.p.operation_type == 'Venta' ? 'properties-sell' : 'properties-rent';
    
    getSimilarProps(result.operations[0].operation_type == 'Venta' ? 1 : 2, result.type.id, result.custom_tags);

    $scope.propertyMapped = {
      photos: result.photos,
      videos: result.videos,
      video_url: result.videos.length ? result.videos[0].player_url + "?rel=0&enablejsapi=1" : null 
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

    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      google.maps.event.trigger(mobileMap, 'resize');
    }, 0);

    const querySubject = `Consulta por propiedad %23${$scope.p.id}: ${$scope.p.prop.publication_title}`.replace(/\s/g, '%20');    

    const cellPhone = $scope.p.prop.producer.cellphone ? $scope.p.prop.producer.cellphone : $scope.p.prop.producer.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351'); 
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);            
    
    const emailUri = `mailto:${$scope.p.prop.producer.email}?Subject=${querySubject}`;        
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
  });   

  // #endregion

  // #region Private Methods

  function getFeaturedProps() {
    getFeaturedProperties.getFeaturedProps(result => {

      $scope.featuredProps = result.map(prop => {
        return {
          id: prop.id,
          title: prop.publication_title,
          type: prop.operations[0].operation_type,
          currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
          price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
          cover_photo: prop.photos[0].image,
          parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
          area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
          suitAmount: prop.suite_amount ? prop.suite_amount : 0,
          bathroomAmount: prop.bathroom_amount ? prop.bathroom_amount : 0,  
          prop: prop
        }
      });

      $scope.featuredPropsReady = true;

      $scope.$apply();
      uiFunctions.buildCarousel();
    });
  };

  function getSimilarProps(operationType, typeId, customTags) {
    getFeaturedProperties.getSimilarProps(operationType, typeId, customTags, result => {
      $scope.similarProps = result.map(prop => {
        return {
          id: prop.id,
          title: prop.publication_title,
          type: prop.operations[0].operation_type,
          currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
          price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
          cover_photo: prop.photos[0] ? prop.photos[0].image : '/images/no-image.png',
          parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
          area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
          suitAmount: prop.suite_amount ? prop.suite_amount : 0,
          bathroomAmount: prop.bathroom_amount ? prop.bathroom_amount : 0,
          prop: prop
        }
      });

      $scope.similarReady = true;
      $scope.$apply();
    });
  };

  // #endregion

  // #region Public Methods

  $scope.toggleDescriptionDetailDesktop = () => {
    const showMore = document.querySelector(".show-more");
    const preElement = showMore.querySelector("pre");
    const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;

    if (showMore.classList.contains("visible")) {
      showMore.classList.remove("visible");
      showMore.style.maxHeight = '';
    }
    else {
      showMore.classList.add("visible");
      showMore.style.maxHeight = maxHeight;
    }
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
  };

  $scope.toggleContactModal = () => $scope.isContactModalOpen = !$scope.isContactModalOpen;

  // #endregion

  // #region Public Objects

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

  // #endregion
}]);
