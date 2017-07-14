const uiFunctions = (function () {
  return {
    inlineCss: function () {
      // Common Inline CSS
      $(".some-classes, section.fullwidth, .img-box-background, .flip-banner, .property-slider .item, .fullwidth-property-slider .item, .fullwidth-home-slider .item, .address-container").each(function() {
        var attrImageBG = $(this).attr('data-background-image');
        var attrColorBG = $(this).attr('data-background-color');
            if(attrImageBG !== undefined) {
                $(this).css('background-image', 'url('+attrImageBG+')');
            }
            if(attrColorBG !== undefined) {
                $(this).css('background', ''+attrColorBG+'');
            }
      });
    },
    buildCarousel: function() {
      /*----------------------------------------------------*/
      /*  Owl Carousel
      /*----------------------------------------------------*/
      $('.carousel').owlCarousel({
        autoPlay: false,
        navigation: true,
        slideSpeed: 600,
        items : 5,
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
      $('.listing-carousel:not(.owl-carousel)').owlCarousel({
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
    buildSlickCarousel: function() {
      $('.property-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        fade: true,
        asNavFor: '.property-slider-nav',
        centerMode: true,
        slide: ".item"
      });
      $('.property-slider-nav').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: '.property-slider',
        dots: false,
        arrows: false,
        centerMode: false,
        focusOnSelect: true,
        responsive: [
          {
            breakpoint: 993,
            settings: {
                slidesToShow: 4,
            }
          },
          {
            breakpoint: 767,
            settings: {
                slidesToShow: 3,
            }
          }
        ]
      });
      $('.fullwidth-property-slider').slick({
        centerMode: true,
        centerPadding: '20%',
        slidesToShow: 1, 
        responsive: [
          {
            breakpoint: 1367,
            settings: {
              centerPadding: '15%'
            }
          },
          {
            breakpoint: 993,
            settings: {
              centerPadding: '0'
            }
          }
        ]
      });
      $('.fullwidth-home-slider').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 1, 
        responsive: [
          {
            breakpoint: 1367,
            settings: {
              centerPadding: '0'
            }
          },
          {
            breakpoint: 993,
            settings: {
              centerPadding: '0'
            }
          }
        ]
      });
      this.inlineCss()
    },
    reBuildCarousel: function() {
      // $('.carousel, .logo-carousel, .listing-carousel').data('owlCarousel').destroy();
      this.buildCarousel();
    },
    buildParallax: function() {
      function parallaxBG() {
        $('.parallax').prepend('<div class="parallax-overlay"></div>');
        $( ".parallax").each(function() {
          var attrImage = $(this).attr('data-background');
          var attrColor = $(this).attr('data-color');
          var attrOpacity = $(this).attr('data-color-opacity');
          var attrZindex = $(this).attr('data-z-index');
          if(attrImage !== undefined) {
            $(this).css('background-image', 'url('+attrImage+')');
          }
          if(attrColor !== undefined) {
            $(this).find(".parallax-overlay").css('background-color', ''+attrColor+'');
          }
          if(attrOpacity !== undefined) {
            $(this).find(".parallax-overlay").css('opacity', ''+attrOpacity+'');
          }
          if(attrZindex !== undefined) {
            $(this).css('z-index', ''+attrZindex+'');
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
    },
    buildSearchTypeButtons: function() {
      /*----------------------------------------------------*/
      /*  Search Type Buttons
      /*----------------------------------------------------*/
      function searchTypeButtons() {
        // Radio attr reset
        $('.search-type label.active input[type="radio"]').prop('checked',true);
        // Positioning indicator arrow
        var buttonWidth = $('.search-type label.active').width();
        var arrowDist = $('.search-type label.active').position().left;
        $('.search-type-arrow').css('left', arrowDist + (buttonWidth/2) );
        $('.search-type label').on('change', function() {
            $('.search-type input[type="radio"]').parent('label').removeClass('active');
            $('.search-type input[type="radio"]:checked').parent('label').addClass('active');
          // Positioning indicator arrow
          var buttonWidth = $('.search-type label.active').width();
          var arrowDist = $('.search-type label.active').position().left;
          $('.search-type-arrow').css({
            'left': arrowDist + (buttonWidth/2),
            'transition':'left 0.4s cubic-bezier(.87,-.41,.19,1.44)'
          });
        });
      }
      // Init
      if ($(".main-search-form").length){
        searchTypeButtons();
        $(window).on('load resize', function() { searchTypeButtons(); });
      }
    },
    buildBackToTop: function() {
      /*----------------------------------------------------*/
      /*  Back to Top
      /*----------------------------------------------------*/
      var pxShow = 600; // height on which the button will show
      var fadeInTime = 300; // how slow / fast you want the button to show
      var fadeOutTime = 300; // how slow / fast you want the button to hide
      var scrollSpeed = 500; // how slow / fast you want the button to scroll to top.
      $(window).scroll(function(){
       if($(window).scrollTop() >= pxShow){
        $("#backtotop").fadeIn(fadeInTime);
       } else {
        $("#backtotop").fadeOut(fadeOutTime);
       }
      });
      $('#backtotop a').on('click', function(){
       $('html, body').animate({scrollTop:0}, scrollSpeed);
       return false;
      });
    },
    buildStickyHeader: function() {
      /*----------------------------------------------------*/
      /*  Sticky Header 
      /*----------------------------------------------------*/
      $( "#header" ).not( "#header-container.header-style-2 #header" ).clone(true).addClass('cloned unsticky').insertAfter( "#header" );
      $( "#navigation.style-2" ).clone(true).addClass('cloned unsticky').insertAfter( "#navigation.style-2" );

      // Logo for header style 2
      $( "#logo .sticky-logo" ).clone(true).prependTo("#navigation.style-2.cloned ul#responsive");


      // sticky header script
      var headerOffset = $("#header-container").height() * 2; // height on which the sticky header will shows

      $(window).scroll(function(){
        if($(window).scrollTop() >= headerOffset){
          $("#header.cloned").addClass('sticky').removeClass("unsticky");
          $("#navigation.style-2.cloned").addClass('sticky').removeClass("unsticky");
        } else {
          $("#header.cloned").addClass('unsticky').removeClass("sticky");
          $("#navigation.style-2.cloned").addClass('unsticky').removeClass("sticky");
        }
      });
    },
    buildTopBarMobileMenu: function() {
      const jPanelMenu = $.jPanelMenu({
        menu: '#responsive',
        animated: false,
        duration: 200,
        keyboardShortcuts: false,
        closeOnContentClick: true
      });
      $('.menu-trigger').on('click', function(){
        var jpm = $(this);
        if( jpm.hasClass('active') )
        {
          jPanelMenu.off();
          jpm.removeClass('active');
        }
        else
        {
          jPanelMenu.on();
          jPanelMenu.open();
          jpm.addClass('active');
        // Removes SuperFish Styles
        $('#jPanelMenu-menu').removeClass('menu');
        $('ul#jPanelMenu-menu li').removeClass('dropdown');
        $('ul#jPanelMenu-menu li ul').removeAttr('style');
        $('ul#jPanelMenu-menu li div').removeClass('mega').removeAttr('style');
        $('ul#jPanelMenu-menu li div div').removeClass('mega-container');
        }
        return false;
      });
      $(window).resize(function (){
        var winWidth = $(window).width();
        if(winWidth>992) {
          jPanelMenu.close();
        }
      });
    },
    gridSwitcher: function() {
      /*----------------------------------------------------*/
      /*  Listing Layout Switcher
      /*----------------------------------------------------*/
      function gridLayoutSwitcher() {
        var listingsContainer = $('.listings-container');
        // switcher buttons / anchors
        if ( $(listingsContainer).is(".list-layout") ) {
          owlReload();
          $('.layout-switcher a.grid, .layout-switcher a.grid-three').removeClass("active");
          $('.layout-switcher a.list').addClass("active");
        }
        if ( $(listingsContainer).is(".grid-layout") ) {
          owlReload();
          $('.layout-switcher a.grid').addClass("active");
          $('.layout-switcher a.grid-three, .layout-switcher a.list').removeClass("active");
          gridClear(2);
        }
        if ( $(listingsContainer).is(".grid-layout-three") ) {
          owlReload();
          $('.layout-switcher a.grid, .layout-switcher a.list').removeClass("active");
          $('.layout-switcher a.grid-three').addClass("active");
          gridClear(3);
        }
        // grid cleaning
        function gridClear(gridColumns) {
          $(listingsContainer).find(".clearfix").remove();
          $(".listings-container > .listing-item:nth-child("+gridColumns+"n)").after("<div class='clearfix'></div>");
        }
        // objects that need to resized
        var resizeObjects =  $('.listings-container .listing-img-container img, .listings-container .listing-img-container');
        // if list layout is active
        function listLayout() {
          if ( $('.layout-switcher a').is(".list.active") ) {
            $(listingsContainer).each(function(){
              $(this).removeClass("grid-layout grid-layout-three");
              $(this).addClass("list-layout");
            });
            $('.listing-item').each(function(){
              var listingContent = $(this).find('.listing-content').height();
              $(this).find(resizeObjects).css('height', ''+listingContent+'');
            });
          }
        } 
        listLayout();
        $(window).on('load resize', function() {
          listLayout();
        });
        // if grid layout is active
        $('.layout-switcher a.grid').on('click', function(e) { gridClear(2); });
        function gridLayout() {
          if ( $('.layout-switcher a').is(".grid.active") ) {
            $(listingsContainer).each(function(){
              $(this).removeClass("list-layout grid-layout-three");
              $(this).addClass("grid-layout");
            });
            $('.listing-item').each(function(){
              $(this).find(resizeObjects).css('height', 'auto');
            });
          }
        }
        gridLayout();
        // if grid layout is active
        $('.layout-switcher a.grid-three').on('click', function(e) { gridClear(3); });
        function gridThreeLayout() {
          if ( $('.layout-switcher a').is(".grid-three.active") ) {
            $(listingsContainer).each(function(){
              $(this).removeClass("list-layout grid-layout");
              $(this).addClass("grid-layout-three");
            });
            $('.listing-item').each(function(){
              $(this).find(resizeObjects).css('height', 'auto');
            });
          }
        } gridThreeLayout();
        // Mobile fixes
        $(window).on('resize', function() {
          $(resizeObjects).css('height', '0');
          listLayout();
          gridLayout();
          gridThreeLayout();
        });
        $(window).on('load resize', function() {
          var winWidth = $(window).width();
          if(winWidth < 992) {
            owlReload();
            // reset to two columns grid
            gridClear(2);
          }
          if(winWidth > 992) {
            if ( $(listingsContainer).is(".grid-layout-three") ) {
              gridClear(3);
            }
            if ( $(listingsContainer).is(".grid-layout") ) {
              gridClear(2);
            }
          }
          if(winWidth < 768) {
            if ( $(listingsContainer).is(".list-layout") ) {
              $('.listing-item').each(function(){
                $(this).find(resizeObjects).css('height', 'auto');
              });
            }
          }
          if(winWidth < 1366) {
            if ( $(".fs-listings").is(".list-layout") ) {
              $('.listing-item').each(function(){
                $(this).find(resizeObjects).css('height', 'auto');
              });
            }
          }
        });
        // owlCarousel reload
        function owlReload() {
          $('.listing-carousel').each(function(){
            $(this).data('owlCarousel').reload();
          });
        }
        // switcher buttons
        $('.layout-switcher a').on('click', function(e) {
          e.preventDefault();
          var switcherButton = $(this);
          switcherButton.addClass("active").siblings().removeClass('active');
          // reset images height
          $(resizeObjects).css('height', '0');
          // carousel reload
          owlReload();
          // if grid layout is active
          gridLayout();
          // if three columns grid layout is active
          gridThreeLayout();
          // if list layout is active
          listLayout();
        });
      }
      gridLayoutSwitcher();
    },
    rangeGrid: function() {
      /*----------------------------------------------------*/
      /*  Range Sliders
      /*----------------------------------------------------*/
      // Area Range
      $("#area-range").each(function() {
        var dataMin = $(this).attr('data-min');
        var dataMax = $(this).attr('data-max');
        var dataUnit = $(this).attr('data-unit');
        $(this).append( "<input type='text' class='first-slider-value'disabled/><input type='text' class='second-slider-value' disabled/>" );
        $(this).slider({
          range: true,
          min: dataMin,
          max: dataMax,
          step: 10,
          values: [ dataMin, dataMax ],
          slide: function( event, ui ) {
           event = event;
           $(this).children( ".first-slider-value" ).val( ui.values[ 0 ]  + " " + dataUnit );
           $(this).children( ".second-slider-value" ).val( ui.values[ 1 ] + " " +  dataUnit );
          }
        });
         $(this).children( ".first-slider-value" ).val( $( this ).slider( "values", 0 ) + " " + dataUnit );
         $(this).children( ".second-slider-value" ).val( $( this ).slider( "values", 1 ) + " " + dataUnit );
      });
      // Price Range
      $("#price-range").each(function() {
        var dataMin = $(this).attr('data-min');
        var dataMax = $(this).attr('data-max');
        var dataUnit = $(this).attr('data-unit');
        $(this).append( "<input type='text' class='first-slider-value' disabled/><input type='text' class='second-slider-value' disabled/>" );
        $(this).slider({
          range: true,
          min: dataMin,
          max: dataMax,
          values: [ dataMin, dataMax ],
          slide: function( event, ui ) {
           event = event;
           $(this).children( ".first-slider-value" ).val( dataUnit  + ui.values[ 0 ].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
           $(this).children( ".second-slider-value" ).val( dataUnit +  ui.values[ 1 ].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
          }
        });
         $(this).children( ".first-slider-value" ).val( dataUnit + $( this ).slider( "values", 0 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
         $(this).children( ".second-slider-value" ).val( dataUnit  +  $( this ).slider( "values", 1 ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
      });
    },
    showMoreButton: function () {
      $('.show-more-button').on('click', function(e){
        e.preventDefault();
        $('.show-more').toggleClass('visible');
      });
    },
  }
})();