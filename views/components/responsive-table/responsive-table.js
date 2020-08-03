app.directive('responsiveTable', function() {
    return {
        restrict: 'E',
        scope: {  
            columns: '=',
            items: '=',
            title: '=',
        },
        templateUrl: '/views/components/responsive-table/responsive-table.html',
        controller: ['$scope', '$element', 'sliderMoves', 'utils', 'navigation', function ($scope, $element, sliderMoves, utils, navigation) {
            // #region Scoped Properties

            $scope.isDetailOpen = false;
            $scope.currentIndex = 1; 

            // #endregion

            // #region Private Properties

            const tableSlider = $element.find('.responsive-table-slider')[0];
            const tableFixed = $element.find('.responsive-table-fixed')[0];

            // #endregion

            // #region Scoped Methods

            $scope.toggleTooltip = (col) => { 
                if (col.icon) {
                    $scope.columns.forEach(column => {
                        if (column.name != col.name) column.isTooltipOpen = false;
                    });
                    
                    col.isTooltipOpen = !col.isTooltipOpen;
                }
            };

            $scope.toggleDetail = () => $scope.isDetailOpen = !$scope.isDetailOpen;

            $scope.setActiveDetail = (item) => {
                const isSliderTableFullWidthShown = tableSlider.offsetWidth == tableSlider.scrollWidth;
                const fixedTableElements = [...tableFixed.querySelectorAll(".responsive-table-body-item p")];
                const isSomeElementEllipsing = fixedTableElements.some(element => element.offsetWidth < element.scrollWidth);

                if (isSomeElementEllipsing || !isSliderTableFullWidthShown) {
                    $scope.activeDetail = item;
                    $scope.toggleDetail();
                }
                else navigation.goToSection('property', '', null, { propertyId: item.id });
            };

            // #endregion
        }]            
    }
});