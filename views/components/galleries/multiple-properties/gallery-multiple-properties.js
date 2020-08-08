app.directive('galleryMultipleProperties', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            items: '=',
        },
        templateUrl: '/views/components/galleries/multiple-properties/gallery-multiple-properties.html',
        controller: ['$scope', 'sliderMoves', '$element', 'utils', function ($scope, sliderMoves, $element, utils) {
            // #region Scoped Properties

            $scope.currentIndex = 1; 

            // #endregion

            // #region Private Properties

            const gallerySlider = $element.find(".gallery-multiple-properties-slider")[0];

            // #endregion

            // #region Scoped Methods

            $scope.moveSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSliderByIndex(gallerySlider, $scope.currentIndex,
                                                             $scope.items.length, side,
                                                             gallerySlider.querySelector("img").offsetWidth);
            };

            // #endregion

            // #region Events

            utils.sides.forEach(side => {                                
                gallerySlider.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    const isLandscape = window.innerHeight < window.innerWidth;
                    if (isLandscape || !$scope.isGalleryOpen) $scope.moveSlider(side.oposite);
                }, {capture: true});

                gallerySlider.addEventListener(`swiped-${side.rotated}`, (e) => {
                    e.preventDefault();
                    const isLandscape = window.innerHeight < window.innerWidth;
                    if (!isLandscape && $scope.isGalleryOpen) $scope.moveSlider(side.oposite);
                }, {capture: true});
            });

            // #endregion
        }]            
    }
});