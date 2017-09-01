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

app.service('tokkoApi',function(){const a={key:'f26431aec0277d4e7912e2709af35707fb9362e6',lang:'es_ar'},b=function(a,b){let c=new XMLHttpRequest;c.onreadystatechange=function(){4==c.readyState&&200==c.status&&b(c.responseText)},c.open('GET',a,!0),c.send(null)};return{find:function(c,d,e){let f='http://tokkobroker.com/api/v1/'+c+'/?format=json&';if('object'==typeof d)for(let b in d)f+=b+'='+d[b]+'&';else f+='id='+d+'&';b(f+'key='+a.key+'&lang='+a.lang,function(a){'property/get_search_summary'===c?e(JSON.parse(a)):e(JSON.parse(a).objects)})},findOne:function(a,b,c){this.find(a,b,function(a){c(a[0])})},insert:function(b,c,d){let e=new XMLHttpRequest,f='http://tokkobroker.com/api/v1/'+b+'/?key='+a.key,g=JSON.stringify(c);e.open('POST',f,!0),e.setRequestHeader('Content-type','application/json'),e.onreadystatechange=function(){4==e.readyState&&(200==e.status||201==e.status)?d({result:'success',status:e.status}):d({result:'error',status:e.status,result:e.responseText})},e.send(g)}}});

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
    return $rootScope.favorites.findIndex(p => p.id === propId) === -1 ? false : true;
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