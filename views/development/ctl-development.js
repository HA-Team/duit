app.controller('developmentController', ['$rootScope', '$scope', '$timeout', 'tokkoApi', '$stateParams', 'getFeaturedProperties', 'utils', 'sliderMoves', '$filter', function ($rootScope, $scope, $timeout, tokkoApi, $stateParams, getFeaturedProperties, utils, sliderMoves, $filter) {
  var development = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'developments';
  $rootScope.activeSection = '';
  
  development.apiReady = false;
  development.featuredPropsReady = false;
  development.devPropsReady = false;
  development.generalFeaturesToShow = 5;
  development.isContactModalOpen = false;
  development.isGalleryOpen = false;
  development.galleryIndex = 1;

  // #endregion

  // #region Private Properties

  const id = $stateParams.devId;
  const generalFeaturesList = document.querySelector(".mobile-dev-general-features ul"); 
  const limitedHeight = `${development.generalFeaturesToShow * 40}px`;
  generalFeaturesList.style.maxHeight = limitedHeight;

  // #endregion

  // #region On Init

  getFeaturedProps();

	tokkoApi.findOne('development', id, function (result) {
    development.d = result;

    development.activeGalleryPhoto = result.photos[0].image;

    development.developmentMapped = {
      photos: result.photos
    };

    getDevelopmentProps(result.id);
    
    let myLatLng = { lat: parseFloat(result.geo_lat), lng: parseFloat(result.geo_long) };
    
		let map = new google.maps.Map(document.getElementById('propertyMap'), {
			center: myLatLng,
			zoom: 17,
    });

    let marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: result.name,
    });

    let mobileMap = new google.maps.Map(document.getElementById('mobile-dev-map'), {
			center: myLatLng,
			zoom: 17,
    });
    
		let mobileMarker = new google.maps.Marker({
			position: myLatLng,
			map: mobileMap,
			title: result.name,
    });
    
		development.apiReady = true;
    $scope.$apply();    

    const gallerySlider = document.querySelector('.thumb-gallery-slider');
    development.showGalleryArrows = gallerySlider ? gallerySlider.scrollWidth > gallerySlider.offsetWidth : false;

		$timeout(() => google.maps.event.trigger(map, 'resize'));
    
    const querySubject = window.decodeURIComponent(`Consulta por propiedad #${development.d.id}:${development.d.publication_title}`);    

    const cellPhone = development.d.users_in_charge.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
    development.d.formatedPhone = cleanCellPhone.replace(/^549351/,'+54 9 351 '); 
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  
    document.querySelector("#mobile-dev-detail .contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);
    document.querySelector(".desktop-prop-detail-contact-container .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);            
    
    const emailUri = `mailto:${development.d.users_in_charge.email}?Subject=${querySubject}`;        
    document.querySelector("#mobile-dev-detail .contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
    document.querySelector(".desktop-prop-detail-contact-container .fa-envelope").parentElement.setAttribute("href", emailUri);

    const shareMessage = `https://wa.me/?text=${window.encodeURIComponent(`Mira que bueno este emprendimiento de duit! ${window.location.href}`)}`;
    document.querySelector('.desktop-prop-detail-main-container .share-container a').setAttribute('href', shareMessage);
    document.querySelector('#mobile-dev-detail .share-container a').setAttribute('href', shareMessage);
  });

  // #endregion

  // #region Private Methods

  function getFeaturedProps() {
    getFeaturedProperties.getFeaturedProps(result => {

      development.featuredProps = result.map(prop => {
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

      development.featuredProps = _.shuffle(development.featuredProps);

      development.featuredPropsReady = true;
      $scope.$apply();
    });
  };

  function getDevelopmentProps(id) {
    getFeaturedProperties.getDevelopmentProps(id, result => {
      development.devProps = result.map(prop => {
        const price = prop.operations[prop.operations.length-1].prices.slice(-1)[0];

        if (price.price < development.d.minPrice || !development.d.minPrice) {
          development.d.minPrice = price.price;
          development.d.minPriceCurrency = price.currency;
        }

        const getSpecificAddressReg = /.+(\-.+)$/gs;
        const address = getSpecificAddressReg.exec(prop.address);
        
        return {
          id: prop.id,
          type: prop.operations[0].operation_type,
          title: prop.publication_title,
          property_type: prop.type.name,
          currency: price.currency,
          price: $filter('currency')(price.price, `${price.currency} `, 0),
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

      development.devPropsReady = true;
      $scope.$apply();
    });
  };

  // #endregion

  // #region Scoped Methods

  development.toggleGeneralFeatures = () => {          
    const maxHeight = `${development.d.tags.length * 40}px`;        

    if (generalFeaturesList.classList.contains("open")) {
      generalFeaturesList.classList.remove("open");
      generalFeaturesList.style.maxHeight = limitedHeight;
    }
    else {
      generalFeaturesList.classList.add("open");    
      generalFeaturesList.style.maxHeight = maxHeight;
    }
  };

  development.toggleDescriptionDetail = () => {
    const detail = document.querySelector("#mobile-dev-detail .description-detail");
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

  development.toggleDescriptionDetailDesktop = () => {
    const showMore = document.querySelector(".show-more-dev");
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

  development.toggleContactModal = () => development.isContactModalOpen = !development.isContactModalOpen;

  development.isDateGreaterThanToday = (date) => utils.isDateGreaterThanToday(date);

  development.toggleGallery = () => {
    const header = document.querySelector("#header");                
    const body = document.querySelector("body");
    const slider = document.querySelector(".gallery-slider");

    development.isGalleryOpen = !development.isGalleryOpen;    

    if (development.isGalleryOpen) {
      header.style.display = "none";                    
      body.style.overflow = "hidden";
    }
    else {
      header.style.display = "block";                    
      body.style.overflow = "visible";
    }

    slider.style.scrollBehavior = 'unset';

    $timeout(() => {
      slider.scrollLeft = slider.querySelector("div").offsetWidth * (development.galleryIndex - 1);
      slider.style.scrollBehavior = 'smooth';
    });
  };

  development.moveSlider = (slider, side) => {
    const step = slider.querySelector('img').offsetWidth;

    if (side == 'left' && slider.scrollLeft > 0) slider.scrollLeft -= step;

    if (side == 'right') slider.scrollLeft = slider.scrollLeft + step;
  };

  development.moveGallerySlider = (slider, side) => {
    const width = slider.querySelector('div').offsetWidth;

    development.galleryIndex = sliderMoves.moveSliderByIndex(slider, development.galleryIndex, development.d.photos.length, side, width);
  };

  development.setActiveImage = (image) => {
    development.activeGalleryPhoto = image.image;
    development.galleryIndex = development.d.photos.findIndex(i => i == image) + 1;
  };

  development.toggleDescriptionDetailDesktop = () => {
    
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

  // #endregion

  // #region Scoped Objects

  development.contactGlobeOpenIcon = {
    iconClass: 'fab fa-whatsapp',
    color: 'var(--whatsapp-green)',
    fontSize: '3rem'    
  };

  development.contactGlobeCloseIcon = {
    iconClass: 'fa fa-times',
    color: 'var(--soft-grey)',
    fontSize: '3rem' 
  };

  development.contactGlobeActions = [
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

  development.desktopAvailablePropsColumns = [
    {
      name: 'Ubicación',
      data: 'address',
      fixed: true,
      sort: 'az'
    },
    {
      name: 'Precio',
      data: 'price',
      sort: 'number'
    },
    {
      name: 'Unidad',
      data: 'property_type',
      sort: 'az'
    },
    {
      name: 'Dormitorios',
      data: 'suite_amount',
      sort: 'number'
    },
    {
      name: 'Baños',
      data: 'bathroom_amount',
      sort: 'number'
    },
    {
      name: 'Superficie Total',
      data: 'area',
      sort: 'number'
    },
    {
      name: 'Cochera',
      data: 'parkings_av',
      sort: 'az'
    }
  ];

  development.availablePropsColumns = [
    {
      name: 'Ubicación',
      icon: 'fa fa-map-marker',
      data: 'address',
      fixed: true,
      sort: 'az'
    },
    {
      name: 'Precio',
      icon: 'fa fa-dollar-sign',
      data: 'price',
      sort: 'number'
    },
    ,
    {
      name: 'Unidad',
      icon: 'fas fa-home',
      data: 'property_type',
      sort: 'az'
    },
    {
      name: 'Dormitorios',
      icon: 'fas fa-bed',
      data: 'suite_amount',
      sort: 'number'
    },
    {
      name: 'Baños',
      icon: 'fas fa-bath',
      data: 'bathroom_amount',
      sort: 'number'
    },
    {
      name: 'Superficie Total',
      icon: 'fas fa-ruler-vertical',
      data: 'area',
      sort: 'number'
    },
    {
      name: 'Cochera',
      icon: 'fas fa-car',
      data: 'parkings_av',
      sort: 'az'
    }
  ];
  

  // #endregion
}]);
