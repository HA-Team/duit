app.service('navigation', function($rootScope, $location, $anchorScroll) {
    this.goToSection = (page, section) => {
        if (page) this.setActive(page, section); 
        if ($location.hash() !== section) $location.hash(section);          
        $anchorScroll();
    };

    this.setActive = (page, section) => {
        $rootScope.activeMenu = page;
        $rootScope.activeSection = section ?? '';
    };
});