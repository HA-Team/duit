app.directive('skeletonListing', function() {
    return {
        restrict: 'E',
        scope: {
            rows: '=',
            lines: '='            
        },
        templateUrl: '/views/components/skeletons/listing/skeleton-listing.html',
        controller: ['$scope', function ($scope) {}]            
    }
});