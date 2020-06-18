app.controller('home', function($scope, $location, $anchorScroll, anchorSmoothScroll) {
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
      imgSrc: "/images/services/iso-service-1.png",
      anchorName: "home-services-description-assesors",
      iconClass: "fas fa-building",
      goTo: "home-contact",
      linkTitle: "Contactános",
      mainTitle: "Te aconsejamos",
      description: "El equipo profesional de Duit te asistirá en todo momento, bridandote todos los consejos necesarios para que tomes la decisión mas adecuada."
    },
    {
      imgSrc: "/images/services/iso-service-2.png",
      anchorName: "home-services-description-rent",
      iconClass: "far fa-building",
      goTo: "home-search-bar",
      linkTitle: "Mas info",
      mainTitle: "Alquiler",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },
    {
      imgSrc: "/images/services/iso-service-3.png",
      anchorName: "home-services-description-sell",
      iconClass: "far fa-building",
      goTo: "home-search-bar",
      linkTitle: "Mas info",
      mainTitle: "Venta",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },    
    {
      imgSrc: "/images/services/iso-service-4.png",
      anchorName: "home-services-description-admin",
      iconClass: "far fa-building",
      goTo: "home-contact",
      linkTitle: "Mas info",
      mainTitle: "Administración",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },
    {
      imgSrc: "/images/services/iso-service-5.png",
      anchorName: "home-services-description-quotation",
      iconClass: "fas fa-home",
      goTo: "home-contact",
      linkTitle: "Contactános",
      mainTitle: "Valuamos tu casa",
      description: "¿Querés saber cual es el valor de tu propiedad? Nuestro Staff de consejeros matriculados CPCPI valuarán profesionalmente tus bienes."
    }        
  ];

  $scope.servicesLinks = [
    {
      imgSrc: "/images/services/service-1.png",
      goTo: "home-services-description-assesors" 
    },
    {
      imgSrc: "/images/services/service-2.png",
      goTo: "home-services-description-rent" 
    },
    {
      imgSrc: "/images/services/service-3.png",
      goTo: "home-services-description-sell" 
    },
    {
      imgSrc: "/images/services/service-4.png",
      goTo: "home-services-description-admin" 
    },
    {
      imgSrc: "/images/services/service-5.png",
      goTo: "home-services-description-quotation" 
    }
  ]

  $scope.goToSection = (id) => { 
    var newHash = id;    
    
    if ($location.hash() !== newHash) {
      $location.hash(id);

      anchorSmoothScroll.scrollTo(id, 1000);
    }

    else $anchorScroll();
  };
});