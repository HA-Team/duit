app.directive('galleryPropertiesGeneric', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            items: '=',
            showWidgets: '=',
            galleryHeight: '=',
            id: '='
        },
        templateUrl: '/views/components/galleries/properties-generic/gallery-properties-generic.html',
        controller: ['$scope', 'sliderMoves', '$element', function ($scope, sliderMoves, $element) {  
            const gallerySlider = $element.find(".gallery-properties-generic-slider")[0];
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

            $scope.getSectionStyle = () => {
                const styles = {};

                styles.height = $scope.galleryHeight ?? '';                

                return styles;
            };
        }]            
    }
});