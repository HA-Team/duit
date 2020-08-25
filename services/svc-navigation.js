app.service('navigation', ['$rootScope', '$location', '$anchorScroll', '$timeout', '$state', function($rootScope, $location, $anchorScroll, $timeout, $state) {
    this.goToSection = (page, section, args, params) => {
        $anchorScroll.yOffset = 75;
        this.setActive(page, section); 

        if ($rootScope.activeMenu != $state.current.name) {        
            $state.go(page, args ? {args: JSON.stringify(args)} : params ? params : null);

            $timeout(() => {
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