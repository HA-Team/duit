const uiFunctions=function(){return{inlineCss:function(){$('.some-classes, section.fullwidth, .img-box-background, .flip-banner, .property-slider .item, .fullwidth-property-slider .item, .fullwidth-home-slider .item, .address-container').each(function(){var c=$(this).attr('data-background-image'),a=$(this).attr('data-background-color');void 0!==c&&$(this).css('background-image','url('+c+')'),void 0!==a&&$(this).css('background',''+a+'')})},buildCarousel:function(){$('.carousel').owlCarousel({autoPlay:!1,navigation:!0,slideSpeed:600,items:5,itemsDesktop:[1239,3],itemsTablet:[991,2],itemsMobile:[767,1]}),$('.logo-carousel').owlCarousel({autoPlay:!1,navigation:!0,slideSpeed:600,items:5,itemsDesktop:[1239,4],itemsTablet:[991,3],itemsMobile:[767,1]}),$('.listing-carousel:not(.owl-carousel)').owlCarousel({autoPlay:!1,navigation:!0,slideSpeed:800,items:1,itemsDesktop:[1239,1],itemsTablet:[991,1],itemsMobile:[767,1]}),$('.owl-next, .owl-prev').on('click',function(b){b.preventDefault()})},buildSlickCarousel:function(){$('.property-slider').slick({slidesToShow:1,slidesToScroll:1,arrows:!0,fade:!0,asNavFor:'.property-slider-nav',centerMode:!0,slide:'.item'}),$('.property-slider-nav').slick({slidesToShow:6,slidesToScroll:1,asNavFor:'.property-slider',dots:!1,arrows:!1,centerMode:!1,focusOnSelect:!0,responsive:[{breakpoint:993,settings:{slidesToShow:4}},{breakpoint:767,settings:{slidesToShow:3}}]}),$('.fullwidth-property-slider').slick({dots:!0,infinite:!0,speed:300,slidesToShow:1,centerMode:!0,variableWidth:!0,adaptiveHeight:!0,focusOnSelect:!0,responsive:[{breakpoint:1367,settings:{centerPadding:'15%'}},{breakpoint:993,settings:{centerPadding:'0'}}]}),$('.fullwidth-home-slider').slick({centerMode:!0,centerPadding:'0',slidesToShow:1,responsive:[{breakpoint:1367,settings:{centerPadding:'0'}},{breakpoint:993,settings:{centerPadding:'0'}}]}),this.inlineCss()},reBuildCarousel:function(){this.buildCarousel()},buildMagnificPopup:function(){$('body').magnificPopup({type:'image',delegate:'a.mfp-gallery',fixedContentPos:!0,fixedBgPos:!0,overflowY:'auto',closeBtnInside:!1,preloader:!0,removalDelay:0,mainClass:'mfp-fade',gallery:{enabled:!0}})},buildParallax:function(){function b(){var b=$('body').height();$('.content-b').each(function(){$(this).innerHeight()>b&&$(this).closest('.fullscreen').addClass('overflow')})}function c(){var d=$(window).height();$('.parallax').each(function(){var e=$(this),f=e.width(),g=e.height(),h=e.attr('data-img-width'),i=e.attr('data-img-height'),j=h/i,a=100;a=a?a:0;var b=0;e.hasClass('parallax')&&!$('html').hasClass('touch')&&(b=d-g),i=g+b+a,h=i*j,f>h&&(h=f,i=h/j),e.data('resized-imgW',h),e.data('resized-imgH',i),e.css('background-size',h+'px '+i+'px')})}function d(){var c=$(window).height(),d=$(window).scrollTop(),e=d+c,f=(d+e)/2;$('.parallax').each(function(){var g=$(this),h=g.height(),i=g.offset().top,j=i+h;if(e>i&&d<j){var a=g.data('resized-imgH'),k=0,l=-a+c,m=h<c?a-h:a-c;i-=m,j+=m;var n=0;n=$('.parallax').is('.titlebar')?k+2*((l-k)*(f-i)/(j-i)):k+(l-k)*(f-i)/(j-i);var o=g.attr('data-oriz-pos');o=o?o:'50%',$(this).css('background-position',o+' '+n+'px')}})}(function(){$('.parallax').prepend('<div class="parallax-overlay"></div>'),$('.parallax').each(function(){var d=$(this).attr('data-background'),e=$(this).attr('data-color'),a=$(this).attr('data-color-opacity'),b=$(this).attr('data-z-index');void 0!==d&&$(this).css('background-image','url('+d+')'),void 0!==e&&$(this).find('.parallax-overlay').css('background-color',''+e+''),void 0!==a&&$(this).find('.parallax-overlay').css('opacity',''+a+''),void 0!==b&&$(this).css('z-index',''+b+'')})})(),'ontouchstart'in window&&(document.documentElement.className+=' touch'),$('html').hasClass('touch')||$('.parallax').css('background-attachment','fixed'),$(window).resize(b),b(),$(window).resize(c),$(window).focus(c),c(),$('html').hasClass('touch')||($(window).resize(d),$(window).focus(d),$(window).scroll(d),d())},buildFooter:function(){$.fn.footerReveal=function(a){$('#footer.sticky-footer').before('<div class="footer-shadow"></div>');var b=$(this),c=b.prev(),d=$(window),e=$.extend({shadow:!0,shadowOpacity:0.12,zIndex:-10},a),f=$.extend(!0,{},e,a);return b.before('<div class="footer-reveal-offset"></div>'),b.outerHeight()<=d.outerHeight()&&(b.css({"z-index":e.zIndex,position:'fixed',bottom:0}),d.on('load resize',function(){b.css({width:c.outerWidth()}),c.css({"margin-bottom":b.outerHeight()})})),this},navigator.userAgent.match(/Trident\/7\./)&&$('#footer').removeClass('sticky-footer'),$('#footer.sticky-footer').footerReveal()},buildChosen:function(){var c={".chosen-select":{disable_search_threshold:10,width:'100%'},".chosen-select-deselect":{allow_single_deselect:!0,width:'100%'},".chosen-select-no-single":{disable_search_threshold:100,width:'100%'},".chosen-select-no-single.no-search":{disable_search_threshold:10,width:'100%'},".chosen-select-no-results":{no_results_text:'Oops, nothing found!'},".chosen-select-width":{width:'95%'}};for(var a in c)c.hasOwnProperty(a)&&$(a).chosen(c[a])},buildSearchTypeButtons:function(){function b(){$('.search-type label.active input[type="radio"]').prop('checked',!0);var c=$('.search-type label.active').width(),d=$('.search-type label.active').position().left;$('.search-type-arrow').css('left',d+c/2),$('.search-type label').on('change',function(){$('.search-type input[type="radio"]').parent('label').removeClass('active'),$('.search-type input[type="radio"]:checked').parent('label').addClass('active');var c=$('.search-type label.active').width(),a=$('.search-type label.active').position().left;$('.search-type-arrow').css({left:a+c/2,transition:'left 0.4s cubic-bezier(.87,-.41,.19,1.44)'})})}$('.main-search-form').length&&(b(),$(window).on('load resize',function(){b()}))},buildBackToTop:function(){$(window).scroll(function(){600<=$(window).scrollTop()?$('#backtotop').fadeIn(300):$('#backtotop').fadeOut(300)}),$('#backtotop a').on('click',function(){return $('html, body').animate({scrollTop:0},500),!1})},buildStickyHeader:function(){$('#header').not('#header-container.header-style-2 #header').clone(!0).addClass('cloned unsticky').insertAfter('#header'),$('#navigation.style-2').clone(!0).addClass('cloned unsticky').insertAfter('#navigation.style-2'),$('#logo .sticky-logo').clone(!0).prependTo('#navigation.style-2.cloned ul#responsive');var b=2*$('#header-container').height();$(window).scroll(function(){$(window).scrollTop()>=b?($('#header.cloned').addClass('sticky').removeClass('unsticky'),$('#navigation.style-2.cloned').addClass('sticky').removeClass('unsticky')):($('#header.cloned').addClass('unsticky').removeClass('sticky'),$('#navigation.style-2.cloned').addClass('unsticky').removeClass('sticky'))})},buildTopBarMobileMenu:function(){const c=$.jPanelMenu({menu:'#responsive',animated:!1,duration:200,keyboardShortcuts:!1,closeOnContentClick:!0});$('.menu-trigger').on('click',function(){var a=$(this);return a.hasClass('active')?(c.off(),a.removeClass('active')):(c.on(),c.open(),a.addClass('active'),$('#jPanelMenu-menu').removeClass('menu'),$('ul#jPanelMenu-menu li').removeClass('dropdown'),$('ul#jPanelMenu-menu li ul').removeAttr('style'),$('ul#jPanelMenu-menu li div').removeClass('mega').removeAttr('style'),$('ul#jPanelMenu-menu li div div').removeClass('mega-container')),!1}),$(window).resize(function(){var a=$(window).width();992<a&&c.close()})},gridSwitcher:function(){(function(){function h(a){$(f).find('.clearfix').remove(),$('.listings-container > .listing-item:nth-child('+a+'n)').after('<div class=\'clearfix\'></div>')}function b(){$('.layout-switcher a').is('.list.active')&&($(f).each(function(){$(this).removeClass('grid-layout grid-layout-three'),$(this).addClass('list-layout')}),$('.listing-item').each(function(){var b=$(this).find('.listing-content').height();$(this).find(d).css('height',''+b+'')}))}function a(){$('.layout-switcher a').is('.grid.active')&&($(f).each(function(){$(this).removeClass('list-layout grid-layout-three'),$(this).addClass('grid-layout')}),$('.listing-item').each(function(){$(this).find(d).css('height','auto')}))}function e(){$('.layout-switcher a').is('.grid-three.active')&&($(f).each(function(){$(this).removeClass('list-layout grid-layout'),$(this).addClass('grid-layout-three')}),$('.listing-item').each(function(){$(this).find(d).css('height','auto')}))}function i(){$('.listing-carousel').each(function(){$(this).data('owlCarousel').reload()})}var f=$('.listings-container');$(f).is('.list-layout')&&(i(),$('.layout-switcher a.grid, .layout-switcher a.grid-three').removeClass('active'),$('.layout-switcher a.list').addClass('active')),$(f).is('.grid-layout')&&(i(),$('.layout-switcher a.grid').addClass('active'),$('.layout-switcher a.grid-three, .layout-switcher a.list').removeClass('active'),h(2)),$(f).is('.grid-layout-three')&&(i(),$('.layout-switcher a.grid, .layout-switcher a.list').removeClass('active'),$('.layout-switcher a.grid-three').addClass('active'),h(3));var d=$('.listings-container .listing-img-container img, .listings-container .listing-img-container');b(),$(window).on('load resize',function(){b()}),$('.layout-switcher a.grid').on('click',function(){h(2)}),a(),$('.layout-switcher a.grid-three').on('click',function(){h(3)}),e(),$(window).on('resize',function(){$(d).css('height','0'),b(),a(),e()}),$(window).on('load resize',function(){var a=$(window).width();992>a&&(i(),h(2)),992<a&&($(f).is('.grid-layout-three')&&h(3),$(f).is('.grid-layout')&&h(2)),768>a&&$(f).is('.list-layout')&&$('.listing-item').each(function(){$(this).find(d).css('height','auto')}),1366>a&&$('.fs-listings').is('.list-layout')&&$('.listing-item').each(function(){$(this).find(d).css('height','auto')})}),$('.layout-switcher a').on('click',function(f){f.preventDefault();var g=$(this);g.addClass('active').siblings().removeClass('active'),$(d).css('height','0'),i(),a(),e(),b()})})()},rangeGrid:function(){$('#area-range').each(function(){var c=$(this).attr('data-min'),d=$(this).attr('data-max'),e=$(this).attr('data-unit');$(this).append('<input type=\'text\' class=\'first-slider-value\'disabled/><input type=\'text\' class=\'second-slider-value\' disabled/>'),$(this).slider({range:!0,min:c,max:d,step:10,values:[c,d],slide:function(c,a){c=c,$(this).children('.first-slider-value').val(a.values[0]+' '+e),$(this).children('.second-slider-value').val(a.values[1]+' '+e)}}),$(this).children('.first-slider-value').val($(this).slider('values',0)+' '+e),$(this).children('.second-slider-value').val($(this).slider('values',1)+' '+e)}),$('#price-range').each(function(){var c=$(this).attr('data-min'),d=$(this).attr('data-max'),e=$(this).attr('data-unit');$(this).append('<input type=\'text\' class=\'first-slider-value\' disabled/><input type=\'text\' class=\'second-slider-value\' disabled/>'),$(this).slider({range:!0,min:c,max:d,values:[c,d],slide:function(c,a){c=c,$(this).children('.first-slider-value').val(e+a.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,')),$(this).children('.second-slider-value').val(e+a.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,'))}}),$(this).children('.first-slider-value').val(e+$(this).slider('values',0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,')),$(this).children('.second-slider-value').val(e+$(this).slider('values',1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,'))})},showMoreButton:function(){$('.show-more-button').on('click',function(b){b.preventDefault(),$('.show-more').toggleClass('visible')})},buildTabs:function(){var d=$('.tabs-nav'),e=d.children('li');d.each(function(){var b=$(this);b.next().children('.tab-content').stop(!0,!0).hide().first().show(),b.children('li').first().addClass('active').stop(!0,!0).show()}),e.on('click',function(c){var a=$(this);a.siblings().removeClass('active').end().addClass('active'),a.parent().next().children('.tab-content').stop(!0,!0).hide().siblings(a.find('a').attr('href')).fadeIn(),c.preventDefault()});var a=window.location.hash,b=$('.tabs-nav a[href="'+a+'"]');0===b.length?($('.tabs-nav li:first').addClass('active').show(),$('.tab-content:first').show()):(console.log(b),b.parent('li').click())}}}();