app.directive('skeletonListingCard', function() {
    return {
        restrict: 'E',
        scope: {
            rows: '@',
            lines: '@',
            showMe: '='            
        },
        templateUrl: '/views/components/skeletons/listing-card/skeleton-listing-card.html',
        controller: ['$scope', function ($scope) {
            // #region Scoped Properties

            $scope.rows = angular.isDefined($scope.rows) ? $scope.rows : 10;
            $scope.lines = angular.isDefined($scope.lines) ? $scope.lines : 2;                                    
            
            $scope.rowsToShow = [...Array(parseInt($scope.rows)).keys()];
            $scope.linesToShow = [...Array(parseInt($scope.lines)).keys()]; 

            // #endregion
        }]            
    }
});