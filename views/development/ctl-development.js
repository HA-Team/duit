app.controller('development', ['$rootScope', '$scope', 'tokkoApi', '$stateParams', 'getFeaturedProperties', function ($rootScope, $scope, tokkoApi, $stateParams, getFeaturedProperties) {
	$rootScope.activeMenu = '';
  $scope.apiReady = false;
  $scope.featuredPropsReady = false;
  $scope.devPropsReady = false;
  
  getFeaturedProps();

  const id = $stateParams.devId;

	tokkoApi.findOne('development', id, function (result) {
    $scope.d = result;
    $scope.developmentMapped = {
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
    
		$scope.apiReady = true;
    $scope.$apply();
		uiFunctions.showMoreButton();
		uiFunctions.buildSlickCarousel();
    uiFunctions.buildMagnificPopup();      

		setTimeout(() => {
			google.maps.event.trigger(map, 'resize');
    }, 0);
    
    const querySubject = `Consulta por propiedad %23${$scope.d.id}:${$scope.d.publication_title}`.replace(/\s/g, '%20');    

    const cellPhone = $scope.d.users_in_charge.phone;
    const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351'); 
    const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;  
    document.querySelector("#mobile-dev-detail .contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);            
    
    const emailUri = `mailto:${$scope.d.users_in_charge.email}?Subject=${querySubject}`;        
    document.querySelector("#mobile-dev-detail .contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
  });
  
  $scope.generalFeaturesToShow = 5;

  const generalFeaturesList = document.querySelector(".mobile-dev-general-features ul"); 
  const limitedHeight = `${$scope.generalFeaturesToShow * 40}px`;
  generalFeaturesList.style.maxHeight = limitedHeight;

  $scope.toggleGeneralFeatures = () => {          
    const maxHeight = `${$scope.d.tags.length * 40}px`;        

    if (generalFeaturesList.classList.contains("open")) {
      generalFeaturesList.classList.remove("open");
      generalFeaturesList.style.maxHeight = limitedHeight;
    }
    else {
      generalFeaturesList.classList.add("open");    
      generalFeaturesList.style.maxHeight = maxHeight;
    }
  };

  $scope.toggleDescriptionDetail = () => {
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

  $scope.isContactModalOpen = false;
  $scope.toggleContactModal = () => $scope.isContactModalOpen = !$scope.isContactModalOpen;

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

  $scope.availablePropsColumns = [
    {
      name: 'Precio',
      icon: 'fa fa-dollar-sign',
      data: 'price',
      fixed: true,
    },
    {
      name: 'Dormitorios',
      icon: 'fas fa-bed',
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

  function getDevelopmentProps(id) {
    getFeaturedProperties.getDevelopmentProps(id, result => {
      $scope.devProps = result.map(prop => {
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
          prop: prop
        }
      });

      $scope.devPropsReady = true;
      $scope.$apply();
    });
  };
}]);
