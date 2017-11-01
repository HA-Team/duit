const uiFunctions = function() {
  return {
    inlineCss: function() {
      $('.some-classes, section.fullwidth, .img-box-background, .flip-banner, .property-slider .item, .fullwidth-property-slider .item, .fullwidth-home-slider .item, .address-container').each(function() {
        var a = $(this).attr('data-background-image'),
          b = $(this).attr('data-background-color');
        void 0 !== a && $(this).css('background-image', 'url(' + a + ')'), void 0 !== b && $(this).css('background', '' + b + '')
      })
    },
    buildCarousel: function() {
      $('.carousel').owlCarousel({
        autoPlay: !1,
        navigation: !0,
        slideSpeed: 600,
        items: 5,
        itemsDesktop: [1239, 3],
        itemsTablet: [991, 2],
        itemsMobile: [767, 1]
      }), $('.logo-carousel').owlCarousel({
        autoPlay: !1,
        navigation: !0,
        slideSpeed: 600,
        items: 5,
        itemsDesktop: [1239, 4],
        itemsTablet: [991, 3],
        itemsMobile: [767, 1]
      }), $('.listing-carousel:not(.owl-carousel)').owlCarousel({
        autoPlay: !1,
        navigation: !0,
        slideSpeed: 800,
        items: 1,
        itemsDesktop: [1239, 1],
        itemsTablet: [991, 1],
        itemsMobile: [767, 1]
      }), $('.owl-next, .owl-prev').on('click', function(a) {
        a.preventDefault()
      })
    },
    buildSlickCarousel: function() {
      $('.property-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !0,
        fade: !0,
        asNavFor: '.property-slider-nav',
        centerMode: !0,
        slide: '.item'
      }), 
      $('.property-slider-nav').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        asNavFor: '.property-slider',
        dots: !1,
        arrows: !1,
        centerMode: !1,
        focusOnSelect: !0,
        responsive: [{
          breakpoint: 993,
          settings: {
            slidesToShow: 4
          }
        }, {
          breakpoint: 767,
          settings: {
            slidesToShow: 3
          }
        }]
      }), 
      $('.fullwidth-property-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
        adaptiveHeight: true,
        initialSlide: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 1367,
          settings: {
            centerPadding: '15%'
          }
        }, {
          breakpoint: 993,
          settings: {
            centerPadding: '0'
          }
        }]
      }),
      $('.fullwidth-home-slider').slick({
        centerMode: !0,
        centerPadding: '0',
        slidesToShow: 1,
        responsive: [{
          breakpoint: 1367,
          settings: {
            centerPadding: '0'
          }
        }, {
          breakpoint: 993,
          settings: {
            centerPadding: '0'
          }
        }]
      }), this.inlineCss()
    },
    reBuildCarousel: function() {
      this.buildCarousel()
    },
    buildMagnificPopup: function() {
      $('body').magnificPopup({
        type: 'image',
        delegate: 'a.mfp-gallery',
        fixedContentPos: !0,
        fixedBgPos: !0,
        overflowY: 'auto',
        closeBtnInside: !1,
        preloader: !0,
        removalDelay: 0,
        mainClass: 'mfp-fade',
        gallery: {
          enabled: !0
        }
      })
    },
    buildParallax: function() {
      function c() {
        var a = $('body').height();
        $('.content-b').each(function() {
          $(this).innerHeight() > a && $(this).closest('.fullscreen').addClass('overflow')
        })
      }

      function d() {
        var e = $(window).height();
        $('.parallax').each(function() {
          var f = $(this),
            g = f.width(),
            h = f.height(),
            i = f.attr('data-img-width'),
            j = f.attr('data-img-height'),
            a = i / j,
            b = 100;
          b = b ? b : 0;
          var c = 0;
          f.hasClass('parallax') && !$('html').hasClass('touch') && (c = e - h), j = h + c + b, i = j * a, g > i && (i = g, j = i / a), f.data('resized-imgW', i), f.data('resized-imgH', j), f.css('background-size', i + 'px ' + j + 'px')
        })
      }

      function a() {
        var d = $(window).height(),
          e = $(window).scrollTop(),
          f = e + d,
          g = (e + f) / 2;
        $('.parallax').each(function() {
          var i = $(this),
            j = i.height(),
            k = i.offset().top,
            a = k + j;
          if (f > k && e < a) {
            var b = i.data('resized-imgH'),
              l = 0,
              m = -b + d,
              n = j < d ? b - j : b - d;
            k -= n, a += n;
            var o = 0;
            o = $('.parallax').is('.titlebar') ? l + 2 * ((m - l) * (g - k) / (a - k)) : l + (m - l) * (g - k) / (a - k);
            var p = i.attr('data-oriz-pos');
            p = p ? p : '50%', $(this).css('background-position', p + ' ' + o + 'px')
          }
        })
      }(function() {
        $('.parallax').prepend('<div class="parallax-overlay"></div>'), $('.parallax').each(function() {
          var e = $(this).attr('data-background'),
            a = $(this).attr('data-color'),
            b = $(this).attr('data-color-opacity'),
            c = $(this).attr('data-z-index');
          void 0 !== e && $(this).css('background-image', 'url(' + e + ')'), void 0 !== a && $(this).find('.parallax-overlay').css('background-color', '' + a + ''), void 0 !== b && $(this).find('.parallax-overlay').css('opacity', '' + b + ''), void 0 !== c && $(this).css('z-index', '' + c + '')
        })
      })(), 'ontouchstart' in window && (document.documentElement.className += ' touch'), $('html').hasClass('touch') || $('.parallax').css('background-attachment', 'fixed'), $(window).resize(c), c(), $(window).resize(d), $(window).focus(d), d(), $('html').hasClass('touch') || ($(window).resize(a), $(window).focus(a), $(window).scroll(a), a())
    },
    buildFooter: function() {
      $.fn.footerReveal = function(b) {
        $('#footer.sticky-footer').before('<div class="footer-shadow"></div>');
        var c = $(this),
          d = c.prev(),
          e = $(window),
          f = $.extend({
            shadow: !0,
            shadowOpacity: 0.12,
            zIndex: -10
          }, b),
          g = $.extend(!0, {}, f, b);
        return c.before('<div class="footer-reveal-offset"></div>'), c.outerHeight() <= e.outerHeight() && (c.css({
          "z-index": f.zIndex,
          position: 'fixed',
          bottom: 0
        }), e.on('load resize', function() {
          c.css({
            width: d.outerWidth()
          }), d.css({
            "margin-bottom": c.outerHeight()
          })
        })), this
      }, navigator.userAgent.match(/Trident\/7\./) && $('#footer').removeClass('sticky-footer'), $('#footer.sticky-footer').footerReveal()
    },
    buildChosen: function() {
      var a = {
        ".chosen-select": {
          disable_search_threshold: 10,
          width: '100%'
        },
        ".chosen-select-deselect": {
          allow_single_deselect: !0,
          width: '100%'
        },
        ".chosen-select-no-single": {
          disable_search_threshold: 100,
          width: '100%'
        },
        ".chosen-select-no-single.no-search": {
          disable_search_threshold: 10,
          width: '100%'
        },
        ".chosen-select-no-results": {
          no_results_text: 'Oops, nothing found!'
        },
        ".chosen-select-width": {
          width: '95%'
        }
      };
      for (var b in a) a.hasOwnProperty(b) && $(b).chosen(a[b])
    },
    buildSearchTypeButtons: function() {
      function a() {
        $('.search-type label.active input[type="radio"]').prop('checked', !0);
        var a = $('.search-type label.active').width(),
          b = $('.search-type label.active').position().left;
        $('.search-type-arrow').css('left', b + a / 2), $('.search-type label').on('change', function() {
          $('.search-type input[type="radio"]').parent('label').removeClass('active'), $('.search-type input[type="radio"]:checked').parent('label').addClass('active');
          var a = $('.search-type label.active').width(),
            b = $('.search-type label.active').position().left;
          $('.search-type-arrow').css({
            left: b + a / 2,
            transition: 'left 0.4s cubic-bezier(.87,-.41,.19,1.44)'
          })
        })
      }
      $('.main-search-form').length && (a(), $(window).on('load resize', function() {
        a()
      }))
    },
    buildBackToTop: function() {
      $(window).scroll(function() {
        600 <= $(window).scrollTop() ? $('#backtotop').fadeIn(300) : $('#backtotop').fadeOut(300)
      }), $('#backtotop a').on('click', function() {
        return $('html, body').animate({
          scrollTop: 0
        }, 500), !1
      })
    },
    buildStickyHeader: function() {
      $('#header').not('#header-container.header-style-2 #header').clone(!0).addClass('cloned unsticky').insertAfter('#header'), $('#navigation.style-2').clone(!0).addClass('cloned unsticky').insertAfter('#navigation.style-2'), $('#logo .sticky-logo').clone(!0).prependTo('#navigation.style-2.cloned ul#responsive');
      var a = 2 * $('#header-container').height();
      $(window).scroll(function() {
        $(window).scrollTop() >= a ? ($('#header.cloned').addClass('sticky').removeClass('unsticky'), $('#navigation.style-2.cloned').addClass('sticky').removeClass('unsticky')) : ($('#header.cloned').addClass('unsticky').removeClass('sticky'), $('#navigation.style-2.cloned').addClass('unsticky').removeClass('sticky'))
      })
    },
    buildTopBarMobileMenu: function() {
      const a = $.jPanelMenu({
        menu: '#responsive',
        animated: !1,
        duration: 200,
        keyboardShortcuts: !1,
        closeOnContentClick: !0
      });
      $('.menu-trigger').on('click', function() {
        var b = $(this);
        return b.hasClass('active') ? (a.off(), b.removeClass('active')) : (a.on(), a.open(), b.addClass('active'), $('#jPanelMenu-menu').removeClass('menu'), $('ul#jPanelMenu-menu li').removeClass('dropdown'), $('ul#jPanelMenu-menu li ul').removeAttr('style'), $('ul#jPanelMenu-menu li div').removeClass('mega').removeAttr('style'), $('ul#jPanelMenu-menu li div div').removeClass('mega-container')), !1
      }), $(window).resize(function() {
        var b = $(window).width();
        992 < b && a.close()
      })
    },
    gridSwitcher: function() {
      (function() {
        function b(b) {
          $(c).find('.clearfix').remove(), $('.listings-container > .listing-item:nth-child(' + b + 'n)').after('<div class=\'clearfix\'></div>')
        }

        function a() {
          $('.layout-switcher a').is('.list.active') && ($(c).each(function() {
            $(this).removeClass('grid-layout grid-layout-three'), $(this).addClass('list-layout')
          }), $('.listing-item').each(function() {
            var a = $(this).find('.listing-content').height();
            $(this).find(g).css('height', '' + a + '')
          }))
        }

        function e() {
          $('.layout-switcher a').is('.grid.active') && ($(c).each(function() {
            $(this).removeClass('list-layout grid-layout-three'), $(this).addClass('grid-layout')
          }), $('.listing-item').each(function() {
            $(this).find(g).css('height', 'auto')
          }))
        }

        function d() {
          $('.layout-switcher a').is('.grid-three.active') && ($(c).each(function() {
            $(this).removeClass('list-layout grid-layout'), $(this).addClass('grid-layout-three')
          }), $('.listing-item').each(function() {
            $(this).find(g).css('height', 'auto')
          }))
        }

        function f() {
          $('.listing-carousel').each(function() {
            $(this).data('owlCarousel').reload()
          })
        }
        var c = $('.listings-container');
        $(c).is('.list-layout') && (f(), $('.layout-switcher a.grid, .layout-switcher a.grid-three').removeClass('active'), $('.layout-switcher a.list').addClass('active')), $(c).is('.grid-layout') && (f(), $('.layout-switcher a.grid').addClass('active'), $('.layout-switcher a.grid-three, .layout-switcher a.list').removeClass('active'), b(2)), $(c).is('.grid-layout-three') && (f(), $('.layout-switcher a.grid, .layout-switcher a.list').removeClass('active'), $('.layout-switcher a.grid-three').addClass('active'), b(3));
        var g = $('.listings-container .listing-img-container img, .listings-container .listing-img-container');
        a(), $(window).on('load resize', function() {
          a()
        }), $('.layout-switcher a.grid').on('click', function() {
          b(2)
        }), e(), $('.layout-switcher a.grid-three').on('click', function() {
          b(3)
        }), d(), $(window).on('resize', function() {
          $(g).css('height', '0'), a(), e(), d()
        }), $(window).on('load resize', function() {
          var d = $(window).width();
          992 > d && (f(), b(2)), 992 < d && ($(c).is('.grid-layout-three') && b(3), $(c).is('.grid-layout') && b(2)), 768 > d && $(c).is('.list-layout') && $('.listing-item').each(function() {
            $(this).find(g).css('height', 'auto')
          }), 1366 > d && $('.fs-listings').is('.list-layout') && $('.listing-item').each(function() {
            $(this).find(g).css('height', 'auto')
          })
        }), $('.layout-switcher a').on('click', function(h) {
          h.preventDefault();
          var c = $(this);
          c.addClass('active').siblings().removeClass('active'), $(g).css('height', '0'), f(), e(), d(), a()
        })
      })()
    },
    rangeGrid: function() {
      $('#area-range').each(function() {
        var a = $(this).attr('data-min'),
          b = $(this).attr('data-max'),
          f = $(this).attr('data-unit');
        $(this).append('<input type=\'text\' class=\'first-slider-value\'disabled/><input type=\'text\' class=\'second-slider-value\' disabled/>'), $(this).slider({
          range: !0,
          min: a,
          max: b,
          step: 10,
          values: [a, b],
          slide: function(a, b) {
            a = a, $(this).children('.first-slider-value').val(b.values[0] + ' ' + f), $(this).children('.second-slider-value').val(b.values[1] + ' ' + f)
          }
        }), $(this).children('.first-slider-value').val($(this).slider('values', 0) + ' ' + f), $(this).children('.second-slider-value').val($(this).slider('values', 1) + ' ' + f)
      }), $('#price-range').each(function() {
        var a = $(this).attr('data-min'),
          b = $(this).attr('data-max'),
          f = $(this).attr('data-unit');
        $(this).append('<input type=\'text\' class=\'first-slider-value\' disabled/><input type=\'text\' class=\'second-slider-value\' disabled/>'), $(this).slider({
          range: !0,
          min: a,
          max: b,
          values: [a, b],
          slide: function(a, b) {
            a = a, $(this).children('.first-slider-value').val(f + b.values[0].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')), $(this).children('.second-slider-value').val(f + b.values[1].toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
          }
        }), $(this).children('.first-slider-value').val(f + $(this).slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')), $(this).children('.second-slider-value').val(f + $(this).slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
      })
    },
    showMoreButton: function() {
      $('.show-more-button').on('click', function(a) {
        a.preventDefault(), $('.show-more').toggleClass('visible')
      })
    },
    buildTabs: function() {
      var e = $('.tabs-nav'),
        a = e.children('li');
      e.each(function() {
        var a = $(this);
        a.next().children('.tab-content').stop(!0, !0).hide().first().show(), a.children('li').first().addClass('active').stop(!0, !0).show()
      }), a.on('click', function(a) {
        var b = $(this);
        b.siblings().removeClass('active').end().addClass('active'), b.parent().next().children('.tab-content').stop(!0, !0).hide().siblings(b.find('a').attr('href')).fadeIn(), a.preventDefault()
      });
      var b = window.location.hash,
        c = $('.tabs-nav a[href="' + b + '"]');
      0 === c.length ? ($('.tabs-nav li:first').addClass('active').show(), $('.tab-content:first').show()) : (console.log(c), c.parent('li').click())
    }
  }
}();