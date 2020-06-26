app.controller('home', function($scope, navigation) {
  const duitWhatsapp = '5493518172255';
  const duitPhone = '+5493518172255';

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
      hRef: '#',
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

  $scope.goToSection = (id) => navigation.goToSection(id);
  
  const featuredSection = document.getElementById('home-featured');
  const numberOfFeaturedSections = [...featuredSection.querySelectorAll(".home-featured-section")].length;
  
  featuredSection.style.height = `calc(${numberOfFeaturedSections * 50}vh + ${numberOfFeaturedSections * 40}px`;  
});