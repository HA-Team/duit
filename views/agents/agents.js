app.controller('agents', ['$rootScope', '$scope', function($rootScope, $scope){
  $rootScope.activeMenu = 'agents';
  $scope.agents = agents;
}]);