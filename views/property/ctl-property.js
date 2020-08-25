app.controller('propertyController', ['$rootScope', '$scope', 'tokkoApi', '$stateParams', 'getFeaturedProperties', 'utils', function($rootScope, $scope, tokkoApi, $stateParams, getFeaturedProperties, utils) {   
  var property = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'propertySearch';

  property.utils = utils;
  property.apiReady = false;
  property.isContactModalOpen = false;
  property.isGalleryOpen = false;
  property.featuredPropsReady = false;
  property.similarReady = false;
  property.generalFeaturesToShow = 5;

  // #endregion

  // #region Private Properties

  const id = $stateParams.propertyId;

  const generalFeaturesList = document.querySelector(".mobile-property-general-features ul"); 
  const limitedHeight = `${property.generalFeaturesToShow * 40}px`;
  generalFeaturesList.style.maxHeight = limitedHeight;

  // #endregion

  // #region On Init

  getFeaturedProps();

  tokkoApi.findOne('property', id, (result) => {
    property.p =  {
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

    $rootScope.activeSection = property.p.operation_type == 'Venta' ? 'properties-sell' : 'properties-rent';
    
    getSimilarProps(result.operations[0].operation_type == 'Venta' ? 1 : 2, result.type.id, result.custom_tags);
    if (result.development) getDevelopmentProps(result.development.id);

    property.propertyMapped = {
      photos: result.photos,
      videos: result.videos,
      video_url: result.videos.length ? result.videos[0].player_url + "?rel=0&enablejsapi=1" : null 
    };    

    property.featuresItems = [
      {
        icon: "fas fa-ruler-vertical",
        value: `${parseInt(property.p.prop.total_surface)}m2`,
        name: "Superficie total",
        isVisible: parseInt(property.p.prop.total_surface) > 0
      },
      {
        icon: "fa fa-bed",
        value: property.p.enviroments,
        name: `Dormitorio${property.p.enviroments > 1 ? 's' : ''}`,
        isVisible: property.p.enviroments > 0
      },
      {
        icon: "fas fa-bath",
        value: property.p.baths,
        name: `Baño${property.p.baths > 1 ? 's' : ''}`,
        isVisible: property.p.baths > 0      
      },
      {
        icon: "fas fa-car",
        value: property.p.parkings,
        name: `Cochera${property.p.parkings > 1 ? 's' : ''}`,
        isVisible: property.p.parkings > 0 
      },
      {
        icon: "fas fa-toilet",
        value: property.p.toilets,
        name: `Toilet${property.p.toilets > 1 ? 's' : ''}`,
        isVisible: property.p.toilets > 0    
      },
      {
        icon: "far fa-calendar-alt",
        value: property.p.prop.age,
        name: "Antiguedad",
        isVisible: property.p.prop.age > 0      
      }
    ];

    let myLatLng = {lat: parseFloat(property.p.prop.geo_lat), lng: parseFloat(property.p.prop.geo_long)};

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

    property.apiReady = true;
    $scope.$apply();

    uiFunctions.showMoreButton();
    uiFunctions.buildSlickCarousel();
    uiFunctions.buildMagnificPopup();

    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      google.maps.event.trigger(mobileMap, 'resize');
    }, 0);

    const querySubject = `Consulta por propiedad %23${property.p.id}: ${property.p.prop.publication_title}`.replace(/\s/g, '%20');    

    const cellPhone = property.p.prop.producer.cellphone ? property.p.prop.producer.cellphone : property.p.prop.producer.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351'); 
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);            
    
    const emailUri = `mailto:${property.p.prop.producer.email}?Subject=${querySubject}`;        
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
  });   

  // #endregion

  // #region Private Methods

  function getFeaturedProps() {
    getFeaturedProperties.getFeaturedProps(result => {

      property.featuredProps = result.map(prop => {
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

      property.featuredPropsReady = true;

      $scope.$apply();
      uiFunctions.buildCarousel();
    });
  };

  function getSimilarProps(operationType, typeId, customTags) {
    getFeaturedProperties.getSimilarProps(operationType, typeId, customTags, result => {
      property.similarProps = result.map(prop => {
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

      property.similarReady = true;
      $scope.$apply();
    });
  };

  function getDevelopmentProps(id) {
    getFeaturedProperties.getDevelopmentProps(id, result => {
      property.devProps = result.map(prop => {
        return {
          id: prop.id,
          type: prop.operations[0].operation_type,
          title: prop.publication_title,
          currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
          price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
          cover_photo: prop.photos[0].image,
          parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
          area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
          sell: prop.operations.filter(p => prop.operation_type == "Venta")[0]?.prices.slice(-1)[0],
          rent: prop.operations.filter(p => prop.operation_type == "Alquiler")[0]?.prices.slice(-1)[0],
          parkings_av: prop.parking_lot_amount > 0 ? "Si" : "No",
          suite_amount: prop.suite_amount,
          bathroom_amount: result.bathroom_amount ? result.bathroom_amount : 0,
          address: prop.fake_address,
          prop: prop
        }
      });

      property.devPropsReady = true;
      $scope.$apply();
    });
  };

  // #endregion

  // #region Scoped Methods

  property.toggleDescriptionDetailDesktop = () => {
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

  property.toggleDescriptionDetail = () => {
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

  property.toggleGeneralFeatures = () => {          
    const maxHeight = `${property.p.prop.tags.length * 40}px`;        

    if (generalFeaturesList.classList.contains("open")) {
      generalFeaturesList.classList.remove("open");
      generalFeaturesList.style.maxHeight = limitedHeight;
    }
    else {
      generalFeaturesList.classList.add("open");    
      generalFeaturesList.style.maxHeight = maxHeight;
    }
  };

  property.toggleContactModal = () => property.isContactModalOpen = !property.isContactModalOpen;

  // #endregion

  // #region Scoped Objects

  property.contactGlobeOpenIcon = {
    iconClass: 'fab fa-whatsapp',
    color: 'var(--whatsapp-green)',
    fontSize: '3rem'    
  };

  property.contactGlobeCloseIcon = {
    iconClass: 'fa fa-times',
    color: 'var(--soft-grey)',
    fontSize: '3rem' 
  };

  property.contactGlobeActions = [
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

  property.availablePropsColumns = [
    {
      name: 'Ubicación',
      icon: 'fa fa-map-marker',
      data: 'address',
      fixed: true
    },
    {
      name: 'Precio',
      icon: 'fa fa-dollar-sign',
      data: 'price'
    },
    {
      name: 'Dormitorios',
      icon: 'fas fa-bed',
      data: 'suite_amount'
    },
    {
      name: 'Baños',
      icon: 'fas fa-bath',
      data: 'suite_amount'
    },
    {
      name: 'Superficie Total',
      icon: 'fas fa-ruler-vertical',
      data: 'area'
    },
    {
      name: 'Cochera',
      icon: 'fas fa-car',
      data: 'parkings_av'
    }
  ];

  // #endregion
}]);
