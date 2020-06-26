app.service('navigation', function($rootScope, $location, $anchorScroll) {
    this.goToSection = (id, page) => {
        if (page) this.setActive(page); 
        if ($location.hash() !== id) $location.hash(id);          
        $anchorScroll();
    };

    this.setActive = (state) => $rootScope.activeMenu = state;
});