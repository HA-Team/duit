app.controller('homeController', ['$rootScope', '$scope', '$timeout', 'navigation', 'utils', 'getFeaturedProperties', 'sharedData', 'tokkoApi', '$q', function($rootScope, $scope, $timeout, navigation, utils, getFeaturedProperties, sharedData, tokkoApi, $q) {
  var home = this;
  
  // #region Scoped Properties

  home.featured360PropsReady = false;
  home.isContactGlobeOpen = false;
  home.contactGlobeTitle = "Te asesoramos!";
  home.agents = sharedData.agents;
  
  // #endregion

  // #region Private Properties
  const parallaxElement = document.getElementById('home-search-bar');

  var debouncedOnScroll = utils.debounce(onScroll, 50);
  var backgroundImageIndex = 0;

  // #endregion

  // #region On Init

  $timeout(() => {
    $rootScope.activeMenu = 'home';
    document.querySelector('footer').style.display = 'none';
  }, 100);
   
  var changeBackgroundImageInterval = setInterval(() => {
    if (home.backGroundImages) {
      parallaxElement.style.backgroundImage = `url(${home.backGroundImages[backgroundImageIndex].image})`;
      backgroundImageIndex = backgroundImageIndex == home.backGroundImages.length - 1 ? 0 : backgroundImageIndex + 1;
    }
  }, 6000);

  getBackgroundImages();
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

  function getFeatured360Props() {
    getFeaturedProperties.getFeatured360Props().then(result => {
      result = result.data.objects;
      
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

      home.featured360Props = _.shuffle(home.featured360Props);

      home.featured360PropsReady = true;
    }, reject => null);
  };

  function getBackgroundImages() {
    const backgroundImagesPropId = 2990223;

    tokkoApi.find('property', backgroundImagesPropId, $q.defer()).then(result => {
      result = result.data.objects[0];

      home.backGroundImages = result.photos;

      parallaxElement.style.backgroundImage = `url(${home.backGroundImages[0].image})`;
      backgroundImageIndex = backgroundImageIndex == home.backGroundImages.length - 1 ? 0 : backgroundImageIndex + 1;
    }, reject => null);
  }

  // #endregion

  // #region Scoped Methods

  home.toggleContactModal = () => home.isContactGlobeOpen = !home.isContactGlobeOpen;

  home.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
  
  home.goToSection = (page, section) => {
    if (page && section) navigation.goToSection(page, section);
  }

  // #endregion

  // #region Events

  window.addEventListener('scroll', debouncedOnScroll);  

  $scope.$on('$destroy', () => {
    window.removeEventListener('scroll', debouncedOnScroll);
    clearInterval(changeBackgroundImageInterval);
    document.querySelector('footer').style.display = 'flex';
  });

  // #endregion

  // #region Scoped Objects

  home.contactGlobeActions = [
    {
      hRef: `tel:${sharedData.duitPhone}`,
      iconClass: 'fa fa-phone',
      fontSize: '2.3rem'
    },
    {
      hRef:  `mailto:${sharedData.contactEmail}`,
      iconClass: 'fa fa-envelope',
      fontSize: '2.5rem'
    },
    {
      hRef: `https://api.whatsapp.com/send?phone=${sharedData.duitWhatsapp}`,
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
      hasTooltip: true,
      tooltipText: "Realizamos el cobro de alquilers e impuestos, y mantenimiento de tu propiedad. Damos una respuesta a los locatarios y evitamos a los propietarios las complicaciones derivadas con la administración y gestión de propiedades.",
      whatsAppHRef: `https://api.whatsapp.com/send?phone=${sharedData.infoWhatsapp}&text=${window.encodeURIComponent('Hola, quiero hacer una consulta por una administración.')}`,
      emailHRef: `mailto:${sharedData.infoEmail}?Subject=${window.encodeURIComponent('Hola, quiero hacer una consulta por una administración.')}`
    },
    {
      imgSrc: "/images/services/tasacion.png",
      hasTooltip: true,
      tooltipText: "Nuestro asesores matriculados CPCPI valuarán tu inmueble, para que sepas cuanto vale realemente tu propiedad.",
      whatsAppHRef: `https://api.whatsapp.com/send?phone=${sharedData.infoWhatsapp}&text=${window.encodeURIComponent('Hola, quiero hacer una consulta por una tasasión.')}`,
      emailHRef: `mailto:${sharedData.infoEmail}?Subject=${window.encodeURIComponent('Hola, quiero hacer una consulta por una tasasión.')}`
    }
  ];

  // #endregion
}]);