app.service('pageMoveUtils', function($location, $anchorScroll) {
    this.goToSection = (id) => { 
        if ($location.hash() !== id) $location.hash(id);          
        $anchorScroll();
    };
});