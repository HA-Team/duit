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
            toggleModal: '&',
            showMainImgBoxShadow: '=?'
        },
        templateUrl: '/views/components/contact-globe/contact-globe.html',
        controller: ['$scope', function ($scope) {
            // #region Public Properties

            $scope.showOpenIcons = angular.isDefined($scope.openIcon) && angular.isDefined($scope.closeIcon) ? true : false;
            $scope.showMainImgBoxShadow = angular.isDefined($scope.showMainImgBoxShadow) ? $scope.showMainImgBoxShadow : true; 

            // #endregion

            // #region Public Methods

            $scope.getActionStyle = (item) => {
                const styles = {};

                if (item.color) styles.color = item.color;
                if (item.fontSize) styles.fontSize = item.fontSize;

                return styles;
            };

            // #endregion
        }]            
    }
});