const app = angular.module('duit', ['ui.router', 'infinite-scroll', 'angular-google-analytics']);

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
  $stateProvider.state('favorites', {
    url: '/favorites',
    templateUrl: '/views/favorites/favorites.html'
  });
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/views/accounts/login.html'
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

app.service('tokkoApi', function($http) {
  const tokkoAuth = {
    key: 'f26431aec0277d4e7912e2709af35707fb9362e6',
    lang: 'es_ar'
  };
  const httpGetAsync = function (url, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
  };
  return {
    find: function (endpoint, args, callback) {
      let url = 'https://tokkobroker.com/api/v1/'+endpoint+'/?format=json&';
      if (typeof args == 'object') {
        for (let a in args) {
          url += a + '=' + args[a] + '&'
        };
      } else {
        url += 'id=' + args + '&';
      };
      httpGetAsync(url+'key='+tokkoAuth.key+"&lang="+tokkoAuth.lang, function(response) {
        if (endpoint === 'property/get_search_summary') {
          callback(JSON.parse(response))
        } else {
          callback(JSON.parse(response).objects);
        }
      });
    },
    findOne: function (endpoint, args, callback) {
      this.find(endpoint, args, function (response) {
        callback(response[0]);
      });
    },
    insert: function (endpoint, data, callback) {
      let http = new XMLHttpRequest(),
        url = 'https://tokkobroker.com/api/v1/'+endpoint+'/?key='+tokkoAuth.key,
        content = JSON.stringify(data);
      http.open("POST", url, true);
      //Send the proper header information along with the request
      http.setRequestHeader("Content-type", "application/json");
      http.onreadystatechange = function() {
        //Call a function when the state changes.
        if(http.readyState == 4 && (http.status == 200 || http.status == 201)) {
          callback({result: 'success', status: http.status})
        } else {
          callback({result: 'error', status: http.status, result: http.responseText})
        }
      }
      http.send(content);
    },
  }
});

app.controller('startUp', function($scope, $rootScope, tokkoApi) {
  $rootScope.Meteor = Meteor;
  FavoritesProps = new Meteor.Collection('favorites');
  Meteor.subscribe('favorites');
  $rootScope.favorites = {dataLoaded: false, props: []};
  setTimeout(function(){
    uiFunctions.buildStickyHeader();
    uiFunctions.buildTopBarMobileMenu();
  }, 0);
  $rootScope.isFavorite = propId => {
    return $rootScope.favorites.props.findIndex(p => p.id === propId) === -1 ? false : true;
  };
  Meteor.autorun(() => {
    if (Meteor.user()) {
      const favorites = FavoritesProps.find({users: Meteor.user()._id});
      if (favorites) {
        let tmp = [];
        favorites.forEach((f) => {
          tmp.push(f.prop);
        })
        $rootScope.favorites.props = tmp;
        $rootScope.favorites.dataLoaded = true;
        $rootScope.$apply();
      }
    }
  });
})