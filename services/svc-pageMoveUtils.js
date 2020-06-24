app.service('pageMoveUtils', function($location, $anchorScroll) {
    const scrollTo = (id, duration) => {
        var target = document.querySelector(id);
        var targetPosition = target.getBoundingClientRect().top;
        var startPosition = window.pageYOffset;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);            
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    this.goToSection = (id) => { 
        var newHash = id;    
        
        if ($location.hash() !== newHash) {
          $location.hash(id);    
          scrollTo(id, 1000);
        }
        else $anchorScroll();
    };
});