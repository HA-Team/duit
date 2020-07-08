app.controller('home', ['$rootScope', '$scope', 'navigation', 'utils', 'getFeaturedProperties', function($rootScope, $scope, navigation, utils, getFeaturedProperties) {
  const duitWhatsapp = '5493512463530';
  const duitPhone = '+5493512463530';
  setTimeout(() => $rootScope.activeMenu = 'home', 100);

  $scope.featuredPropsReady = false;
  $scope.featured360PropsReady = false;
  getFeaturedProps();  
  getFeatured360Props();

  $scope.isContactGlobeOpen = false;
  $scope.contactGlobeTitle = "Te asesoramos!";

  $scope.contactGlobeOpenIcon = {
    iconClass: 'fab fa-whatsapp',
      color: '#128c7e',
      fontSize: '3rem'   
  };

  $scope.contactGlobeCloseIcon = {
    iconClass: 'fa fa-times',
    color: 'var(--soft-grey)',
    fontSize: '3rem' 
  };

  $scope.contactGlobeActions = [
    {
      hRef: `tel:${duitPhone}`,
      iconClass: 'fa fa-phone',
      fontSize: '2.3rem'
    },
    {
      hRef: 'mailto:contacto@duitpropiedades.com.ar',
      iconClass: 'fa fa-envelope',
      fontSize: '2.5rem'
    },
    {
      hRef: `https://api.whatsapp.com/send?phone=${duitWhatsapp}`,
      iconClass: 'fab fa-whatsapp',
      color: '#128c7e',
      fontSize: '3rem'
    },
  ];

  $scope.toggleContactModal = () => $scope.isContactGlobeOpen = !$scope.isContactGlobeOpen;

  $scope.agents = agents;
  $scope.agents.forEach(agent => agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351'));  
  $scope.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');

  $scope.services = [
    {
      imgSrc: "/images/services/consejeros.png",
      goTo: "home-assesors" 
    },
    {
      imgSrc: "/images/services/alquiler.png",
      goTo: "home-search-bar",
      action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 2})
    },
    {
      imgSrc: "/images/services/venta.png",
      goTo: "home-search-bar",
      action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 1}) 
    },
    {
      imgSrc: "/images/services/administracion.png",
      goTo: "home-contact" 
    },
    {
      imgSrc: "/images/services/tasacion.png",
      goTo: "home-contact" 
    }
  ];

  $scope.goToSection = (page, section) => navigation.goToSection(page, section);
      
  function onScroll() {
    const duitFeaturedTop = document.querySelector("#home-featured").offsetTop ?? 0;
    const servicesTop = document.querySelector("#home-services").offsetTop ?? 0;
    const assesorsTop = document.querySelector("#home-assesors").offsetTop ?? 0;
    const contactTop = document.querySelector("#home-contact").offsetTop ?? 0;

    const scrollY = window.scrollY;
    
    switch (true) {
      case scrollY > contactTop - 100: $rootScope.activeSection = 'home-contact'; break;  
      case scrollY > assesorsTop - 100: $rootScope.activeSection = 'home-assesors'; break;
      case scrollY > servicesTop - 100: $rootScope.activeSection = 'home-services'; break;
      case scrollY > duitFeaturedTop - 100: $rootScope.activeSection = 'home-featured-anchor'; break;
      default: $rootScope.activeSection = ''; break;
    }    
  
    $scope.$apply();
  };

  var debouncedOnScroll = utils.debounce(onScroll, 50)

  window.addEventListener('scroll', debouncedOnScroll);  

  $scope.$on('$destroy', () => window.removeEventListener('scroll', debouncedOnScroll));

  function getFeaturedProps() {
    getFeaturedProperties.getFeaturedProps(result => {
      $scope.featured = result.map(prop => {
        return {
          id: prop.id,
          title: prop.publication_title,
          area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
          type: prop.operations[0].operation_type,
          currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
          price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
          rooms: prop.suite_amount,
          baths: prop.bathroom_amount,
          parkings: prop.parking_lot_amount,
          cover_photo: prop.photos[0].image,
          prop: prop
        }
      });

      $scope.featuredPropsReady = true;
      $scope.$apply();

      uiFunctions.buildCarousel();
      $(window).trigger('resize');
    });
  };

  function getFeatured360Props() {
    getFeaturedProperties.getFeatured360Props(result => {     
      $scope.featured360Props = result
        .filter(prop => prop.videos.some(video => video.provider_id == 6))
        .map(prop => {
          return {
            id: prop.id,
            coverPhoto: prop.photos[0].image,
            price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
            currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
            title: prop.publication_title
          }
      });

      $scope.featured360PropsReady = true;
      $scope.$apply();
    });
  };
}]);