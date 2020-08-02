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

            const tableContainer = $element.find('.responsive-table-container')[0];
            const tableSlider = $element.find('.responsive-table-slider')[0];
            const tableFixed = $element.find('.responsive-table-fixed')[0];
            const setedMarginsWidth = 20;
            
            let pagingSteps = [0];

            // #endregion

            // #region Private Methods

            const moveSlider = (side) => {
                let pxToMove;
                if (side == 'right') pxToMove = pagingSteps[$scope.currentIndex];
                else pxToMove = $scope.currentIndex == 1 ? pagingSteps[$scope.pages - 1] : pagingSteps[$scope.currentIndex - 2];

                $scope.currentIndex = sliderMoves.moveSliderByScrollLeft(tableSlider, $scope.currentIndex, $scope.pages, side, pxToMove);
                $scope.$apply();
            }

            const setPaging = (slider, fixed) => {
                const spareWidth = window.innerWidth - setedMarginsWidth - fixed.offsetWidth;
                const columns = [...slider.querySelectorAll('.responsive-table-column')];

                $scope.pages = 1;

                let widthSum = 0;

                columns.forEach(col => {
                    if (widthSum + col.offsetWidth <= spareWidth) widthSum += col.offsetWidth;
                    else {
                        if ($scope.pages == 1) {
                            pagingSteps.push(widthSum);
                            widthSum = col.offsetWidth;
                            $scope.pages ++;
                        } else {
                            pagingSteps.push(widthSum + pagingSteps[$scope.pages - 1]);
                            widthSum = col.offsetWidth;
                            $scope.pages ++;
                        }
                    }
                });

                $scope.totalPages = [...Array(parseInt($scope.pages)).keys()];
                $scope.$apply();
            };

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

            // #region Events

            setTimeout(() => setPaging(tableSlider, tableFixed), 0);

            utils.sides.forEach(side => {
                const sliderArrow = $element.find(`.responsive-table-page-counter .fa-angle-${side.side}`)[0];

                sliderArrow.addEventListener("click", () => moveSlider(side.side)); 

                tableContainer.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    moveSlider(side.oposite);
                }, {capture: true});
            });

            // #endregion
        }]            
    }
});