const app = angular.module('duit', ['ui.router', 'infinite-scroll', 'angular-google-analytics']);

app.config(function($stateProvider, $urlRouterProvider, $provide) {
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home/home.html',
  });
  $stateProvider.state('propertySearch', {
    url: '/propertySearch?args',
    templateUrl: 'views/properties_listing/properties_listing.html',
    reloadOnSearch: false,
  });
  $stateProvider.state('contactUs', {
    url: '/contactUs',
    templateUrl: 'views/contact/contact.html'
  });
  $stateProvider.state('property', {
    url: '/property/:propertyId',
    templateUrl: 'views/property/property.html'
  });
  $stateProvider.state('agents', {
    url: '/agents',
    templateUrl: 'views/agents/agents.html'
  });
  $stateProvider.state('developments', {
    url: '/developments',
    templateUrl: 'views/developments_listing/developments_listing.html'
  });
  $stateProvider.state('development', {
    url: '/development/:devId',
    templateUrl: 'views/development/development.html'
  });
  $stateProvider.state('favorites', {
    url: '/favorites',
    templateUrl: 'views/favorites/favorites.html'
  });
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'views/accounts/login.html'
  });
  $provide.decorator('$uiViewScroll', function ($delegate) {
    return function (uiViewElement) {
      // let top = uiViewElement.getBoundingClientRect().top;
      window.scrollTo(0, 0);
      // Or some other custom behaviour...
    }; 
  });
});

app.config(['AnalyticsProvider', function (AnalyticsProvider) {
   // Add configuration code as desired
   AnalyticsProvider.setAccount('UA-79529729-2'); //Duit official: UA-79529729-1
}]).run(['Analytics', function(Analytics) { }]);

/*
* Tokko Broker API functions.
*
* @author: Antonio Aznarez
* @email: antonio@ha-team.co
* @copyright: HA 2017
* @date: 09/06/17
*/

app.controller('startUp', function($rootScope) {
  $rootScope.favorites = {dataLoaded: false, props: []};
  $rootScope.isFavorite = propId => {
    return $rootScope.favorites.props.findIndex(p => p.id === propId) === -1 ? false : true;
  };
});