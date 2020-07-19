app.directive('galleryMultipleProperties', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            showSkeleton: '=',
            showInfoCard: '=',
            items: '=',
            showWidgets: '='
        },
        templateUrl: '/views/components/galleries/multiple-properties/gallery-multiple-properties.html',
        controller: ['$scope', 'sliderMoves', '$element', 'utils', function ($scope, sliderMoves, $element, utils) {  
            const gallerySlider = $element.find(".gallery-multiple-properties-slider")[0];
            const photoCounter = $element.find(".slider-photo-counter p")[0];
            
            $scope.isGalleryOpen = false;            
            $scope.currentIndex = 1;            
            
            $scope.moveSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSlider(gallerySlider, $scope.currentIndex,
                                                             $scope.items.length, side,
                                                             gallerySlider.querySelector("img").offsetWidth);
                setGalleryCounterLabel();
            };        

            const setGalleryCounterLabel = () => photoCounter.innerHTML = `${$scope.currentIndex}/${$scope.items.length}`;                  
          
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
            
            $scope.toggleGallery = () => {        
                const header = document.querySelector("#mobile-header");                
                const body = document.querySelector("body");
                
                $scope.isGalleryOpen = !$scope.isGalleryOpen;
            
                if ($scope.isGalleryOpen) {
                  header.style.display = "none";                    
                  body.style.overflow = "hidden";
                }
                else {
                  header.style.display = "block";                    
                  body.style.overflow = "visible";
                }
            };
        }]            
    }
});