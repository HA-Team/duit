app.directive('galleryPropertiesCards', function() {
    return {
        restrict: 'E',
        scope: {  
            showPhotos: '=',
            items: '='                               
        },
        templateUrl: '/views/components/galleries/properties-cards/gallery-properties-cards.html',
        controller: ['$scope', 'sliderMoves', '$element', 'utils', function ($scope, sliderMoves, $element, utils) { 
            const gallerySlider = $element.find(".gallery-properties-cards-slider")[0];

            $scope.currentIndex = 1; 

            const moveSlider = (side, length) => {                
                $scope.currentIndex = sliderMoves.moveSlider(gallerySlider, $scope.currentIndex,
                                                length, side, gallerySlider.querySelector(".gallery-properties-cards-item").offsetWidth);
                $scope.$apply();
            };
          
            utils.sides.forEach(side => {
                const gallerySliderArrow = $element.find(`.gallery-properties-cards .fa-angle-${side.side}`)[0];

                gallerySliderArrow.addEventListener("click", () => moveSlider(side.side, $scope.items.length));                

                gallerySlider.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    moveSlider(side.oposite, $scope.items.length);
                }, {capture: true});
            });        
        }]            
    }
});