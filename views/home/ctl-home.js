app.controller('homeController', ['$rootScope', '$scope', 'navigation', 'utils', 'getFeaturedProperties', 'sharedData', function($rootScope, $scope, navigation, utils, getFeaturedProperties, sharedData) {
  var home = this;
  
  // #region Scoped Properties

  home.featuredPropsReady = false;
  home.featured360PropsReady = false;
  home.isContactGlobeOpen = false;
  home.contactGlobeTitle = "Te asesoramos!";
  home.agents = sharedData.agents;
  
  // #endregion

  // #region Private Properties

  const duitWhatsapp = '5493512463530';
  const duitPhone = '+5493512463530';

  var debouncedOnScroll = utils.debounce(onScroll, 50);

  // #endregion

  // #region On Init

  setTimeout(() => $rootScope.activeMenu = 'home', 100);

  getFeaturedProps();  
  getFeatured360Props();

  home.agents.forEach(agent => agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351')); 

  // #endregion

  // #region Private Methods

  function onScroll() {
    const duitFeaturedTop = document.querySelector("#home-featured") ? document.querySelector("#home-featured").offsetTop : 0;
    const servicesTop = document.querySelector("#home-services") ? document.querySelector("#home-services").offsetTop : 0;
    const assesorsTop = document.querySelector("#home-agents") ? document.querySelector("#home-agents").offsetTop : 0;
    const contactTop = document.querySelector("#home-contact") ? document.querySelector("#home-contact").offsetTop : 0;

    const scrollY = window.scrollY;
    
    switch (true) {
      case scrollY > contactTop - 100: $rootScope.activeSection = 'home-contact'; break;  
      case scrollY > assesorsTop - 100: $rootScope.activeSection = 'home-agents'; break;
      case scrollY > servicesTop - 100: $rootScope.activeSection = 'home-services'; break;
      case scrollY > duitFeaturedTop - 100: $rootScope.activeSection = 'home-featured-anchor'; break;
      default: $rootScope.activeSection = ''; break;
    }    
  
    $scope.$apply();
  };

  function getFeaturedProps() {
    getFeaturedProperties.getFeaturedProps(result => {
      home.featured = result.map(prop => {
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

      home.featuredPropsReady = true;
      $scope.$apply();

      uiFunctions.buildCarousel();
      $(window).trigger('resize');
    });
  };

  function getFeatured360Props() {
    getFeaturedProperties.getFeatured360Props(result => {  
      home.featured360Props = result
        .filter(prop => prop.videos.some(video => video.provider_id == 6))
        .map(prop => {
          return {
            id: prop.id,
            coverPhoto: prop.photos[0].image,
            price: prop.operations[prop.operations.length-1].prices.slice(-1)[0].price,
            currency: prop.operations[prop.operations.length-1].prices.slice(-1)[0].currency,
            title: prop.publication_title,
            type: prop.type.name,
            operationType: prop.operations[0].operation_type,
            area: prop.surface,
            bedrooms: prop.suite_amount ? prop.suite_amount : 0,
            bathrooms: prop.bathroom_amount ? prop.bathroom_amount : 0,
            video_url: `${prop.videos[0].player_url}?rel=0&enablejsapi=1`,
            producer: prop.producer
          }
      });

      home.featured360PropsReady = true;
      $scope.$apply();
    });
  };

  // #endregion

  // #region Scoped Methods

  home.toggleContactModal = () => home.isContactGlobeOpen = !home.isContactGlobeOpen;

  home.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
  
  home.goToSection = (page, section) => navigation.goToSection(page, section);

  // #endregion

  // #region Events

  window.addEventListener('scroll', debouncedOnScroll);  

  $scope.$on('$destroy', () => window.removeEventListener('scroll', debouncedOnScroll));

  // #endregion

  // #region Scoped Objects

  home.contactGlobeActions = [
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

  home.services = [
    {
      imgSrc: "/images/services/consejeros.png",
      goTo: { page: 'home', section: "home-agents" }
    },
    {
      imgSrc: "/images/services/alquiler.png",
      goTo: { page: 'home', section: "home-search-bar" },
      action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 2})
    },
    {
      imgSrc: "/images/services/venta.png",
      goTo: { page: 'home', section: "home-search-bar" },
      action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 1}) 
    },
    {
      imgSrc: "/images/services/administracion.png",
      goTo: { page: 'home', section: "home-contact" }
    },
    {
      imgSrc: "/images/services/tasacion.png",
      goTo: { page: 'home', section: "home-contact" }
    }
  ];

  // #endregion
}]);