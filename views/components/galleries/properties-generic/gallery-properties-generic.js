app.directive('galleryPropertiesGeneric', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            items: '=',
            showWidgets: '='                     
        },
        templateUrl: '/views/components/galleries/properties-generic/gallery-properties-generic.html',
        controller: ['$scope', 'sliderMoves', function ($scope, sliderMoves) {                          
            $scope.isGalleryOpen = false;            
            $scope.currentIndex = 1;

            const moveSlider = (element, index, arrLength, side, pxToMove) => { 
                $scope.currentIndex = sliderMoves.moveSlider(element, index, arrLength, side, pxToMove);
            };
          
            const sides = [
                {
                    rotated: 'up',
                    side: 'left',
                    oposite: 'right'
                },
                {
                    rotated: 'down',
                    side: 'right',
                    oposite: 'left'
                }
            ];
          
            sides.forEach(side => {                
                const gallerySlider = document.querySelector(".gallery-properties-generic-slider");
                const gallerySliderArrow = document.querySelector(`.gallery-properties-generic .fa-angle-${side.side}`);      
            
                const setGalleryCounterLabel = () => {
                    const counterLabel = document.querySelector(".gallery-properties-generic .slider-photo-counter p");
                    counterLabel.innerHTML = `${$scope.currentIndex}/${$scope.items.length}`;
                };
            
                gallerySliderArrow.addEventListener("click", () => {        
                    moveSlider(gallerySlider, $scope.currentIndex, $scope.items.length, side.side, gallerySlider.querySelector("img").offsetWidth);
                    setGalleryCounterLabel();
                });
                
                gallerySlider.addEventListener(`swiped-${side.side}`, (e) => {
                    e.preventDefault();
                    const isLandscape = window.innerHeight < window.innerWidth;
                    
                    if (isLandscape || !$scope.isGalleryOpen) {
                        moveSlider(gallerySlider, $scope.currentIndex, $scope.items.length, side.oposite, gallerySlider.querySelector("img").offsetWidth);
                        setGalleryCounterLabel();
                    }
                }, {capture: true});

                gallerySlider.addEventListener(`swiped-${side.rotated}`, (e) => {
                    e.preventDefault();
                    const isLandscape = window.innerHeight < window.innerWidth;
                    
                    if (!isLandscape && $scope.isGalleryOpen) {
                        moveSlider(gallerySlider, $scope.currentIndex, $scope.items.length, side.oposite, gallerySlider.querySelector("img").offsetWidth);
                        setGalleryCounterLabel();
                    }
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