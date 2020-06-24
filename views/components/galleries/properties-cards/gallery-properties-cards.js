app.directive('galleryPropertiesCards', function() {
    return {
        restrict: 'E',
        scope: {  
            showPhotos: '=',
            items: '='                               
        },
        templateUrl: '/views/components/galleries/properties-cards/gallery-properties-cards.html',
        controller: ['$scope', 'sliderMoves', function ($scope, sliderMoves) {                                      
            $scope.currentIndex = 1;

            const moveSlider = (element, index, arrLength, side, pxToMove) => { 
                $scope.currentIndex = sliderMoves.moveSlider(element, index, arrLength, side, pxToMove);
                $scope.$apply();
            };
          
            const sides = [
                {
                    side: 'left',
                    oposite: 'right'
                },
                {
                    side: 'right',
                    oposite: 'left'
                }
            ];
          
            sides.forEach(side => {
                const gallerySlider = document.querySelector(".gallery-properties-cards-slider");
                const gallerySliderArrow = document.querySelector(`.gallery-properties-cards .fa-angle-${side.side}`);      
            
                gallerySliderArrow.addEventListener("click", () => {        
                    moveSlider(gallerySlider, $scope.currentIndex, $scope.items.length, side.side, gallerySlider.querySelector(".gallery-properties-cards-item").offsetWidth);
                });
                
                gallerySlider.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault()
            
                    moveSlider(gallerySlider, $scope.currentIndex, $scope.items.length, side.oposite, gallerySlider.querySelector(".gallery-properties-cards-item").offsetWidth);
                }, {capture: true});
            });        
        }]            
    }
});