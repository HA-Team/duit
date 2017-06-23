const app = angular.module('duit', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/views/home/home.html'
  });
  $stateProvider.state('propertySearch', {
    url: '/propertySearch',
    templateUrl: '/views/listing/listing.html',
    params: {args: null},
  });
  $stateProvider.state('contactUs', {
    url: '/contactUs',
    templateUrl: '/views/contact/contact.html'
  });
});

app.controller('global', function($scope) {
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0)
})