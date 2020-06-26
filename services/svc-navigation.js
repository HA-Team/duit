app.service('navigation', function($rootScope, $location, $anchorScroll) {
    this.goToSection = (id) => { 
        if ($location.hash() !== id) $location.hash(id);          
        $anchorScroll();
    };

    this.setActive = (state) => $rootScope.activeMenu = state;
});