app.service('navigation', ['$rootScope', '$location', '$anchorScroll', '$state', function($rootScope, $location, $anchorScroll, $state) {
    this.goToSection = (page, section, args) => {
        this.setActive(page, section); 

        if ($rootScope.activeMenu != $state.current.name) {        
            $state.go(page, args ? {args: JSON.stringify(args)} : null);

            setTimeout(() => {
                if ($location.hash() !== section) $location.hash(section);  
                $anchorScroll();
            }, 100);            
        } else {
            if ($location.hash() !== section) $location.hash(section);  
            $anchorScroll();
        }
    };

    this.setActive = (page, section) => {
        $rootScope.activeMenu = page;
        $rootScope.activeSection = section;
    };
}]);