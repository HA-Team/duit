app.controller('propertyController', ['$rootScope', '$scope', '$timeout', 'tokkoApi', '$stateParams', 'getFeaturedProperties', 'utils', 'sliderMoves', '$filter', function($rootScope, $scope, $timeout, tokkoApi, $stateParams, getFeaturedProperties, utils, sliderMoves, $filter) {   
  var property = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'propertySearch';

  property.utils = utils;
  property.apiReady = false;
  property.isContactModalOpen = false;
  property.isGalleryOpen = false;
  property.featuredPropsReady = false;
  property.similarReady = false;
  property.showMoreFeatures = false;
  property.generalFeaturesToShow = 5;
  property.galleryIndex = 1;

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

    property.showDuit360 = property.p.hasDuit360;

    property.activeGalleryPhoto = property.p.cover_photo_original;

    $rootScope.activeSection = property.p.operation_type == 'Venta' ? 'properties-sell' : 'properties-rent';
    
    getSimilarProps(result.operations[0].operation_type == 'Venta' ? 1 : 2, result.type.id, property.p.price, result.custom_tags);
    
    if (result.development) getDevelopmentProps(result.development.id);

    property.propertyMapped = {
      photos: result.photos,
      videos: result.videos,
      video_url: result.videos.length ? result.videos[0].player_url + "?rel=0&enablejsapi=1" : null 
    };    

    property.featuresItems = [
      {
        icon: "fas fa-ruler-vertical",
        value: `${parseInt(property.p.prop.total_surface)}m²`,
        name: "Superficie total",
        isVisible: parseInt(property.p.prop.total_surface) > 0
      },
      {
        icon: "fa fa-bed",
        value: property.p.rooms,
        name: `Dormitorio${property.p.rooms > 1 ? 's' : ''}`,
        isVisible: property.p.rooms > 0
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

    property.desktopFeatures = [
      {
        title: 'Dormitorios',
        description: property.p.rooms,
      },
      {
        title: 'Superficie',
        description: property.p.area != 0 ? `${parseInt(property.p.area)} m²` : '',
      },
      {
        title: 'Baños',
        description: property.p.baths,
      },
      {
        title: 'Cocheras',
        description: property.p.parkings,
      },
      {
        title: 'Antiguedad',
        description: property.p.prop.age > 0 ? `${property.p.prop.age} ${property.p.prop.age == 1 ? 'año' : 'años'}` : '',
      },
      {
        title: 'Ambientes',
        description: property.p.enviroments,
      },
      {
        title: 'Toilettes',
        description: property.p.toilets,
      },
      {
        title: 'Zonificación',
        description: property.p.prop.zonification,
      },
      {
        title: 'Condición',
        description: property.p.prop.property_condition != '---' ? property.p.prop.property_condition : '',
      },
      {
        title: 'Plantas',
        description: property.p.prop.floors_amount,
      },
      {
        title: 'Situación',
        description: property.p.prop.situation != '---' ? property.p.prop.situation : '',
      },
      {
        title: 'Expensas',
        description: property.p.prop.expenses != 0 ? $filter('currency')(property.p.prop.expenses, '$', 0) : 0,
      },          
      {
        title: 'Orientación',
        description: property.p.prop.orientation,
      },
      {
        title: 'Disposición',
        description: property.p.prop.disposition,
      }
    ]

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

    const gallerySlider = document.querySelector('.thumb-gallery-slider');
    property.showGalleryArrows = gallerySlider ? gallerySlider.scrollWidth > gallerySlider.offsetWidth : false;

    $timeout(() => {
      google.maps.event.trigger(map, 'resize');
      google.maps.event.trigger(mobileMap, 'resize');
    });

    const querySubject = window.encodeURIComponent(`Consulta por propiedad #${property.p.id}: ${property.p.prop.publication_title}`);    

    const cellPhone = property.p.prop.producer.cellphone ? property.p.prop.producer.cellphone : property.p.prop.producer.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
    property.p.formatedPhone = cleanCellPhone.replace(/^549351/,'+54 9 351 ');
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);
    document.querySelector(".desktop-prop-detail-contact-container .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);
    
    const emailUri = `mailto:${property.p.prop.producer.email}?Subject=${querySubject}`;        
    document.querySelector("#mobile-prop-detail .contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
    document.querySelector(".desktop-prop-detail-contact-container .fa-envelope").parentElement.setAttribute("href", emailUri);

    const shareMessage = `https://wa.me/?text=${window.encodeURIComponent(`Mira que bueno para ${property.p.operation_type == 'Venta' ? 'comprar' : 'alquilar'}! ${window.location.href}`)}`;
    document.querySelector('.desktop-prop-detail-main-container .share-container a').setAttribute('href', shareMessage);
    document.querySelector('#mobile-prop-detail .share-container a').setAttribute('href', shareMessage);

    const featuresElement = document.querySelector(".collapsable-features");

    property.showMoreFeatures = featuresElement.scrollHeight > featuresElement.clientHeight || featuresElement.scrollWidth > featuresElement.clientWidth;

    $scope.$apply();
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
    });
  };

  function getSimilarProps(operationType, typeId, price, customTags) {
    getFeaturedProperties.getSimilarProps(operationType, typeId, price, customTags, result => {
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
      }).filter(p => p.id != property.p.id);

      property.similarProps = _.shuffle(property.similarProps);

      property.similarReady = true;
      $scope.$apply();
    });
  };

  function getDevelopmentProps(id) {
    getFeaturedProperties.getDevelopmentProps(id, result => {
      property.devProps = result.map(prop => {
        const price = prop.operations[prop.operations.length-1].prices.slice(-1)[0];

        const getSpecificAddressReg = /.+(\-.+)$/gs;
        const address = getSpecificAddressReg.exec(prop.address);

        return {
          id: prop.id,
          type: prop.operations[0].operation_type,
          title: prop.publication_title,
          currency: price.currency,
          price: $filter('currency')(price.price, `${price.currency} `, 0),
          property_type: prop.type.name,
          cover_photo: prop.photos[0].image,
          parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
          area: prop.type.id === 1 ? `${$filter('number')(prop.surface, 0)}m²` : `${$filter('number')(prop.roofed_surface, 0)}m²`,
          sell: prop.operations.filter(p => prop.operation_type == "Venta")[0]?.prices.slice(-1)[0],
          rent: prop.operations.filter(p => prop.operation_type == "Alquiler")[0]?.prices.slice(-1)[0],
          parkings_av: prop.parking_lot_amount > 0 ? "Si" : "No",
          suite_amount: prop.suite_amount,
          bathroom_amount: result.bathroom_amount ? result.bathroom_amount : 0,
          address: address ? address[1].replace('-', '').trim() : prop.fake_address,
          prop: prop
        }
      });

      property.devProps.splice(property.devProps.findIndex(prop => prop.id == property.p.id), 1);

      property.devPropsReady = true;
      $scope.$apply();
    });
  };

  // #endregion

  // #region Scoped Methods

  property.toggleDescriptionDetailDesktop = () => {
    const showMore = document.querySelector(".collapsable-title");
    const preElement = document.querySelector(".desktop-prop-detail-left-panel pre");
    const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;

    if (showMore.classList.contains("visible")) {
      showMore.classList.remove("visible");
      preElement.style.maxHeight = '';
    }
    else {
      showMore.classList.add("visible");
      preElement.style.maxHeight = maxHeight;
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

  property.isDateGreaterThanToday = (date) => utils.isDateGreaterThanToday(date);

  property.goToOtherUnits = () => document.getElementById("other-units-table").scrollIntoView({behavior: 'smooth'});

  property.setActiveImage = (image) => {
    property.showDuit360 = false;
    property.activeGalleryPhoto = image.image;
    property.galleryIndex = property.p.prop.photos.findIndex(i => i == image) + 1;
  }

  property.toggleGallery = () => {
    const header = document.querySelector("#header");                
    const body = document.querySelector("body");
    const slider = document.querySelector(".gallery-slider");

    property.isGalleryOpen = !property.isGalleryOpen;    

    if (property.isGalleryOpen) {
      header.style.display = "none";                    
      body.style.overflow = "hidden";
    }
    else {
      header.style.display = "block";                    
      body.style.overflow = "visible";
    }

    slider.style.scrollBehavior = 'unset';

    $timeout(() => {
      slider.scrollLeft = slider.querySelector("div").offsetWidth * (property.galleryIndex - 1);
      slider.style.scrollBehavior = 'smooth';
    });
  };

  property.moveSlider = (slider, side) => {
    const step = slider.querySelector('img').offsetWidth;

    if (side == 'left' && slider.scrollLeft > 0) slider.scrollLeft -= step;

    if (side == 'right') slider.scrollLeft = slider.scrollLeft + step;
  };

  property.moveGallerySlider = (slider, side) => {
    const width = slider.querySelector('div').offsetWidth;

    property.galleryIndex = sliderMoves.moveSliderByIndex(slider, property.galleryIndex, property.p.prop.photos.length, side, width);
  };

  property.showGeneralFeatures = (features) => features ? features.some(feature => feature.description) : false;

  property.toggleDuit360 = () => property.showDuit360 = !property.showDuit360;

  property.toggleAditionalFeatures = () => {
    const showMore = document.querySelector(".collapsable-features");
    const maxHeight = `${showMore.offsetHeight + showMore.offsetTop}px`;

    if (showMore.classList.contains("visible")) {
      showMore.classList.remove("visible");
      showMore.style.maxHeight = '';
    }
    else {
      showMore.classList.add("visible");
      showMore.style.maxHeight = maxHeight;
    }
  };

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

  property.desktopAvailablePropsColumns = [
    {
      name: 'Ubicación',
      data: 'address',
      fixed: true
    },
    {
      name: 'Precio',
      data: 'price'
    },
    {
      name: 'Unidad',
      data: 'property_type'
    },
    {
      name: 'Dormitorios',
      data: 'suite_amount'
    },
    {
      name: 'Baños',
      data: 'bathroom_amount'
    },
    {
      name: 'Superficie Total',
      data: 'area'
    },
    {
      name: 'Cochera',
      data: 'parkings_av'
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
      name: 'Unidad',
      icon: 'fas fa-home',
      data: 'property_type'
    },
    {
      name: 'Dormitorios',
      icon: 'fas fa-bed',
      data: 'suite_amount'
    },
    {
      name: 'Baños',
      icon: 'fas fa-bath',
      data: 'bathroom_amount'
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
