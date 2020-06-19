app.controller('property', function($rootScope, $scope, tokkoApi, $stateParams, getFeaturedProperties, sliderMoves, timeUtils) {   
  $scope.timeUtils = timeUtils;
  
  $rootScope.activeMenu = '';
  $scope.apiReady = false;
  $scope.isContactModalOpen = false;
  $scope.isGalleryOpen = false;
  $scope.generalFeaturesToShow = 5;
  $scope.currentPhoto = 1;
  $scope.currentFeatured = 1;
  
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

    getFeaturedProperties.getFeatured($scope, tokkoApi);
    getFeaturedProperties.getSimilar($scope, tokkoApi);
    
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

    $scope.moveSlider = (element, index, arrLength, side, pxToMove) => { 
      $scope[index] = sliderMoves.moveSlider(element, $scope[index], arrLength, side, pxToMove);
      $scope.$apply();
    };

    const sides = [
      {
        side: 'left',
        oposite: 'right'
      },
      {
        side: 'right',
        oposite: 'left'
      }
    ];

    sides.forEach(side => {
      const gallerySlider = document.querySelector("#mobile-property-gallery-slider .mobile-property-slider");
      const gallerySliderArrow = document.querySelector(`#mobile-property-gallery-slider .fa-angle-${side.side}`);
      const featuredSlider = document.querySelector("#mobile-property-featured-slider");
      const featuredSliderArrow = document.querySelector(`.mobile-property-recomended .fa-angle-${side.side}`);

      const setCounterLabel = () => {
        const counterLabel = document.querySelector("#mobile-property-gallery-slider .mobile-slider-photo-counter p");
        counterLabel.innerHTML = `${$scope.currentPhoto}/${$scope.p.prop.photos.length}`;
      };

      gallerySliderArrow.addEventListener("click", () => {        
        $scope.moveSlider(gallerySlider, 'currentPhoto', $scope.p.prop.photos.length, side.side);
        setCounterLabel();
      });
      
      gallerySlider.addEventListener(`swiped-${side.side}`, () => {
        $scope.moveSlider(gallerySlider, 'currentPhoto', $scope.p.prop.photos.length, side.oposite);
        setCounterLabel();
      });

      featuredSliderArrow.addEventListener("click", (e) => { 
        e.stopPropagation();
        
        const pxToMove = [...featuredSlider.children].find(child => child.classList.contains("mobile-property-recomended-item")).offsetWidth;

        $scope.moveSlider(featuredSlider, 'currentFeatured', $scope.featured.length, side.side, pxToMove);
      }, {capture: true});
      
      featuredSlider.addEventListener(`swiped-${side.side}`, (e) => {
        e.stopPropagation();
        
        const pxToMove = [...featuredSlider.children].find(child => child.classList.contains("mobile-property-recomended-item")).offsetWidth; 
        
        $scope.moveSlider(featuredSlider, 'currentFeatured', $scope.featured.length, side.oposite, pxToMove);    
      }, {capture: true});
    });    
  });     

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
