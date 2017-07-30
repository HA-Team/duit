const app = angular.module('duit', ['ui.router', 'infinite-scroll']);

app.config(function($stateProvider, $urlRouterProvider, $provide) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/views/home/home.html',
  });
  $stateProvider.state('propertySearch', {
    url: '/propertySearch?args',
    templateUrl: '/views/properties_listing/properties_listing.html',
    reloadOnSearch: false,
  });
  $stateProvider.state('contactUs', {
    url: '/contactUs',
    templateUrl: '/views/contact/contact.html'
  });
  $stateProvider.state('property', {
    url: '/property/:propertyId',
    templateUrl: '/views/property/property.html'
  });
  $stateProvider.state('agents', {
    url: '/agents',
    templateUrl: '/views/agents/agents.html'
  });
  $stateProvider.state('developments', {
    url: '/developments',
    templateUrl: '/views/developments_listing/developments_listing.html'
  });
  $stateProvider.state('development', {
    url: '/development/:devId',
    templateUrl: '/views/development/development.html'
  });
  $provide.decorator('$uiViewScroll', function ($delegate) {
    return function (uiViewElement) {
      // let top = uiViewElement.getBoundingClientRect().top;
      window.scrollTo(0, 0);
      // Or some other custom behaviour...
    }; 
  });
});

app.controller('global', function($scope) {
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0);
})