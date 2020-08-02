app.directive('gallerySingleProperty', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            showSkeleton: '=',
            item: '=',
            showWidgets: '=',
            galleryHeight: '=',
            hasDuit360: '='
        },
        templateUrl: '/views/components/galleries/single-property/gallery-single-property.html',
        controller: ['$scope', 'sliderMoves', '$element', 'utils', function ($scope, sliderMoves, $element, utils) {  
            const gallerySlider = $element.find(".gallery-single-property-slider")[0];
            const photoCounter = $element.find(".slider-photo-counter p")[0];

            $scope.item.videos = $scope.item.videos ? $scope.item.videos.filter(video => video.provider_id != 6) : null;
            $scope.galleryCounter = $scope.item.videos ? $scope.item.photos.length + $scope.item.videos.length : $scope.item.photos.length;
            
            $scope.isGalleryOpen = false;
            $scope.showDuit360 = $scope.hasDuit360;
            $scope.currentIndex = 1;                        
            
            $scope.moveSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSliderByIndex(gallerySlider, $scope.currentIndex,
                                                            $scope.galleryCounter, side,
                                                            gallerySlider.querySelector("img").offsetWidth);
                setGalleryCounterLabel();
            };        

            const setGalleryCounterLabel = () => photoCounter.innerHTML = `${$scope.currentIndex}/${$scope.galleryCounter}`;                  
          
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
                if (!$scope.item.hRef) {                    
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

                    gallerySlider.style.scrollBehavior = 'unset';    
                    setTimeout(() => {
                        gallerySlider.scrollLeft = gallerySlider.querySelector("img").offsetWidth * ($scope.currentIndex - 1);
                        gallerySlider.style.scrollBehavior = 'smooth';
                    }, 0);
                }        
            };

            $scope.getSectionStyle = () => {
                const styles = {};

                styles.height = $scope.galleryHeight ? $scope.galleryHeight : '';                

                return styles;
            };

            $scope.toggleDuit360 = () => $scope.showDuit360 = !$scope.showDuit360;
        }]            
    }
});