app.directive('galleryPropertiesCards', function() {
    return {
        restrict: 'E',
        scope: {  
            showPhotos: '=',
            items: '='                               
        },
        templateUrl: '/views/components/galleries/properties-cards/gallery-properties-cards.html',
        controller: ['$scope', 'sliderMoves', '$element', function ($scope, sliderMoves, $element) { 
            const gallerySlider = $element.find(".gallery-properties-cards-slider")[0];            

            $scope.currentIndex = 1;

            const moveSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSlider(gallerySlider, $scope.currentIndex,
                                                 $scope.items.lenght, side,
                                                 gallerySlider.querySelector(".gallery-properties-cards-item").offsetWidth);
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
                const gallerySliderArrow = $element.find(`.gallery-properties-cards .fa-angle-${side.side}`)[0];

                gallerySliderArrow.addEventListener("click", () => moveSlider(side.side));                

                gallerySlider.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    moveSlider(side.oposite);
                }, {capture: true});
            });        
        }]            
    }
});