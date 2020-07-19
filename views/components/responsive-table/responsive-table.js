app.directive('responsiveTable', function() {
    return {
        restrict: 'E',
        scope: {  
            showTable: '=',
            columns: '=',
            items: '=',
            title: '=',
        },
        templateUrl: '/views/components/responsive-table/responsive-table.html',
        controller: ['$scope', 'sliderMoves', '$element', 'utils', function ($scope, sliderMoves, $element, utils) {
            const tableContainer = $element.find('.responsive-table-container')[0];
            const tableSlider = $element.find('.responsive-table-slider')[0];
            const tableFixed = $element.find('.responsive-table-fixed')[0];

            setTimeout(() => setColumnsWidth(tableSlider, tableFixed), 0);

            $scope.currentIndex = 1;            
            
            moveSlider = (side) => {
                $scope.currentIndex = sliderMoves.moveSlider(tableSlider, $scope.currentIndex, $scope.pages, side, $scope.spareWidth);
                $scope.$apply();
            }

            $scope.toggleTooltip = (col) => { 
                if (col.icon) col.isTooltipOpen = !col.isTooltipOpen;
            };

            utils.sides.forEach(side => {
                const sliderArrow = $element.find(`.responsive-table-page-counter .fa-angle-${side.side}`)[0];

                sliderArrow.addEventListener("click", () => moveSlider(side.side)); 

                tableContainer.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    moveSlider(side.oposite);
                }, {capture: true});
            });

            const setColumnsWidth = (slider, fixed) => {
                const columns = [...slider.querySelectorAll('.responsive-table-column')];
                const maxWidth = Math.max(...columns.map(column => column.offsetWidth));

                $scope.spareWidth = window.innerWidth - 20 - fixed.offsetWidth;

                const columnsToShow = Math.floor($scope.spareWidth / maxWidth);

                $scope.columnWidth = Math.floor($scope.spareWidth / columnsToShow);
                $scope.pages = Math.ceil(columns.length / columnsToShow);
                $scope.totalPages = [...Array(parseInt($scope.pages)).keys()];
                $scope.$apply();
            };
        }]            
    }
});