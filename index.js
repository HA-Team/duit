const app = angular.module('duit', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: "/views/home.html",
  })
});

app.controller('index', function($scope) {
  
});