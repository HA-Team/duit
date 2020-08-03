app.controller('home', ['$rootScope', '$scope', 'navigation', 'utils', 'getFeaturedProperties', function($rootScope, $scope, navigation, utils, getFeaturedProperties) {
  // #region Scoped Properties

  $scope.featuredPropsReady = false;
  $scope.featured360PropsReady = false;
  $scope.isContactGlobeOpen = false;
  $scope.contactGlobeTitle = "Te asesoramos!";

  $scope.agents = agents;
  

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

  $scope.agents.forEach(agent => agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351')); 

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

  // #endregion

  // #region Scoped Methods

  $scope.toggleContactModal = () => $scope.isContactGlobeOpen = !$scope.isContactGlobeOpen;

  $scope.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
  
  $scope.goToSection = (page, section) => navigation.goToSection(page, section);

  $scope.focusFormControl = (e) => {
    const dataName = e.target.htmlFor;
    const input = document.querySelector(`#home-contact .form-control[name='${dataName}']`);
    input.focus();    
  };

  // #endregion

  // #region Events

  window.addEventListener('scroll', debouncedOnScroll);  

  $scope.$on('$destroy', () => window.removeEventListener('scroll', debouncedOnScroll));

  // #endregion

  // #region Scoped Objects

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

  $scope.services = [
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