app.directive('contactGlobe', function() {
    return {
        restrict: 'E',
        scope: {
            isOpen: '=isOpen',
            mainImg: '=',
            openIcon: '=',
            closeIcon: '=',
            title: '=',
            actions: '=',
            toggleModal: '&'
        },
        templateUrl: '/views/components/contact-globe/contact-globe.html',
        controller: ['$scope', function ($scope) {
            $scope.getActionStyle = (item) => {
                const styles = {};

                if (item.color) styles.color = item.color;
                if (item.fontSize) styles.fontSize = item.fontSize;

                return styles;
            };
        }]            
    }
});