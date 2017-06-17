const uiFunctions = (function () {
  return {
    buildCarousel: function() {
      /*----------------------------------------------------*/
      /*  Owl Carousel
      /*----------------------------------------------------*/
      $('.carousel').owlCarousel({
        autoPlay: false,
        navigation: true,
        slideSpeed: 600,
        items : 3,
        itemsDesktop : [1239,3],
        itemsTablet : [991,2],
        itemsMobile : [767,1]
      });
      $('.logo-carousel').owlCarousel({
        autoPlay: false,
        navigation: true,
        slideSpeed: 600,
        items : 5,
        itemsDesktop : [1239,4],
        itemsTablet : [991,3],
        itemsMobile : [767,1]
      });
      $('.listing-carousel').owlCarousel({
        autoPlay: false,
        navigation: true,
        slideSpeed: 800,
        items : 1,
        itemsDesktop : [1239,1],
        itemsTablet : [991,1],
        itemsMobile : [767,1]
      });
      $('.owl-next, .owl-prev').on("click", function (e) {
          e.preventDefault(); 
       });
    },
    buildParallax: function() {
      function parallaxBG() {
        $('.parallax').prepend('<div class="parallax-overlay"></div>');
        $( ".parallax").each(function() {
          var attrImage = $(this).attr('data-background');
          var attrColor = $(this).attr('data-color');
          var attrOpacity = $(this).attr('data-color-opacity');
          if(attrImage !== undefined) {
            $(this).css('background-image', 'url('+attrImage+')');
          }
          if(attrColor !== undefined) {
            $(this).find(".parallax-overlay").css('background-color', ''+attrColor+'');
          }
          if(attrOpacity !== undefined) {
            $(this).find(".parallax-overlay").css('opacity', ''+attrOpacity+'');
          }
        });
      };
      function fullscreenFix(){
        var h = $('body').height();
        // set .fullscreen height
        $(".content-b").each(function(i){
            if($(this).innerHeight() > h){ $(this).closest(".fullscreen").addClass("overflow");
            }
        });
      }
      function backgroundResize(){
        var windowH = $(window).height();
        $(".parallax").each(function(i){
            var path = $(this);
            // variables
            var contW = path.width();
            var contH = path.height();
            var imgW = path.attr("data-img-width");
            var imgH = path.attr("data-img-height");
            var ratio = imgW / imgH;
            // overflowing difference
            var diff = 100;
            diff = diff ? diff : 0;
            // remaining height to have fullscreen image only on parallax
            var remainingH = 0;
            if(path.hasClass("parallax") && !$("html").hasClass("touch")){
                //var maxH = contH > windowH ? contH : windowH;
                remainingH = windowH - contH;
            }
            // set img values depending on cont
            imgH = contH + remainingH + diff;
            imgW = imgH * ratio;
            // fix when too large
            if(contW > imgW){
                imgW = contW;
                imgH = imgW / ratio;
            }
            //
            path.data("resized-imgW", imgW);
            path.data("resized-imgH", imgH);
            path.css("background-size", imgW + "px " + imgH + "px");
        });
      }
      function parallaxPosition(e){
        var heightWindow = $(window).height();
        var topWindow = $(window).scrollTop();
        var bottomWindow = topWindow + heightWindow;
        var currentWindow = (topWindow + bottomWindow) / 2;
        $(".parallax").each(function(i){
          var path = $(this);
          var height = path.height();
          var top = path.offset().top;
          var bottom = top + height;
          // only when in range
          if(bottomWindow > top && topWindow < bottom){
            //var imgW = path.data("resized-imgW");
            var imgH = path.data("resized-imgH");
            // min when image touch top of window
            var min = 0;
            // max when image touch bottom of window
            var max = - imgH + heightWindow;
            // overflow changes parallax
            var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
            top = top - overflowH;
            bottom = bottom + overflowH;
            // value with linear interpolation
            // var value = min + (max - min) * (currentWindow - top) / (bottom - top);
            var value = 0;
            if ( $('.parallax').is(".titlebar") ) {
              value = min + (max - min) * (currentWindow - top) / (bottom - top) *2;
            } else {
              value = min + (max - min) * (currentWindow - top) / (bottom - top);
            }
            // set background-position
            var orizontalPosition = path.attr("data-oriz-pos");
            orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
            $(this).css("background-position", orizontalPosition + " " + value + "px");
          }
        });
      }
      parallaxBG();
      /* detect touch */
      if("ontouchstart" in window){
        document.documentElement.className = document.documentElement.className + " touch";
      }
      if(!$("html").hasClass("touch")){
        /* background fix */
        $(".parallax").css("background-attachment", "fixed");
      }
      $(window).resize(fullscreenFix);
      fullscreenFix();
      $(window).resize(backgroundResize);
      $(window).focus(backgroundResize);
      backgroundResize();
      if(!$("html").hasClass("touch")){
        $(window).resize(parallaxPosition);
        $(window).focus(parallaxPosition);
        $(window).scroll(parallaxPosition);
        parallaxPosition();
      }
    },
    buildFooter: function() {
      $.fn.footerReveal = function(options) {
        $('#footer.sticky-footer').before('<div class="footer-shadow"></div>');
        var $this = $(this),
          $prev = $this.prev(),
          $win = $(window),
          defaults = $.extend ({
            shadow : true,
            shadowOpacity: 0.12,
            zIndex : -10
          }, options ),
          settings = $.extend(true, {}, defaults, options);
        $this.before('<div class="footer-reveal-offset"></div>');
        if ($this.outerHeight() <= $win.outerHeight()) {
          $this.css({
            'z-index' : defaults.zIndex,
            position : 'fixed',
            bottom : 0
          });
          $win.on('load resize', function() {
            $this.css({
              'width' : $prev.outerWidth()
            });
            $prev.css({
              'margin-bottom' : $this.outerHeight()
            });
          });
        }
        return this;
      };
      /*----------------------------------------------------*/
      /*  Sticky Footer (footer-reveal.js)
      /*----------------------------------------------------*/
      // disable if IE
      if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
          $('#footer').removeClass("sticky-footer");
      }
      $('#footer.sticky-footer').footerReveal();
    },
    buildChosen: function() {
      /*----------------------------------------------------*/
      /*  Chosen Plugin
      /*----------------------------------------------------*/
      var config = {
        '.chosen-select'           : {disable_search_threshold: 10, width:"100%"},
        '.chosen-select-deselect'  : {allow_single_deselect:true, width:"100%"},
        '.chosen-select-no-single' : {disable_search_threshold:100, width:"100%"},
        '.chosen-select-no-single.no-search' : {disable_search_threshold:10, width:"100%"},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
      };
      for (var selector in config) {
        if (config.hasOwnProperty(selector)) {
          $(selector).chosen(config[selector]);
        }
      }
    }
  }
})();