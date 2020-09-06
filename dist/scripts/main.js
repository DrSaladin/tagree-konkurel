(function () {
  'use strict';

  $(document).ready(function() {
   $("#lightSlider").lightSlider({
      item: 6,
      auto: false,
      slideMargin: 10,
      slideMove: 1,
      loop: true,
      controls: false,
      speed: 600,
      pager: false,
      keyPress: true,
      mode: 'slide',
      responsive: [{
      breakpoint: 400,
      settings: {
         item: 1,
         slideMove: 1,
         slideMargin: 6,
       }
     }]
   });
 });

 $(document).ready(function() {
   $("#lightSliderGoods").lightSlider({
      item: 1,
      auto: false,
      slideMargin: 10,
      slideMove: 1,
      loop: true,
      controls: false,
      speed: 600,
      pager: false,
      keyPress: true,
      mode: 'slide',
   });
 });

  if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
      document
          .querySelector('html')
          .classList
          .add('is-ios');
  }
  var $root = $('html, body');
  var body = $('.body');

  var upBtn = $('#js-upBtn');
  if (upBtn.length) {
    upBtn.on('click', function () {
      $root.animate({
          scrollTop: 0
      }, 500);
      return false;
    });
  }
  
  $(window).scroll(function () {
    if ($(window).scrollTop() > 0) {
        body.addClass('body--scrolled');
    } else {
        body.removeClass('body--scrolled');
    }
  });

  var sliderList = $('#js-sliderList');
    
  if (sliderList.length) {
    var sliderNextCircle = $('#js-sliderCircle');

    var sliderTimeout = 0;
    var slideTime = 5000;
    sliderList.on('init', function (event, slick) {
      sliderNextCircle.addClass('circle--active');
      sliderTimeout = setTimeout(function() {
        sliderList.slick('slickNext');
      },slideTime);      
    });

    sliderList.on('beforeChange', function(event, slick, currentSlide, nextSlide){
      sliderNextCircle.removeClass('circle--active');
      clearTimeout(sliderTimeout);
    });
    
    sliderList.on('afterChange', function(event, slick, currentSlide){
      sliderNextCircle.addClass('circle--active');
      sliderTimeout = setTimeout(function() {
        sliderList.slick('slickNext');
      },slideTime);    
    });

    sliderList.slick({
      dots: true,
      infinite: true,
      draggable: false,
      speed: 500,
      autoplay: false,
      //autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '#js-sliderPrev',
      nextArrow: '#js-sliderNext'
    });
  }

  var filter = $('.filter');

  $.each(filter, function (i) {

    var thisFilter = $(this);
    var filterInner = thisFilter.find('.filter__inner');
    var closeBtn = thisFilter.find('.filter__close-btn');

    var range = thisFilter.find('.range');

    var slider;
    var min;
    var max;

    if (range.length) {

      slider = range.find('.range__slider')[0];

      min = slider.dataset.min ? parseFloat(slider.dataset.min) : 0;
      max = slider.dataset.max ? parseFloat(slider.dataset.max) : 100;

      var inputMin = range.find('.range__input--min')[0],
        inputMax = range.find('.range__input--max')[0],
        inputs = [
          inputMin, inputMax
        ],
        
        left = slider.dataset.left ? parseFloat(slider.dataset.left) : 0,
        right = slider.dataset.right ? parseFloat(slider.dataset.right) : 100,
        sliderStep = slider.dataset.step ? parseFloat(slider.dataset.step) : 1,
        sliderDecimals = slider.dataset.decimals ? parseInt(slider.dataset.decimals) : 0;

      var noLetters = function (input) {
        if (sliderDecimals==0) {
          input.value = input.value.replace(/[^\d]+/g, '');
        } else  {
          input.value = input.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1');
        }
      };

      inputMin.oninput = function () {
        noLetters(inputMin);
      };

      inputMax.oninput = function () {
        noLetters(inputMax);
      };

      noUiSlider.create(slider, {
        start: [
          left, right
        ],
        connect: true,
        step: sliderStep,
        range: {
          'min': min,
          'max': max
        },
        format: wNumb({decimals: sliderDecimals})
      });

      slider
        .noUiSlider
        .on('update', function (values, handle) {
          inputs[handle].value = values[handle];
          $(inputs[handle]).trigger('change');
        });

      var setSliderHandle = function (i, value) {
        var r = [null, null];
        r[i] = value;
        slider
          .noUiSlider
          .set(r);
      };

      // Listen to keydown events on the input field.
      inputs.forEach(function (input, handle) {

        input
          .addEventListener('change', function () {
            setSliderHandle(handle, this.value);
          });

        input.addEventListener('keydown', function (e) {

          var values = slider
            .noUiSlider
            .get();
          var value = Number(values[handle]);

          // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
          var steps = slider
            .noUiSlider
            .steps();

          // [down, up]
          var step = steps[handle];

          var position;

          // 13 is enter, 38 is key up, 40 is key down.
          switch (e.which) {

            case 13:
              setSliderHandle(handle, this.value);
              e.preventDefault();
              break;

            case 38:

              // Get step to go increase slider value (up)
              position = step[1];

              // false = no step is set
              if (position === false) {
                position = 1;
              }

              // null = edge of slider
              if (position !== null) {
                setSliderHandle(handle, value + position);
              }

              break;

            case 40:

              position = step[0];

              if (position === false) {
                position = 1;
              }

              if (position !== null) {
                setSliderHandle(handle, value - position);
              }
              break;
          }
        });
      });

    }

    function closeFilter() {
      thisFilter.removeClass('filter--active');
      $(document).off('keyup.clsFltr');
    }

    thisFilter.on('click', function(event) {
      if (window.matchMedia("(min-width: 960px)").matches) {
        if (!thisFilter.hasClass('filter--active')) {
          thisFilter.addClass('filter--active');
          $(document).on('keyup.clsFltr',function(event) {
            if (event.keyCode === 27) {
              closeFilter();
            }
          });
        } else {
          if (!$(event.target).closest(filterInner).length || $(event.target).closest(closeBtn).length) {
            closeFilter();
          }
        }
      }
    });
  });

  var breadCrumbs =$('#js-breadCrumbs');
  if (breadCrumbs.length) {
    var breadCrumbsBtn = breadCrumbs.find('#js-breadCrumbsBtn');
    breadCrumbsBtn.on('click', function(){
      breadCrumbs.toggleClass('bread-crumbs--active');
      body.toggleClass('bread-crumbs-overflow');
    });
  }

  var subcategoryScroll = $('#js-subcategory-swipe');
  if (subcategoryScroll.length) {
      subcategoryScroll.overlayScrollbars({
          overflowBehavior: {
              x: "scroll",
              y: "hidden"
          },
          className: "os-theme-dark",
          scrollbars : {
            dragScrolling: true,
            touchSupport: true,
          },
          callbacks: {
            onInitialized: function () {
              var tabsContainer = subcategoryScroll.find('.os-viewport');
              tabsContainer.on('mousewheel DOMMouseScroll', function (event) {
                event.preventDefault();
                var delta = Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));
                $(this).scrollLeft($(this).scrollLeft() - (delta * 30));
              });

              var x,left,down;

              tabsContainer.mousedown(function(e){
                e.preventDefault();
                down=true;
                x=e.pageX;
                left=$(this).scrollLeft();
              });

              tabsContainer.mousemove(function(e){
                if(down){
                  var newX=e.pageX;
                  tabsContainer.scrollLeft(left-newX+x);
                  if (Math.abs(newX-x) > 5) {
                    tabsContainer.on('click.prevent',function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      tabsContainer.off('click.prevent');
                    });
                  }
                }
              });
              tabsContainer.mouseup(function(e){down=false;});
              tabsContainer.mouseout(function(e){down=false;});
            }
          }
      });
  }


  var filters = $('#js-filters');
  if (filters.length) {
    var filtersScroll = filters.find('#js-filtersScroll');

    var filtersInstance;

    var doFiltersScroll = function() {
      filtersInstance = filtersScroll.overlayScrollbars({
        overflowBehavior: {
          x: "hidden",
          y: "scroll"
        },
        className: "os-theme-dark",
        scrollbars : {
          dragScrolling: true,
          touchSupport: true,
        }
      }).overlayScrollbars();
    };
    
    if (window.matchMedia("(max-width: 1299px)").matches) {
      doFiltersScroll();
    }

    $(window).on('resize', function() {
      if (window.matchMedia("(max-width: 1299px)").matches && !filtersInstance) {
        doFiltersScroll();
      } else if (!window.matchMedia("(max-width: 1299px)").matches && filtersInstance) {
        filtersInstance.destroy();
        filtersInstance = null;
      }
    });

    var accordion = filters.find('#js-filtersAcc');
    var accordionBtn = filters.find('#js-filtersAccBtn');
    accordionBtn.on('click', function(){
      accordion.slideToggle('slow');
      $(this).toggleClass('filters__acc-btn--closed');
    });

    var filterAccordion = filters.find('.js-filter-acc');
    var filterAccordionBtn = filters.find('.js-filter-acc-btn');
    if (filterAccordion.length && filterAccordionBtn.length) {
      $(document).on('click', '.js-filter-acc-btn', function () {
        var $this = $(this);
        var $next = $this.next();
        $next.slideToggle('slow').removeClass('filters__filter-acc--active');
        $this.toggleClass('filters__filter-name--active');
      });
    }

    var showFilters = $('#js-showFilters');
    showFilters.on('click', function() {
      body.addClass('filters-overflow');
      filters.addClass('filters--active');
      filters.on('click', function(event) {
        if (event.target !== this && !$(event.target).is('#filtersClose') ) return;
        filters.off('click');
        body.removeClass('filters-overflow');
        filters.removeClass('filters--active');
      });
    });
  }





    var tabelsWrap = $('#js-tabelsWrap');
    if (!tabelsWrap.length) {
        var pageHeaderBasket = $('.js-page-header__basket');
        var cartAction = pageHeaderBasket.attr('data-action');
        if (cartAction) {
            var availabilityBtn = $('#js-mainProduct-availabilityBtn');
            var availabilityId = availabilityBtn.attr('data-id');

            $(document).on('click.delFromAvailability', '.page-header__order-del', function (event) {
                var target = $(event.target);
                var btn = target.hasClass('page-header__order-del') ? target : target.closest('.page-header__order-del');
                var btnId = btn.attr('data-id');
                if (!btnId) return;

                var formData = {
                    delFromCard: btnId
                };

                $.ajax({
                    url: cartAction,
                    method: "POST",
                    data: formData,
                    dataType: 'json',
                    success: function (response) {
                        if (availabilityId && btnId == availabilityId) {
                            availabilityBtn.removeClass(' main-product__availability-btn--in-cart');
                        }
                    }
                });

            });
            if (availabilityBtn.length) {
                var availabilityTimer;

                var availabilityInput = availabilityBtn.parent().find('.js-stepperInput');
                availabilityBtn.on('click', function () {

                    if (!availabilityId) return;

                    var stepperVal = availabilityInput.val();

                    var emptyQty = (!stepperVal || stepperVal == '' || stepperVal == 0);

                    var formData = {
                        addToCard: availabilityId,
                        qty: emptyQty ? 1 : stepperVal
                    };

                    $.ajax({
                        url: cartAction,
                        method: "POST",
                        data: formData,
                        dataType: 'json',
                        success: function (response) {
                            clearTimeout(availabilityTimer);
                            availabilityBtn.addClass('main-product__availability-btn--to-cart');
                            if (emptyQty) stepperInput.val(1);
                            availabilityTimer = setTimeout(function () {
                                availabilityBtn.addClass(' main-product__availability-btn--in-cart');
                                availabilityBtn.removeClass('main-product__availability-btn--to-cart');
                            }, 2000);
                        }
                    });
                });
            }
        }
    }




    var vacancyFile = $('#js-vacancyFormFile');
  
  if (vacancyFile.length){

    var vacancyFileName = $('#js-vacancyFileName');
    var vacancyFileClear = $('#js-vacancyDelFile');

    vacancyFile.on('change',function() {
      var files = this.files;
      if (!files.length || !files[0]) return;
      vacancyFileName.text(files[0].name);
      vacancyFileClear.addClass('vacancy__form-file-clear--active');

      vacancyFileClear.on('click',function(){
        vacancyFileClear.off('click');
        vacancyFile.val('');
        vacancyFileName.text('');
        vacancyFileClear.removeClass('vacancy__form-file-clear--active');
      });
    });

  }


  var navBurger = $('#js-navBurger');
  var navShadow = $('#js-navShadow');
  var nav = $('#js-nav');
  var navItem = nav.find('.js-navItem');
  var navSubSection = nav.find('.js-navSubSection');

  $.each(navSubSection, function (i) {
      var navSubBack = $(this).find('.js-navSubBack');
      navSubBack.on('click', function() {
        $(this).closest('.js-subNav').removeClass('nav__sub--showed');
      });

    });

    $.each(navItem, function (i) {
        var item = $(this);
        var thisSection = item.find('.js-navSection');
        var thisSubnav = item.find('.js-subNav');
        var subNavBack = item.find('.js-subNavBack');

        function showSubmenu (){
            nav.addClass('nav--active');
            navItem.removeClass('nav__item--active');
            item.addClass('nav__item--active');
        }

        function closeSubmenu () {
            nav.removeClass('nav--active');
            navItem.removeClass('nav__item--active');
        }

        thisSection.on('click', function() {
            if (window.matchMedia("(min-width: 1170px)").matches) {
                if (thisSubnav.length) {
                    showSubmenu ();
                } else {
                    closeSubmenu ();
                }
            } else {
                if (thisSubnav.length) {
                    thisSubnav.addClass('nav__sub--showed');
                }
            }
        });

        if (subNavBack.length) {
            subNavBack.on('click', function() {
                thisSubnav.removeClass('nav__sub--showed');
            });
        }

        thisSection.on('mouseenter', function() {
            if (window.matchMedia("(min-width: 1170px)").matches) {
                if (thisSubnav.length) {
                    showSubmenu ();
                } else {
                    closeSubmenu ();
                }
            }
        });

        nav.on('mouseleave', function() {
            if (window.matchMedia("(min-width: 1170px)").matches) {
                closeSubmenu ();
            }
        });
    });

    navBurger.on('click', function() {
        $(this).toggleClass('page-header__burger--active');
        nav.toggleClass('nav--showed');
        navShadow.toggleClass('nav__shadow--showed');
        body.toggleClass('overflow-tablet');
    });

    navShadow.on('click', function () {
      navShadow.removeClass('nav__shadow--showed');
      nav.removeClass('nav--showed');
      navBurger.removeClass('page-header__burger--active');
      body.removeClass('overflow-tablet');
    });

    var search = $('#js-search');

    var searchSelect = $('#js-searchSelect');
    if (searchSelect.length) {
        searchSelect.selectize({
            plugins: ['typing_mode'],
            usePlaceholder: true,
            create: true,
            createOnBlur: true,
            addPrecedence: true,
            labelField: 'name',
            valueField: 'value',
            optgroupField: 'optgroup',
            searchField: ['name', 'value'],
            sortField: [
                { field: "optgroup", direction: "asc" }
            ],
            render: {
                option_create: function(data, escape) {
                    var addString = 'Ищем:';
                    return '<div class="create">' + addString + ' <strong>' + escape(data.input) + '</strong>&hellip;</div>';
                },
            },
            onDropdownOpen: function ($dropdown) {
                $dropdown.overlayScrollbars({
                    overflowBehavior: {
                        x: "hidden",
                        y: "scroll"
                    },
                    className: null
                });
                var dropdownInstance = $dropdown.overlayScrollbars();
                $(window).on('keydown.dropdownListener', function (event) {
                    if (event.keyCode === 40 || event.keyCode === 38) {
                        dropdownInstance.scroll({ el: $dropdown.find('.option.active, .create'), axis: 'y', margin : 5  }, 100);
                    }
                });
            },
            onDropdownClose: function ($dropdown) {
                $(window).off('keydown.dropdownListener');
            },
            onItemAdd: function (value, $item) {
                if (this.options[value].optgroup) {
                    $item.closest('form').submit();
                }
                $(document).on('keydown.searchEnter', function(e) {
                    if (e.keyCode == 13) {
                        $item.closest('form').submit();
                    }
                });
            }
        });

        var searchAction = searchSelect.attr('data-action');

        var searchSelectize = searchSelect.selectize()[0].selectize;
        var searchInput = $('#js-searchSelect-selectized');

        var searhTimeOut = setTimeout(function(){},0);
        searchInput.on('keyup',function(){

            var thisInput = $(this);

            clearTimeout(searhTimeOut);

            searhTimeOut = setTimeout(function(){
                var thisVal = thisInput.val();
                if (thisVal.length>2) {

                    var formData = {
                      search : thisVal
                    };

                    $.ajax({
                        url: searchAction,
                        method: "POST",
                        data: formData,
                        dataType: 'json',
                        success: function (response) {

                            searchSelectize.clearOptions();

                            var searchGroup = 'Быстрые ссылки';

                            var ajaxItems = [];

                            var responseLength = Object.keys(response).length;

                            $.each(response, function (key, val) {
                                var searchName = key;
                                var searchValue = val.length ? val : key;

                                ajaxItems.push({optgroup:searchGroup,name:searchName,value:searchValue});

                                var itemIndex = Object.keys(response).indexOf(key);

                                if (responseLength-1 === itemIndex) {
                                    searchSelectize.addOption(ajaxItems);
                                    setTimeout(function() {
                                        searchSelectize.refreshOptions();
                                        var activeOption = searchSelectize.$dropdown.find('.option.active');
                                        var createOption = searchSelectize.$dropdown.find('.create');
                                        if (activeOption.length) activeOption.removeClass('active');
                                        if (createOption.length)  createOption.addClass('active');
                                    }, 0);
                                }

                            });

                        },
                        error: function () {}
                    });

                }

            }, 300);
        });

        var searchSubmit = $('#js-searchSubmit');

        searchSubmit.on('click', function() {
            if (searchSelect.val().length > 0) {
                search.submit();
                search.submit();
            }
        });



        var searchBtn = $('#js-searchBtn');
        searchBtn.on('click', function() {
            search.addClass('search--active');
            var searchInput = search.find('#js-searchSelect-selectized');
            if (searchInput.length) searchInput.focus();
        });

        var searchClose = $('#js-searchClose');
        searchClose.on('click', function() {
            search.removeClass('search--active');
        });
    }



    var orderScroll = $('#js-page-header__order-wrapping');
    if (orderScroll.length) {
        orderScroll.overlayScrollbars({
            overflowBehavior: {
                x: "hidden",
                y: "scroll"
            }
        });
    }



    var rowScroll = $('#js-mainRow');
    if (rowScroll.length) {
      rowScroll.overlayScrollbars({
        overflowBehavior: {
            x: "scroll",
            y: "hidden"
        },
        className: null,
        callbacks: {
          onInitialized: function () {
            var tabsContainer = rowScroll.find('.os-viewport');

            var x,left,down;

            tabsContainer.mousedown(function(e){
              e.preventDefault();
              down=true;
              x=e.pageX;
              left=$(this).scrollLeft();
            });

            tabsContainer.mousemove(function(e){
              if(down){
                var newX=e.pageX;
                tabsContainer.scrollLeft(left-newX+x);
                if (Math.abs(newX-x) > 5) {
                  tabsContainer.on('click.prevent',function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    tabsContainer.off('click.prevent');
                  });
                }
              }
            });
            tabsContainer.mouseup(function(e){down=false;});
            tabsContainer.mouseout(function(e){down=false;});
          }
        }
      });
    }

    var marksScroll = $('#js-marksWrap');
    if (marksScroll.length) {
        marksScroll.overlayScrollbars({
            overflowBehavior: {
                x: "scroll",
                y: "hidden"
            },
            className: null,
            callbacks: {
              onInitialized: function () {
                var tabsContainer = marksScroll.find('.os-viewport');

                var x,left,down;

                tabsContainer.mousedown(function(e){
                  e.preventDefault();
                  down=true;
                  x=e.pageX;
                  left=$(this).scrollLeft();
                });

                tabsContainer.mousemove(function(e){
                  if(down){
                    var newX=e.pageX;
                    tabsContainer.scrollLeft(left-newX+x);
                    if (Math.abs(newX-x) > 5) {
                      tabsContainer.on('click.prevent',function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        tabsContainer.off('click.prevent');
                      });
                    }
                  }
                });
                tabsContainer.mouseup(function(e){down=false;});
                tabsContainer.mouseout(function(e){down=false;});
              }
            }
        });
    }

    var aboutScroll = $('#js-about-us__wrapping');
    if (aboutScroll.length) {
        aboutScroll.overlayScrollbars({
            overflowBehavior: {
                x: "scroll",
                y: "hidden"
            },
            className: null
        });
    }

    var certificateWrap = $('.certificate__wrap');
    if (certificateWrap.length) {
        certificateWrap.magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
                titleSrc: function(item) {
                    return item.el.attr('title') + '<small>31.05.2018</small>';
                }
            }
        });
    }


  var trashComment = $('#js-trashComment');
  var commentDel = $('#js-comment-del');
  if (trashComment.length) {
    trashComment.on('input', function (){
          var thisVal=$(this).val();
          if (thisVal.length > 0) {
            commentDel.addClass('trash__comment-del--active');
          }
          else {
            commentDel.removeClass('trash__comment-del--active');
          }
        }
    );
    commentDel.on('click', function () {
      trashComment.val('');
      commentDel.removeClass('trash__comment-del--active');
    });
  }



  var faqForm = $('#js-faqForm');
  if (faqForm.length) {
    faqForm.validate({
      errorPlacement: function(error,element) {
        return true;
      },
      errorElement: 'span',
      rules: {
        name: {
          required: true
        },
        email: {
          email: true,
          required: true
        },
        message: {
          required: true
        }
      },
      submitHandler: function(form) {
        grecaptcha.execute();
      }
    });
  }

  var marks = $('#js-marks');
  if (marks.length) {
    marks.slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      variableWidth: true
  
    });
  }

  $(document).off('click.stepperUp').on('click.stepperUp','.js-stepperUp', function(event) {
    var stepper = $(event.target).closest('.js-stepper');
    var input = stepper.find('.js-stepperInput');
    input.val(+input.val()+1);
    input.trigger('change');
  });
  $(document).off('click.stepperDown').on('click.stepperDown','.js-stepperDown', function(event) {
    var stepper = $(event.target).closest('.js-stepper');
    var input = stepper.find('.js-stepperInput');
    if (+input.val()>=2) {
      input.val(+input.val()-1);
    } else {
      input.val('');
    }
    input.trigger('change');
  });

  function phoneSymbols(el) {

		el.on("change keyup input click", function(){
			if(this.value.match(/[^A-Za-z\d\+\(\)-\s]/g)){
				this.value = this.value.replace(/[^A-Za-z\d\+\(\)-\s]/g, "");
			}
		});
	
		return false;
	}

	function onlyNumbers(el) {

		el.on("change keyup input click", function(){
			if(this.value.match(/[^\d]/g)){
				this.value = this.value.replace(/[^\d]/g, "");
			}
		});
	
		return false;
	}

	function onlyLetters(el) {

		el.on("change keyup input click", function(){
			if(this.value.match(/[^A-Za-zА-Яа-я-\s]/g)){
				this.value = this.value.replace(/[^A-Za-z-\s]/g, "");
			}
		});
	
		return false;
	}

	var textInput = $('.js-text-input');
	if (textInput.length) {
		onlyLetters(textInput);
	}

	var numericInput = $('.js-numeric-input');
	if (numericInput.length) {
		onlyNumbers(numericInput);
  }
  
  var stepperInput = $('.js-stepperInput');
  if (stepperInput.length) {
		onlyNumbers(stepperInput);
  }

	var phoneInput = $('.js-phone-input');
	if (phoneInput.length) {
		phoneSymbols(phoneInput);
  }

  var productPopUpClose = $('#js-productPopUpClose');
  var productPopUp = $('#js-mainProduct-popUp');
  var productPopUpContinue = $('#js-productPopUpContinue');
  productPopUpClose.on('click', function () {
    productPopUp.removeClass('product-pop-up--active');
  });

  productPopUpContinue.on('click', function () {
    productPopUp.removeClass('product-pop-up--active');
  });


  var popUpSend = $('.popUp-send');
  var popUpConfirm = $('.popUp-confirm');

  var popUpSendDel = $('.popUp-send__del');
  var popUpConfirmDel = $('.popUp-confirm__del');
  var popUpConfirmBtn = $('.popUp-confirm__btn');

  popUpSendDel.on('click', function (event) {
    event.preventDefault();
    popUpSend.removeClass('popUp-send--active');
    body.removeClass('overflow');
  });
  popUpConfirmDel.on('click', function () {
    popUpConfirm.removeClass('popUp-confirm--active');
    body.removeClass('overflow');
  });
  popUpConfirmBtn.on('click', function () {
    popUpConfirm.removeClass('popUp-confirm--active');
    body.removeClass('overflow');
  });


  var popUpPrint = $('.popUp-print');
  var popUpPrintDel = $('.popUp-print__del');
  var popUpPrintBtn = $('.popUp-print__btn');

  popUpPrintDel.on('click', function () {
    popUpPrint.removeClass('popUp-print--active');
    body.removeClass('overflow');
  });
  popUpPrintBtn.on('click', function () {
    popUpPrint.removeClass('popUp-print--active');
    body.removeClass('overflow');
  });


    var menuTitle = $('.js-menuTitle');
    var menuList = $('.js-menuList');
    menuTitle.on('click', function (event) {
        $(this).toggleClass('menu__title--active');
        menuList.toggleClass('menu__list--active');
    });


})();
