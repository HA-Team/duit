app.directive('galleryMultipleProperties', function() {
    return {
        restrict: 'E',
        scope: {  
            showGallery: '=',
            items: '=',
        },
        templateUrl: '/views/components/galleries/multiple-properties/gallery-multiple-properties.html',
        controller: ['$scope', 'sliderMoves', '$element', '$timeout', 'utils', function ($scope, sliderMoves, $element, $timeout, utils) {
            // #region Scoped Properties

            $scope.currentIndex = 1; 
            $scope.isContactModalOpen = false;

            // #endregion

            // #region Private Properties

            const gallerySlider = $element.find(".gallery-multiple-properties-slider.mobile-slider")[0];
            const desktopSlider = $element.find(".gallery-multiple-properties-slider.desktop-slider")[0];

            // #endregion

            // #region Private Methods

            const updateProducersContacts = (element, index) => {
                const currentProperty = $scope.items[index];
                const producer = currentProperty.producer;

                const querySubject = `Consulta por propiedad %23${currentProperty.id}:${currentProperty.title}`.replace(/\s/g, '%20');    

                const cellPhone = producer.cellphone ? producer.cellphone : producer.phone;
                const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351'); 
                const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;
                element.querySelector(".contact-globe-modal-icons .fa-whatsapp").parentElement.setAttribute("href", whatsAppUri);

                const emailUri = `mailto:${producer.email}?Subject=${querySubject}`;
                element.querySelector(".contact-globe-modal-icons .fa-envelope").parentElement.setAttribute("href", emailUri);
            }

            // #endregion

            // #region Scoped Methods

            $scope.moveSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSliderByIndex(gallerySlider, $scope.currentIndex,
                                                             $scope.items.length, side,
                                                             gallerySlider.querySelector("img").offsetWidth);
            };

            $scope.moveDesktopSlider = (side) => { 
                $scope.currentIndex = sliderMoves.moveSliderByIndex(desktopSlider, $scope.currentIndex,
                                                             $scope.items.length, side,
                                                             desktopSlider.querySelector(".desktop-slider-item-container").offsetWidth);
            };

            $scope.pluralize = utils.pluralizeWithItem;

            $scope.toggleContactModal = () => $scope.isContactModalOpen = !$scope.isContactModalOpen;

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

            var itemsWatcher = $scope.$watch('items', function(newValue, oldvalue) {
                if (newValue) {
                    $timeout(() => {
                        const sliderItems = [...desktopSlider.querySelectorAll(".desktop-info-container")];
                        sliderItems.forEach((element, index) => {
                            updateProducersContacts(element, index);
                        });
                        itemsWatcher();
                    });
                }
            });

            // #endregion

            // #region Scoped Objects

            $scope.contactGlobeOpenIcon = {
                iconClass: 'fab fa-whatsapp',
                color: 'var(--whatsapp-green)',
                fontSize: '3rem'    
            };

            $scope.contactGlobeCloseIcon = {
                iconClass: 'fa fa-times',
                color: 'var(--soft-grey)',
                fontSize: '3rem' 
            };

            $scope.contactGlobeActions = [
                {
                    hRef: '#',
                    iconClass: 'fab fa-whatsapp',
                    color: 'var(--whatsapp-green)',      
                },
                {
                    hRef: '#',
                    iconClass: 'fa fa-envelope',
                    color: 'var(--soft-red)', 
                    fontSize: '2.7rem'       
                }
            ];

            // #endregion
        }]            
    }
});