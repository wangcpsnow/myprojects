var vm,
	mixin = {},
	vm_data = {
		'orders': {},
		'coupons': {},
		'add_coupons': {},
		'add_products': {},
		'products': {},
		'shop': {}
	};

(function () {
	'use strict';
	var cache = {},
		
		// Dom
		$body,
		$container,
		$navi,
		$content,
		$mask,
		$weuiActionsheet,

		// Variables
		fadeSeed = 300,
		
		// State
		currentItem = '',
		useCache = true, // SVG Caches
		isHome = false,
		isMoblie,
		has_editCoupons = false,
		isAnimate = false,
		isAjax = false;

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	var current_date = yyyy + '-' + mm + '-' + dd


	// Events
	var events = $({});

	$.subscribe = function() {
		events.on.apply(events, arguments);
	};

	$.unsubscribe = function() {
		events.off.apply(events, arguments);
	};

	$.publish = function() {
		events.trigger.apply(events, arguments);
	};

	function get(url, cb) {
		if (cache[url]) return cb(cache[url]);
		$.ajax({
			url: url,
			success: function(data) {
				cache[url] = data;
				cb(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown);
			},
			dataType: 'text'
		});
	}

	function hanadle() {
		isHome = $body.hasClass('home');
		
		if ($body.find('.js-validate').length !== 0) {
			validates($body.find('.js-validate'));
		}

		if ($body.find('.js-swiped').length !== 0) {
			swiped();
		}


		if ($body.find('.js-swiped-2').length !== 0) {
			swipedTwo();
		}
		
		
		if ($body.find('.js-svg').length !== 0) {
			svg($body.find('.js-svg'));
		}
		
		mixin = {
			methods: {
				removeConfirm: function (orders, order, event) {
					order.has_confirm = true;
					
					var $currentItem = $(event.target).parents('.ui-cell').find('.price');
					var $ele = $('#js-price-pos');
					
					var temp = $('<div class="temp-price price"><span>￥</span>'+ order.price +'<div>').css({
						top: $currentItem.offset().top - window.scrollY,
						left: $currentItem.offset().left
					});

					$body.append(temp);

					temp.addClass('move').css({
						top: $ele.offset().top  - window.scrollY,
						left: $ele.offset().left,
						fontSize: 10,
						opacity: 0
					});
					
					setTimeout(function () {
					
						var total_price = 0;
						for (var i = 0; i < orders.list.length; i++) {
							if (orders.list[i].has_confirm) {
								total_price = (total_price + orders.list[i].price);
							}
						}
						
						orders.total_price = total_price;
						temp.remove();
					}, 1000);
					
					setTimeout(function () {
						swiped();
					}, 300);
					
				},
				
				addConfirm: function (orders, order, event) {
					order.has_confirm = false;
					
					var total_price = 0;
					for (var i = 0; i < orders.list.length; i++) {
						if (orders.list[i].has_confirm) {
							total_price = (total_price + orders.list[i].price);
						}
					}
					orders.total_price = total_price;

				},
				
				removeOrder: function (event, orders, order) {
					removeItem($(event.target));
					// orders.list.$remove(order);
			
					if (order.has_confirm) {
						orders.total_price = (orders.total_price - order.price);
					}
				},
				
				closeOrder: function (event, orders, order) {
					order.has_closed = true;
					setTimeout(function () {
						swiped();
					}, 300);
					
				},
				
				updateCart: function (event, cart, product, type) {
					if (type === 'add') {
						if (product.count >= product.total) {
							$.alert('商品：' + product.title + '的最大可用数为' + product.total, '无法加入购物车');
						} else {
						
						
							var $currentItem = $(event.target).parents('.ui-cell').find('.price');
							var $ele = $('#js-open-cart');
							
							var temp = $('<div class="temp-price price"><span>￥</span>'+ product.price +'<div>').css({
								top: $currentItem.offset().top - window.scrollY,
								left: $currentItem.offset().left
							});

							$body.append(temp);
							temp.addClass('move').css({
								top: $ele.offset().top - window.scrollY,
								left: $ele.offset().left,
								fontSize: 10,
								opacity: 0
							});
							
							setTimeout(function () {
								doAnim($ele, 'bounceIn');
								temp.remove();
							}, 1000);

							product.count = (product.count + 1);
						}
						
					} else if (type === 'remove') {
						product.count = (product.count - 1);
					}
			
					var total_price = 0;
					var cart_products_count = 0;
					for (var i = 0; i < cart.products.length; i++) {
						if (cart.products[i].count > 0) {
							cart_products_count ++;
							total_price = (total_price + (cart.products[i].price * cart.products[i].count));
						}
					}
					
					cart.cart_products_count = cart_products_count;
					cart.total_price = total_price;
				},
				emptyCart: function (event, cart) {
					for (var i = 0; i < cart.products.length; i++) {
						if (cart.products[i].count > 0) {
							cart.products[i].count = 0;
						}
					}
					
					cart.cart_products_count = 0;
					cart.total_price = 0;
				},
				checkout: function (event, cart) {
					if (cart.cart_products_count === 0) {
						$.alert('请至少添加一个商品');

						event.preventDefault();
					}
				},
				removeCoupon: function (event, item) {
					removeItem($(event.target));
				},
				offline: function (event, item) {
					if (item.has_offline) {
						item.has_offline = false;
					} else {
						item.has_offline = true;
					}
					
					$(event.target).parents('.ui-cell').find('.item').removeAttr('style');

					setTimeout(function () {
						swipedTwo();
					}, 300);
				},
				editCoupons: function (event, item, index) {
					has_editCoupons = true;
					currentItem = index;

					$('#js_coupon_name').val(item.title);
					$('#js_coupon_price').val(item.price);
					$('#js_end_date').val(item.time);
					$('#js_coupon_code').val(item.code);
					$('#js_start_date').val(item.start_date);


					$('#js_name').val(item.title);
					$('#js_price').val(item.price);
					$('#js_start_time').val(item.start_time);
					$('#js_end_time').val(item.end_time);

					$('.js-next-button').html('保存修改');
				}
			}
		}
		
		vm = new Vue({
			el: '#wrap',
			mixins: [mixin],
			data: vm_data,
			methods: {
				loadMore: function(data) {
					if (data.current_page < data.total_page) {
						this.busy = true;
						$.showLoading("Loading...");

						setTimeout(() => {
							$.hideLoading();
							
							data.current_page = (data.current_page+1);

							
							this.busy = false;
						}, 1000);
					}
				}
			},
			directives: {
				svg:  {
					bind: function () {
						svg($(this.el));
					}
				},
				swiped: {
					bind: function () {
						setTimeout(function () {
							swiped();
							swipedTwo();
							swipedThree();
							swipedFour();
						}, 500);
						
					}
				}
			},
			ready: function () {
				setTimeout(function() {
					$.publish('vuejs.ready', true);
				}, 10);
			}
		});
		
		
		if ($('#js-cover').length !== 0) {
			var cover_page = 'cover_' + $('#js-cover').data('page');
			var cover_data = localStorage.getItem(cover_page);
			if (cover_data === null) {
				$('#js-cover').show();
				$('#js-cover').on('click touchstart', function (argument) {
					$(this).fadeOut(300);
					
					localStorage.setItem(cover_page, true);
					return false;
				});
			}
		}
		
		
		
		$(".js-datetime-picker").datetimePicker();
		
		$(".js-date-picker").datetimePicker({
			type : 'date',
			min: current_date
		});
		
		$(".js-time-picker").datetimePicker({
			type : 'time'
		});

		setTimeout(function() {
			$('.coupons-item').addClass('inited');
		}, 1200);
	}

	function init() {
		$body = $('body');
		$container = $('#wrap');
		$navi = $('#navi');
		$mask = $('#mask');
		$weuiActionsheet = $('#ui-actionsheet');

		$content = $body;
		isMoblie = _isMoblie();
		
		binedEvents();
		hanadle();
	}

	// Functions
	function _isMoblie(opts) {
		var userData = navigator.userAgent,
		opts = opts ? new RegExp(opts, 'i') : /iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle/i;
		return opts.test(userData);
	}

	function svg($svg) {
		$svg.each(function(){
			var $img = $(this);
			var imgID = $img.attr('id');
			var imgClass = $img.attr('class');
			var imgURL = $img.attr('src');

			if (localStorage.getItem(imgURL) !== null && useCache) {
				$svg = $(localStorage.getItem(imgURL));
				$img.replaceWith($svg);
			} else {
				$.get(imgURL, function(data) {
					var $svg = $(data).find('svg');
					if(typeof imgID !== 'undefined') {
						$svg = $svg.attr('id', imgID);
					}

					if(typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass+' replaced-svg');
					}

					$svg = $svg.removeAttr('xmlns:a');
					localStorage.setItem(imgURL, $('<div>').append($svg).html());
					$img.replaceWith($svg);

				}, 'xml');
			}
		});
	}

	function swiped() {
		Swiped.init({
			query: '.js-swiped .item',
			list: true,
			right: 80
		});
	}
	
	function swipedTwo() {
		Swiped.init({
			query: '.js-swiped-2 .item',
			list: true,
			right: 210
		});
	}
	
	function swipedThree() {
		Swiped.init({
			query: '.js-swiped-3 .item',
			list: true,
			right: 125
		});
	}
	
	function swipedFour() {
		Swiped.init({
			query: '.js-swiped-4 .item',
			list: true,
			right: 140
		});
	}
	
	function validates($form) {
		var $phone,
			checkPhone = false;
			
		if ($form.data('checkPhone')) {
			checkPhone = true;
			$phone = $('#js-phone');
		}
	
		var	unhighlight = function (label, element) {
				$(element).closest('.form-item').removeClass('has-error');
			},

			success = function (label, element, aa) {
				label.addClass('help-block valid');
				$(element).closest('.form-item').removeClass('has-error').addClass('has-success');
			},
			
			highlight = function (element) {
				$(element).closest('.help-block').removeClass('valid');
				$(element).closest('.form-item').removeClass('has-success').addClass('has-error');
			},
			onkeyup = function( element, event ) {
				if ( event.which === 9 && this.elementValue(element) === "" ) {
					return;
				} else if ( element.name in this.submitted || element === this.lastElement ) {
					this.element(element);
				}

				this.checkForm();

				if (this.valid()) {
					$form.addClass('is_ok');
				} else {
					$form.removeClass('is_ok');
				}
				
				if (checkPhone) {
					if ($phone.attr('aria-invalid') === 'false') {
						$form.addClass('is_phone_ok');
					} else {
						$form.removeClass('is_phone_ok');
					}
				}
			},
			onclick = function( element ) {
				if ( element.name in this.submitted ) {
					this.element(element);
				} else if ( element.parentNode.name in this.submitted ) {
					this.element(element.parentNode);
				}

				this.checkForm();

				if (this.valid()) {
					$form.addClass('is_ok');
				} else {
					$form.removeClass('is_ok');
				}
				
				if (checkPhone) {
					if ($phone.attr('aria-invalid') === 'false') {
						$form.addClass('is_phone_ok');
					} else {
						$form.removeClass('is_phone_ok');
					}
				}
			},
			errorPlacement = function(error, element) {
				$(element).parents('.form-item').append(error);
			},
			
			submitHandler = function(form, element) {
				// $(element).parents('.form-item').append(error);
				if ($(form).attr('action') === 'add_coupons') {
					if (has_editCoupons) {
						vm_data.add_coupons.list[currentItem].title = $('#js_coupon_name').val();
						vm_data.add_coupons.list[currentItem].price = $('#js_coupon_price').val();
						vm_data.add_coupons.list[currentItem].code = $('#js_coupon_code').val();
						vm_data.add_coupons.list[currentItem].time = $('#js_end_date').val();
						vm_data.add_coupons.list[currentItem].start_date = $('#js_start_date').val();
						
						has_editCoupons = false;
						$('.js-next-button').html('继续添加');
					} else {
						var item = {
							title: $('#js_coupon_name').val(),
							price: $('#js_coupon_price').val(),
							time: $('#js_end_date').val(),
							code: $('#js_coupon_code').val(),
							start_date: $('#js_start_date').val(),
							has_offline: true
						};
					
						vm_data.add_coupons.list.push(item);
					}
					
					$('#js_coupon_name').val('');
					$('#js_coupon_price').val('');
					$('#js_end_date').val('');
					$('#js_coupon_code').val('');
					$('#js_start_date').val('');
					
					setTimeout(function () {
						swiped();
					}, 500);
					return false;

				}

				else if ($(form).attr('action') === 'add_products') {
					if (has_editCoupons) {
						vm_data.add_products.list[currentItem].title = $('#js_name').val();
						vm_data.add_products.list[currentItem].price = $('#js_price').val();
						vm_data.add_products.list[currentItem].start_time = $('#js_start_time').val();
						vm_data.add_products.list[currentItem].end_time = $('#js_end_time').val();
						
						has_editCoupons = false;
						$('.js-next-button').html('继续添加');

					} else {
						var item = {
							title: $('#js_name').val(),
							price: $('#js_price').val(),
							start_time: $('#js_start_time').val(),
							end_time: $('#js_end_time').val(),
							has_offline: false
						};
					
						vm_data.add_products.list.push(item);
					}
					
					$('#js_name').val('');
					$('#js_price').val('');
					$('#js_start_time').val('');
					$('#js_end_time').val('');
					
					setTimeout(function () {
						swiped();
					}, 500);
					return false;
				} else {
					$.showLoading("正在提交...");
					
					setTimeout(function() {
						$.hideLoading();
						form.submit();
					}, 3000);
					
					return false;
				}
			};

		$form.each(function() {
			var $currentForm = $(this);
			var setting;

			if ($form.data('type') === 'inline') {
				setting = {
					errorClass: 'help-block',
					ignore: '',
					unhighlight: unhighlight,
					success: success,
					highlight: highlight,
					onkeyup: onkeyup,
					onclick: onclick,
					errorPlacement: errorPlacement,
					submitHandler: submitHandler
				};
			} else {
				setting = {
					// onkeyup: false,
					// onfocusout: false,
					errorLabelContainer: '#js-tooltips',
					wrapper: 'p',
					errorClass: 'help-block',
					ignore: '',
					highlight: function (element) {
						/*
						setTimeout(function () {
							$('#js-tooltips').fadeOut(300);
						}, 3000);
						*/
					},
					onkeyup: onkeyup,
					onclick: onclick
				};
			}


			$currentForm.validate(setting);
		});
	}
	
	function removeItem($e) {
		var $el = $e.parents('.js-remove-item');
		
		$.confirm('请确认是否删除', function() {
			//点击确认后的回调函数
			$el.slideUp(300, function() {
				$el.remove();
			});
		}, function() {
			//点击取消后的回调函数
		});
	}

	function openCart() {
		$weuiActionsheet.addClass('ui-actionsheet_toggle');
		$mask.show()
			.focus()
			.addClass('ui-fade_toggle').one('click', function () {
			hideActionSheet($weuiActionsheet, $mask);
		});
		
		$mask.one('click', function () {
			hideActionSheet($weuiActionsheet, $mask);
		});
		
		$mask.unbind('transitionend').unbind('webkitTransitionEnd');

		function hideActionSheet($weuiActionsheet, $mask) {
			$weuiActionsheet.removeClass('ui-actionsheet_toggle');
			$mask.removeClass('ui-fade_toggle');
			$mask.on('transitionend', function () {
				$mask.hide();
			}).on('webkitTransitionEnd', function () {
				$mask.hide();
			})
		}
	}

	function dragenter(t, $c) {
		var seed = 300;
		if (t === 'DOWN') {
			var $nextEle = $c.next();

			
			if (!isAnimate) {
				isAnimate = true;
				$nextEle.css('position', 'relative').animate({
					top: '-' + $c.outerHeight(true) + 'px'
				}, seed);

				$c.css('position', 'relative').animate({
					top: $nextEle.outerHeight(true)
				}, seed, function() {
					isAnimate = false;
					$nextEle.css({top: 'auto'}).after($c.css({top: 'auto'}));
				});
			}

		} 
		else if (t === 'UP') {
			var $nextEle = $c.prev();

			if (!isAnimate) {
				isAnimate = true;
				$nextEle.css('position', 'relative').animate({
					top: $c.outerHeight(true)
				}, seed);

				$c.css('position', 'relative').animate({
					top: '-' + $nextEle.outerHeight(true) + 'px'
				}, seed, function() {
					isAnimate = false;

					$nextEle.css({top: 'auto'}).before($c.css({top: 'auto'}));
				});
			}
		}
		else if (t === 'sticky') {
			if ($c.index() !== 0) {

				if (!isAnimate) {
					isAnimate = true;
					var t = $c.offset().top;
					var clone = $c.clone();

					$('#js-products').animate({
						paddingTop: $c.outerHeight(true) +'px'
					}, seed);

					$c.css('position', 'absolute').animate({
						marginTop: '-'+ t +'px'
					}, seed, function() {
						isAnimate = false;
						$('#js-products').css('padding-top', '0px').prepend(clone);
						$c.remove();

					});
				}
			}

		}
	}


	function doAnim(e, x) {
		e.addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass(x + ' animated');
		});
	}

	function binedEvents() {
		var end_date = current_date;
		$body
			.on('click touchstart', '.js-remove', function() {
				removeItem($(this));
			})
			.on('click touchstart', '#js-open-qrcode', function() {
				var title = $(this).data('title');
				var code = $(this).data('code');
				
				$.modal({
					title: '',
					className: 'qr-code-modal',
					text: '<div class="qr-code"><h2>'+title+'</h2><img class="qr" src="'+code+'"><img class="desc" src="images/qr-desc.jpg"></div>',
					buttons: [
						{ 
							text: '取消', 
							className: 'default' 
						},
					]
				});
			})
			.on('touchstart', '.js-disabled', function() {
				var $item = $(this).parents('.js-item');
				
				if ($item.hasClass('disabled')) {
					$item.removeClass('disabled');
				} else {
					$item.parents('.js-disabled-list').find('.disabled').removeClass('.disabled');
					$item.addClass('disabled');
				}
			})
			.on('click', '#js-open-cart', function () {
				openCart();
			})
			.on('change', '.js-date-picker-start', function () {
					var res = $(this).val().split('-');
					end_date = res[0] +'-'+ res[1] +'-'+ (Number(res[2])+1);
					$('.js-date-picker-end').attr('data-min-val', end_date);
					$('.js-date-picker-end-input').addClass('hide');

			})
			.on('click', '.js-date-picker-end-input', function () {
				if ($('.js-start-date').val() === '') {
					$(this).removeClass('hide');
					$.alert('请先设置开始时间。');
					return false;
				} else {
					$(this).addClass('hide');
				}
				/* else {
					$('.js-date-picker-end').datetimePicker({
						type : 'date',
						min: end_date
					});
					
					$(this).trigger('click');
				}*/
			})
			.on('click', '.js-submit-button', function () {
				/*
				var form = $(this).parents('form');
				if (form.valid()) {
					form.attr('action', 'ok');
				}
				*/

				window.location.href = 'admin-index.html';
				
				// window.h
			})
			.on('click touchstart', '.js-up', function () {
				var $e = $(this).parents('.ui-cell');
				dragenter('UP', $e);
			})
			.on('click touchstart', '.js-down', function () {
				var $e = $(this).parents('.ui-cell');
				dragenter('DOWN', $e);
			})
			.on('click touchstart', '.js-sticky', function () {
				var $e = $(this).parents('.ui-cell');
				dragenter('sticky', $e);
			})
			.on('touchstart', '#js-order', function () {
				if ($body.hasClass('in-order')) {
					$body.removeClass('in-order')
				} else {
					$body.addClass('in-order')
				}
			});

		if ($('#js-products').length !== 0) {
			dragula([$('#js-products').get(0)], {
					direction: 'vertical',
					moves: function (el, container, handle) {
						return handle.className === 'order-item';
					}
				})
				.on('drag', function (el) {
					// el.className = el.className.replace('ex-moved', '');
				})
				.on('drop', function (el) {
					// el.className += ' ex-moved';
				})
				.on('over', function (el, container) {
					// console.log('over');
					// container.className += ' ex-over';
				})
				.on('out', function (el, container) {
					console.log('update here.')
					// container.className = container.className.replace('ex-over', '');
				});
		}

	}
	
	$(document).ready(function () {
		init();
	});
}());

// Toto: move to libs.min.js
jQuery.validator.addMethod('stringCheck', function(value, element) {
	return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, '只能包括中文字，英文字母和数字'); 


jQuery.validator.addMethod('isMobile', function(value, element) {
	var length = value.length;
	var mobile = /^(((1[0-9]{2})|(15[0-9]{1}))+\d{8})$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, '请正确填写您的手机号码');

jQuery.validator.addMethod('isTel', function(value, element) {
	//e.g. 010-12345678
	var tel = /^\d{3,4}-\d{7,8}$/;
	return this.optional(element) || (tel.test(value));
}, '请正确填写您的电话号码');


jQuery.validator.addMethod('isPhone', function(value,element) {
	// Mobile + Tel
	var length = value.length;
	var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/;
	var tel = /^\d{3,4}-\d{7,8}$/;
	
	return this.optional(element) || (tel.test(value) || mobile.test(value));
}, '请正确填写您的联系电话');



/* global $:true */
/* jshint unused:false*/

+ function($) {
  "use strict";


  var defaults;

  var Datetime = function(input, params) {
			this.input = $(input);
			this.params = params;

			this.initMonthes = ('01 02 03 04 05 06 07 08 09 10 11 12').split(' ');

			this.initYears = (function () {
			  var arr = [];
			  for (var i = 1970; i <= 2030; i++) { arr.push(i); }
			  return arr;
			})();

			var p = $.extend({}, this.getConfig());
			$(this.input).picker(p);
  }

  Datetime.prototype = {
			getDays : function(max) {
			  var days = [];
			  for(var i=1; i<= (max||31);i++) {
						days.push(i < 10 ? "0"+i : i);
			  }
			  return days;
			},

			getDaysByMonthAndYear : function(month, year) {
			  var int_d = new Date(year, parseInt(month)+1-1, 1);
			  var d = new Date(int_d - 1);
			  return this.getDays(d.getDate());
			},

			formatNumber : function (n) {
			  return n < 10 ? "0" + n : n;
			},

			formatValue : function(values, displayValues) {
			  var params = this.params;
			  
			  if (params.type === 'time') {
						var d = values[0] + params.timeSplit + values[1];
			  } 
			  else if (params.type === 'date') {
						var d = values[0] + params.dateSplit + values[1] + params.dateSplit + values[2];
			  } 
			  else {
						var d = values[0] + params.dateSplit + values[1] + params.dateSplit + values[2] + params.dateTimeSplit + values[3] + params.timeSplit + values[4];
			  }
			  
			  return d;
			},
			stringToArray: function(value) {
			  var params = this.params;
			  var tokens = value.split(params.dateTimeSplit);
			  var date = tokens[0],
						  time = tokens[1];
			  return [].concat(date.split(params.dateSplit), time ? time.split(params.timeSplit) : []);
			},
			arrayToDate: function(arr) {
			  var params = this.params;
			  if(arr.length === 3) return new Date(arr.join(params.dateSplit));
			  var date = new Date(arr.slice(0, 3).join(params.dateSplit));
			  //注意这种格式 "2012-12-12 12:12" 在ios上是错误的，如果用 "2012-12-12T12:12" 是对的，但是这个是标准时区而不是东八区，所以这里分别设置
			  date.setHours(arr[3]);
			  date.setMinutes(arr[4]);

			  return date;
			},
			getConfig : function() {

			  var today = new Date(),
						  params = this.params,
						  self = this,
						  lastValidValues;

			  if (params.type === 'time') {
						  var cols = [
									// Hours
									{
									  values: (function () {
												var arr = [];
												for (var i = 0; i <= 23; i++) { arr.push(self.formatNumber(i)); }
												return arr;
									  })(),
									},
									// Divider
									{
									  divider: true,
									  content: ':'
									},
									// Minutes
									{
									  values: (function () {
												var arr = [];
												for (var i = 0; i <= 59; i++) { arr.push(self.formatNumber(i)); }
												return arr;
									  })(),
									}
						  ];
			  }
			  else if (params.type === 'date') {
						  var cols = [
									// Years
									{
									  values: self.initYears
									},
									// Months
									{
									  values: self.initMonthes
									},
									// Days
									{
									  values: self.getDays()
									}
						  ];
			  } 
			  else {
						  var cols = [
									// Years
									{
									  values: self.initYears
									},
									// Months
									{
									  values: self.initMonthes
									},
									// Days
									{
									  values: self.getDays()
									},

									// Space divider
									{
									  divider: true,
									  content: '  '
									},
									// Hours
									{
									  values: (function () {
												var arr = [];
												for (var i = 0; i <= 23; i++) { arr.push(self.formatNumber(i)); }
												return arr;
									  })(),
									},
									// Divider
									{
									  divider: true,
									  content: ':'
									},
									// Minutes
									{
									  values: (function () {
												var arr = [];
												for (var i = 0; i <= 59; i++) { arr.push(self.formatNumber(i)); }
												return arr;
									  })(),
									}
						  ];
			  }

			  var config = {
						rotateEffect: false,  //为了性能

						value: [
						  today.getFullYear(), 
						  this.formatNumber(today.getMonth()+1), 
						  this.formatNumber(today.getDate()), 
						  this.formatNumber(today.getHours()), 
						  this.formatNumber(today.getMinutes())
						],

						onChange: function (picker, values, displayValues) {
						  var cols = picker.cols;
						  var days = self.getDaysByMonthAndYear(cols[1].value, cols[0].value);
						  var currentValue = picker.cols[2].value;
						  if(currentValue > days.length) {
			currentValue = days.length;
						  } 
		  picker.cols[2].setValue(currentValue);

		 var minVal = $(this.input).attr('data-min-val');
						  //check min and max
						  
						  // console.log(lastValidValues)

						  var current = self.arrayToDate(values);
						  var valid = true;
						  if(params.min) {
									// var min = self.arrayToDate(self.stringToArray(typeof params.min === "function" ? params.min() : params.min));
									// console.log(min)
									// console.log(current)
									var d = '';

									if (typeof minVal !== 'undefined') {
										 d = minVal;
									} else {
										d = params.min;
									}

									// console.log(d);
									

									// console.log(typeof params.min)
									
									var min = self.arrayToDate(self.stringToArray(typeof params.min === "function" ? params.min() : d));

									if(current < +min && typeof lastValidValues !== 'undefined') {
									  // console.log(lastValidValues);
									  picker.setValue(lastValidValues);
									  valid = false;
									} 
						  }

						  if(params.max) {
									var max = self.arrayToDate(self.stringToArray(typeof params.max === "function" ? params.max() : params.max));
									if(current > +max) {
									  picker.setValue(lastValidValues);
									  valid = false;
									} 
						  }

						  valid && (lastValidValues = values);
						},

						formatValue: function (p, values, displayValues) {
						  return self.formatValue(values, displayValues);
						},

						cols: cols
			  };

			  var inputValue = this.input.val();
			  if(inputValue) config.value = this.stringToArray(inputValue);

			  
			  return config;
			}
  }

  $.fn.datetimePicker = function(params) {
			params = $.extend({}, defaults, params);
			return this.each(function() {
			  if(!this) return;
			  var $this = $(this);
			  var datetime = $this.data("datetime");
			  if(!datetime) $this.data("datetime", new Datetime(this, params));
			  return datetime;
			});
  };

  defaults = $.fn.datetimePicker.prototype.defaults = {
			dateSplit: "-",
			timeSplit: ":",
			dateTimeSplit: " ",
			type: 'datetime',
			min: undefined,
			max: undefined
  }

}($);



/*======================================================
************   Picker   ************
======================================================*/
/* global $:true */
/* jshint unused:false */
/* jshint multistr:true */
+ function($) {
  "use strict";
  var Picker = function (params) {
			  var p = this;
			  var defaults = {
						  updateValuesOnMomentum: false,
						  updateValuesOnTouchmove: true,
						  rotateEffect: false,
						  momentumRatio: 7,
						  freeMode: false,
						  // Common settings
						  scrollToInput: true,
						  inputReadOnly: true,
						  toolbar: true,
						  toolbarCloseText: '完成',
						  title: '请选择',
						  toolbarTemplate: '<div class="toolbar">\
						  <div class="toolbar-inner">\
						  <a href="javascript:;" class="picker-button close-picker">{{closeText}}</a>\
						  <h1 class="title">{{title}}</h1>\
						  </div>\
						  </div>',
			  };
			  params = params || {};
			  for (var def in defaults) {
						  if (typeof params[def] === 'undefined') {
									  params[def] = defaults[def];
						  }
			  }
			  p.params = params;
			  p.cols = [];
			  p.initialized = false;
			  
			  
			  // console.log(p.params)
			  // Inline flag
			  p.inline = p.params.container ? true : false;

			  // 3D Transforms origin bug, only on safari
			  var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

			  // Should be converted to popover
			  function isPopover() {
						  var toPopover = false;
						  if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
						  if (!p.inline && p.params.input) {
									  if (p.params.onlyInPopover) toPopover = true;
									  else {
												  if ($.device.ios) {
															  toPopover = $.device.ipad ? true : false;
												  }
												  else {
															  if ($(window).width() >= 768) toPopover = true;
												  }
									  }
						  } 
						  return toPopover; 
			  }
			  function inPopover() {
						  if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;
						  else return false;
			  }

			  // Value
			  p.setValue = function (arrValues, transition) {
						  var valueIndex = 0;
						  for (var i = 0; i < p.cols.length; i++) {
									  if (p.cols[i] && !p.cols[i].divider) {
												  p.cols[i].setValue(arrValues[valueIndex], transition);
												  valueIndex++;
									  }
						  }
			  };
			  p.updateValue = function () {
						  var newValue = [];
						  var newDisplayValue = [];
						  for (var i = 0; i < p.cols.length; i++) {
									  if (!p.cols[i].divider) {
												  newValue.push(p.cols[i].value);
												  newDisplayValue.push(p.cols[i].displayValue);
									  }
						  }
						  if (newValue.indexOf(undefined) >= 0) {
									  return;
						  }
						  p.value = newValue;
						  p.displayValue = newDisplayValue;
						  if (p.params.onChange) {
									  p.params.onChange(p, p.value, p.displayValue);
						  }
						  if (p.input && p.input.length > 0) {
									  $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
									  $(p.input).trigger('change');
						  }
			  };

			  // Columns Handlers
			  p.initPickerCol = function (colElement, updateItems) {
						  var colContainer = $(colElement);
						  var colIndex = colContainer.index();
						  var col = p.cols[colIndex];
						  if (col.divider) return;
						  col.container = colContainer;
						  col.wrapper = col.container.find('.picker-items-col-wrapper');
						  col.items = col.wrapper.find('.picker-item');
						  
						  var i, j;
						  var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
						  col.replaceValues = function (values, displayValues) {
									  col.destroyEvents();
									  col.values = values;
									  col.displayValues = displayValues;
									  var newItemsHTML = p.columnHTML(col, true);
									  col.wrapper.html(newItemsHTML);
									  col.items = col.wrapper.find('.picker-item');
									  col.calcSize();
									  col.setValue(col.values[0], 0, true);
									  col.initEvents();
						  };
						  col.calcSize = function () {
									  if (p.params.rotateEffect) {
												  col.container.removeClass('picker-items-col-absolute');
												  if (!col.width) col.container.css({width:''});
									  }
									  var colWidth, colHeight;
									  colWidth = 0;
									  colHeight = col.container[0].offsetHeight;
									  wrapperHeight = col.wrapper[0].offsetHeight;
									  itemHeight = col.items[0].offsetHeight;
									  itemsHeight = itemHeight * col.items.length;
									  minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
									  maxTranslate = colHeight / 2 - itemHeight / 2;			
									  if (col.width) {
												  colWidth = col.width;
												  if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
												  col.container.css({width: colWidth});
									  }
									  if (p.params.rotateEffect) {
												  if (!col.width) {
															  col.items.each(function () {
																		  var item = $(this);
																		  item.css({width:'auto'});
																		  colWidth = Math.max(colWidth, item[0].offsetWidth);
																		  item.css({width:''});
															  });
															  col.container.css({width: (colWidth + 2) + 'px'});
												  }
												  col.container.addClass('picker-items-col-absolute');
									  }
						  };
						  col.calcSize();
						  
						  col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


						  var activeIndex = 0;
						  var animationFrameId;

						  // Set Value Function
						  col.setValue = function (newValue, transition, valueCallbacks) {
									  if (typeof transition === 'undefined') transition = '';
									  var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
									  if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
												  return;
									  }
									  var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
									  // Update wrapper
									  col.wrapper.transition(transition);
									  col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');
												  
									  // Watch items
									  if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
												  $.cancelAnimationFrame(animationFrameId);
												  col.wrapper.transitionEnd(function(){
															  $.cancelAnimationFrame(animationFrameId);
												  });
												  updateDuringScroll();
									  }

									  // Update items
									  col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
						  };

						  col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
									  if (typeof translate === 'undefined') {
												  translate = $.getTranslate(col.wrapper[0], 'y');
									  }
									  if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
									  if (activeIndex < 0) activeIndex = 0;
									  if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
									  var previousActiveIndex = col.activeIndex;
									  col.activeIndex = activeIndex;
									  /*
									  col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

									  col.items.transition(transition);
									  var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
									  var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
									  var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
									  */
									  //去掉 .picker-after-selected, .picker-before-selected 以提高性能
									  col.wrapper.find('.picker-selected').removeClass('picker-selected');
									  if (p.params.rotateEffect) {
												col.items.transition(transition);
									  }
									  var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

									  if (valueCallbacks || typeof valueCallbacks === 'undefined') {
												  // Update values
												  col.value = selectedItem.attr('data-picker-value');
												  col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
												  // On change callback
												  if (previousActiveIndex !== activeIndex) {
															  if (col.onChange) {
																		  col.onChange(p, col.value, col.displayValue);
															  }
															  p.updateValue();
												  }
									  }
												  
									  // Set 3D rotate effect
									  if (!p.params.rotateEffect) {
												  return;
									  }
									  var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;
									  
									  col.items.each(function () {
												  var item = $(this);
												  var itemOffsetTop = item.index() * itemHeight;
												  var translateOffset = maxTranslate - translate;
												  var itemOffset = itemOffsetTop - translateOffset;
												  var percentage = itemOffset / itemHeight;

												  var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;
												  
												  var angle = (-18*percentage);
												  if (angle > 180) angle = 180;
												  if (angle < -180) angle = -180;
												  // Far class
												  if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
												  else item.removeClass('picker-item-far');
												  // Set transform
												  item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
									  });
						  };

						  function updateDuringScroll() {
									  animationFrameId = $.requestAnimationFrame(function () {
												  col.updateItems(undefined, undefined, 0);
												  updateDuringScroll();
									  });
						  }

						  // Update items on init
						  if (updateItems) col.updateItems(0, maxTranslate, 0);

						  var allowItemClick = true;
						  var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
						  function handleTouchStart (e) {
									  if (isMoved || isTouched) return;
									  e.preventDefault();
									  isTouched = true;
									  var position = $.getTouchPosition(e);
									  touchStartY = touchCurrentY = position.y;
									  touchStartTime = (new Date()).getTime();
									  
									  allowItemClick = true;
									  startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
						  }
						  function handleTouchMove (e) {
									  if (!isTouched) return;
									  e.preventDefault();
									  allowItemClick = false;
									  var position = $.getTouchPosition(e);
									  touchCurrentY = position.y;
									  if (!isMoved) {
												  // First move
												  $.cancelAnimationFrame(animationFrameId);
												  isMoved = true;
												  startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
												  col.wrapper.transition(0);
									  }
									  e.preventDefault();

									  var diff = touchCurrentY - touchStartY;
									  currentTranslate = startTranslate + diff;
									  returnTo = undefined;

									  // Normalize translate
									  if (currentTranslate < minTranslate) {
												  currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
												  returnTo = 'min';
									  }
									  if (currentTranslate > maxTranslate) {
												  currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
												  returnTo = 'max';
									  }
									  // Transform wrapper
									  col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

									  // Update items
									  col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);
									  
									  // Calc velocity
									  velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
									  velocityTime = (new Date()).getTime();
									  prevTranslate = currentTranslate;
						  }
						  function handleTouchEnd (e) {
									  if (!isTouched || !isMoved) {
												  isTouched = isMoved = false;
												  return;
									  }
									  isTouched = isMoved = false;
									  col.wrapper.transition('');
									  if (returnTo) {
												  if (returnTo === 'min') {
															  col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
												  }
												  else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
									  }
									  touchEndTime = new Date().getTime();
									  var velocity, newTranslate;
									  if (touchEndTime - touchStartTime > 300) {
												  newTranslate = currentTranslate;
									  }
									  else {
												  velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
												  newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
									  }

									  newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

									  // Active Index
									  var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

									  // Normalize translate
									  if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

									  // Transform wrapper
									  col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

									  // Update items
									  col.updateItems(activeIndex, newTranslate, '', true);

									  // Watch items
									  if (p.params.updateValuesOnMomentum) {
												  updateDuringScroll();
												  col.wrapper.transitionEnd(function(){
															  $.cancelAnimationFrame(animationFrameId);
												  });
									  }

									  // Allow click
									  setTimeout(function () {
												  allowItemClick = true;
									  }, 100);
						  }

						  function handleClick(e) {
									  if (!allowItemClick) return;
									  $.cancelAnimationFrame(animationFrameId);
									  /*jshint validthis:true */
									  var value = $(this).attr('data-picker-value');
									  col.setValue(value);
						  }

						  col.initEvents = function (detach) {
									  var method = detach ? 'off' : 'on';
									  col.container[method]($.touchEvents.start, handleTouchStart);
									  col.container[method]($.touchEvents.move, handleTouchMove);
									  col.container[method]($.touchEvents.end, handleTouchEnd);
									  col.items[method]('click', handleClick);
						  };
						  col.destroyEvents = function () {
									  col.initEvents(true);
						  };

						  col.container[0].f7DestroyPickerCol = function () {
									  col.destroyEvents();
						  };

						  col.initEvents();

			  };
			  p.destroyPickerCol = function (colContainer) {
						  colContainer = $(colContainer);
						  if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
			  };
			  // Resize cols
			  function resizeCols() {
						  if (!p.opened) return;
						  for (var i = 0; i < p.cols.length; i++) {
									  if (!p.cols[i].divider) {
												  p.cols[i].calcSize();
												  p.cols[i].setValue(p.cols[i].value, 0, false);
									  }
						  }
			  }
			  $(window).on('resize', resizeCols);

			  // HTML Layout
			  p.columnHTML = function (col, onlyItems) {
						  var columnItemsHTML = '';
						  var columnHTML = '';
						  if (col.divider) {
									  columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
						  }
						  else {
									  for (var j = 0; j < col.values.length; j++) {
												  columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
									  }
									  columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
						  }
						  return onlyItems ? columnItemsHTML : columnHTML;
			  };
			  p.layout = function () {
						  var pickerHTML = '';
						  var pickerClass = '';
						  var i;
						  p.cols = [];
						  var colsHTML = '';
						  for (i = 0; i < p.params.cols.length; i++) {
									  var col = p.params.cols[i];
									  colsHTML += p.columnHTML(p.params.cols[i]);
									  p.cols.push(col);
						  }
						  pickerClass = 'weui-picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
						  pickerHTML =
									  '<div class="' + (pickerClass) + '">' +
												  (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{title}}/g, p.params.title) : '') +
												  '<div class="picker-modal-inner picker-items">' +
															  colsHTML +
															  '<div class="picker-center-highlight"></div>' +
												  '</div>' +
									  '</div>';
									  
						  p.pickerHTML = pickerHTML;			
			  };

			  // Input Events
			  function openOnInput(e) {
						  e.preventDefault();
						  if (p.opened) return;
						  p.open();
						  if (p.params.scrollToInput && !isPopover()) {
									  var pageContent = p.input.parents('.content');
									  if (pageContent.length === 0) return;

									  var paddingTop = parseInt(pageContent.css('padding-top'), 10),
												  paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
												  pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
												  pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
												  newPaddingBottom;
									  var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
									  if (inputTop > pageHeight) {
												  var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
												  if (scrollTop + pageHeight > pageScrollHeight) {
															  newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
															  if (pageHeight === pageScrollHeight) {
																		  newPaddingBottom = p.container.height();
															  }
															  pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
												  }
												  pageContent.scrollTop(scrollTop, 300);
									  }
						  }
			  }
			  function closeOnHTMLClick(e) {
						  if (inPopover()) return;
						  if (p.input && p.input.length > 0) {
									  if (e.target !== p.input[0] && $(e.target).parents('.weui-picker-modal').length === 0) p.close();
						  }
						  else {
									  if ($(e.target).parents('.weui-picker-modal').length === 0) p.close();   
						  }
			  }

			  if (p.params.input) {
						  p.input = $(p.params.input);
						  if (p.input.length > 0) {
									  if (p.params.inputReadOnly) p.input.prop('readOnly', true);
									  if (!p.inline) {
												  p.input.on('click', openOnInput);			
									  }
									  if (p.params.inputReadOnly) {
												  p.input.on('focus mousedown', function (e) {
															  e.preventDefault();
												  });
									  }
						  }
									  
			  }
			  
			  if (!p.inline) $('html').on('click', closeOnHTMLClick);

			  // Open
			  function onPickerClose() {
						  p.opened = false;
						  if (p.input && p.input.length > 0) p.input.parents('.page-content').css({'padding-bottom': ''});
						  if (p.params.onClose) p.params.onClose(p);

						  // Destroy events
						  p.container.find('.picker-items-col').each(function () {
									  p.destroyPickerCol(this);
						  });
			  }

			  p.opened = false;
			  p.open = function () {
						  var toPopover = isPopover();



						  if (!p.opened) {

									  // Layout
									  p.layout();

									  // Append
									  if (toPopover) {
												  p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
												  p.popover = $.popover(p.pickerHTML, p.params.input, true);
												  p.container = $(p.popover).find('.weui-picker-modal');
												  $(p.popover).on('close', function () {
															  onPickerClose();
												  });
									  }
									  else if (p.inline) {
												  p.container = $(p.pickerHTML);
												  p.container.addClass('picker-modal-inline');
												  $(p.params.container).append(p.container);
									  }
									  else {
												  p.container = $($.openPicker(p.pickerHTML));
												  $(p.container)
												  .on('close', function () {
															  onPickerClose();
												  });
									  }

									  // Store picker instance
									  p.container[0].f7Picker = p;

									  // Init Events
									  p.container.find('.picker-items-col').each(function () {
												  var updateItems = true;
												  if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
												  p.initPickerCol(this, updateItems);
									  });
									  
									  // Set value
									  if (!p.initialized) {
												  if (p.params.value) {
															  p.setValue(p.params.value, 0);
												  }
									  }
									  else {
												  if (p.value) p.setValue(p.value, 0);
									  }
						  }

						  // Set flag
						  p.opened = true;
						  p.initialized = true;

						  if (p.params.onOpen) p.params.onOpen(p);

						  if ($(this.input).attr('data-min-val')) {
						  	this.value = ['2017','11','12'];
						  }

						  if (p.params.onOpen) p.params.onOpen(p);

						  if ($(this.input).attr('data-min-val')) {
						  	var res = $(this.input).attr('data-min-val').split('-');


						  	this.value = res;
						  	this.cols[0].setValue(res[0]);
						  	this.cols[1].setValue(res[1]);
						  	this.cols[2].setValue(res[2]);
						  }


			  };

			  // Close
			  p.close = function (force) {
						  if (!p.opened || p.inline) return;
						  if (inPopover()) {
									  $.closePicker(p.popover);
									  return;
						  }
						  else {
									  $.closePicker(p.container);
									  return;
						  }
			  };

			  // Destroy
			  p.destroy = function () {
						  p.close();
						  if (p.params.input && p.input.length > 0) {
									  p.input.off('click focus', openOnInput);
						  }
						  $('html').off('click', closeOnHTMLClick);
						  $(window).off('resize', resizeCols);
			  };

			  if (p.inline) {
						  p.open();
			  }

			  return p;
  };

  $(document).on("click", ".close-picker", function() {
			var pickerToClose = $('.weui-picker-modal.weui-picker-modal-visible');
			if (pickerToClose.length > 0) {
			  $.closePicker(pickerToClose);
			}
  });

  //修复picker会滚动页面的bug
  $(document).on($.touchEvents.move, ".picker-modal-inner", function(e) {
			e.preventDefault();
  });


  $.openPicker = function(tpl, className, callback) {

			if(typeof className === "function") {
			  callback = className;
			  className = undefined;
			}

			$.closePicker();

			var container = $("<div class='weui-picker-container "+ (className || "") + "'></div>").appendTo(document.body);
			container.show();

			container.addClass("weui-picker-container-visible");

			//关于布局的问题，如果直接放在body上，则做动画的时候会撑开body高度而导致滚动条变化。
			var dialog = $(tpl).appendTo(container);
			
			dialog.width(); //通过取一次CSS值，强制浏览器不能把上下两行代码合并执行，因为合并之后会导致无法出现动画。

			dialog.addClass("weui-picker-modal-visible");

			callback && container.on("close", callback);

			return dialog;
  }

  $.updatePicker = function(tpl) {
			var container = $(".weui-picker-container-visible");
			if(!container[0]) return false;

			container.html("");

			var dialog = $(tpl).appendTo(container);

			dialog.addClass("weui-picker-modal-visible");

			return dialog;
  }

  $.closePicker = function(container, callback) {
			if(typeof container === "function") callback = container;
			$(".weui-picker-modal-visible").removeClass("weui-picker-modal-visible").transitionEnd(function() {
			  $(this).parent().remove();
			  callback && callback();
			}).trigger("close");
			
			
			if (typeof $('.js-start-date') !== 'undefined' && $('.js-start-date').val() !== '' && $('.js-end-date').val() !== '') {
			  var start = Date.parse($('.js-start-date').val());
			  var end = Date.parse($('.js-end-date').val());
			  
			  if (start >= end) {
						$('.js-end-date').val('');
						$.alert('结束时间必须大于开始时间');
			  }
			}
			
			if (typeof $('.js-start-time') !== 'undefined' && $('.js-start-time').val() !== '' && $('.js-end-time').val() !== '') {
			  var start = Date.parse('2016-1-1 ' + $('.js-start-time').val());
			  var end = Date.parse('2016-1-1 ' + $('.js-end-time').val());
			  
			  if (start >= end) {
						$('.js-end-time').val('');
						$.alert('结束时间必须大于开始时间');
			  }
			}
  };

  $.fn.picker = function(params) {
			var args = arguments;
			return this.each(function() {
			  if(!this) return;
			  var $this = $(this);
			  
			  var picker = $this.data("picker");
			  if(!picker) {
						params = params || {};
						var inputValue = $this.val();
						if(params.value === undefined && inputValue !== "") {
						  params.value = params.cols.length > 1 ? inputValue.split(" ") : [inputValue];
						}
						var p = $.extend({input: this}, params);
						picker = new Picker(p);
						$this.data("picker", picker);
			  }
			  if(typeof params === typeof "a") {
						picker[params].apply(picker, Array.prototype.slice.call(args, 1));
			  }
			});
  };
}($);

(function() {
			var msPointer = window.navigator.msPointerEnabled;

			var touch = {
						start: msPointer ? 'MSPointerDown' : 'touchstart',
						move: msPointer ? 'MSPointerMove' : 'touchmove',
						end: msPointer ? 'MSPointerUp' : 'touchend'
			};

			var prefix = (function () {
						var styles = window.getComputedStyle(document.documentElement, '');
						var pre = (Array.prototype.slice
												.call(styles)
												.join('')
												.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
									)[1];

						return '-' + pre + '-';
			})();

			var transitionEvent = (function() {
						var t,
									el = document.createElement("fakeelement");

						var transitions = {
									"transition"			  : "transitionend",
									"OTransition"			 : "oTransitionEnd",
									"MozTransition"   : "transitionend",
									"WebkitTransition": "webkitTransitionEnd"
						};

						for (t in transitions){
									if (el.style[t] !== undefined){
												return transitions[t];
									}
						}
			})();

			var cssProps = {
						'transition': prefix + 'transition',
						'transform': prefix + 'transform'
			};

			function delegate(event, cbName) {
						document.addEventListener(event, function(e) {
									Swiped._elems.forEach(function(Swiped){
												var target = e.target;

												while (target) {
															if (target === Swiped.elem) {
																		Swiped[cbName](e);

																		return false;
															}
															target = target.parentNode;
												}

												return false;
									});

						});
			}

			function extend() {
						var current = [].shift.call(arguments);
						var options = arguments[0];

						for (var i in options) {
									if (options.hasOwnProperty(i)) {
												current[i] = options[i];
									}
						}

						return current;
			}

			var fn = function() {};

			var Swiped = function(o) {
						var defaultOptions = {
									duration: 200,
									tolerance: 50,
									time: 200,
									dir: 1,
									right: 0,
									left: 0
						};

						o = extend(defaultOptions, o || {});

						this.duration = o.duration;
						this.tolerance = o.tolerance;
						this.time = o.time;
						this.width = o.left || o.right;
						this.elem = o.elem;
						this.list = o.list;
						this.dir = o.dir;
						this.group = o.group;
						this.id = Swiped.elemId++;
						
						this.onOpen = typeof o.onOpen === 'function' ? o.onOpen : fn;
						this.onClose = typeof o.onClose === 'function' ? o.onClose : fn;

						this.right = o.right;
						this.left = o.left;

						if (
									(o.right > 0 && o.tolerance > o.right) ||
									(o.left > 0 && o.tolerance > o.left)
						) {
									console.warn('tolerance must be less then left and right');
						}
			};

			Swiped._elems = [];
			Swiped.groupCounter = 0;
			Swiped.elemId = 0;

			Swiped.init = function(o) {
						Swiped.groupCounter++;

						var elems = document.querySelectorAll(o.query);
						var group = [];

						delete o.query;

						[].forEach.call(elems, function(elem){
									var option = extend({elem: elem, group: Swiped.groupCounter}, o);

									group.push(new Swiped(option));
						});

						Swiped._bindEvents();
						Swiped._elems = Swiped._elems.concat(group);

						if (group.length === 1) {
									return group[0];
						}

						return group;
			};

			Swiped._closeAll = function(groupNumber) {
						Swiped._elems.forEach(function(Swiped) {
									if (Swiped.group === groupNumber) {
												Swiped.close(true);
									}
						});
			};

			Swiped.prototype.transitionEnd = function(node, cb) {
						var that = this;

						function trEnd() {
									cb.call(that);
									node.removeEventListener(transitionEvent, trEnd);
						}

						node.addEventListener(transitionEvent, trEnd);
			};

			/**
			 * swipe.x - initial coordinate Х
			 * swipe.y - initial coordinate Y
			 * swipe.delta - distance
			 * swipe.startSwipe - swipe is starting
			 * swipe.startScroll - scroll is starting
			 * swipe.startTime - necessary for the short swipe
			 * swipe.touchId - ID of the first touch
			 */

			Swiped.prototype.touchStart = function(e) {
						var touch = e.changedTouches[0];

						if (e.touches.length !== 1) {
									return;
						}

						this.touchId = touch.identifier;
						this.x = touch.pageX;
						this.y = touch.pageY;
						this.startTime = new Date();

						this.resetValue();

						if (this.list) {
									Swiped._closeAll(this.group);
						} else {
									this.close(true);
						}
			};

			Swiped.prototype.touchMove = function(e) {
						var touch = e.changedTouches[0];

						// touch of the other finger
						if (!this.isValidTouch(e)) {
									return;
						}

						this.delta = touch.pageX - this.x;

						this.dir = this.delta < 0 ? -1 : 1;
						this.width = this.delta < 0 ? this.right : this.left;

						this.defineUserAction(touch);

						if (this.startSwipe) {
									this.move();

									//prevent scroll
									e.preventDefault();
						}
			};

			Swiped.prototype.touchEnd = function(e) {
						var className = 'open';
						
						if (!this.isValidTouch(e, true) || !this.startSwipe) {
									return;
						}

						// if swipe is more then 150px or time is less then 150ms
						// if (this.dir * this.delta > this.tolerance || new Date() - this.startTime < this.time) {
						if (this.dir * this.delta > this.tolerance || new Date() - this.startTime < this.time) {
									this.open();

						} else {
									this.close();
									//this.elem.classList.remove('open');

						}
						$('.item.open').removeClass('open');

						if (this.dir === 1) {
									$(this.elem).removeClass('open');
									
									// this.elem.classList.remove('');
						} else {
									$(this.elem).addClass('open');

									// this.elem.classList.add('open');
						}
						

						e.stopPropagation();
						e.preventDefault();


			};

			/**
			 * Animation of the opening
			 */
			Swiped.prototype.open = function(isForce) {
						this.animation(this.dir * this.width);
						this.swiped = true;

						if (!isForce) {
									this.transitionEnd(this.elem, this.onOpen);
						}

						this.resetValue();
			};

			/**
			 * Animation of the closing
			 */
			Swiped.prototype.close = function(isForce) {
						this.animation(0);
						this.swiped = false;

						if (!isForce) {
									this.transitionEnd(this.elem, this.onClose);
						}

						this.resetValue();
			};

			Swiped.prototype.toggle = function() {
						if (this.swiped) {
									this.close();
						} else {
									this.open();
						}
			};

			/**
			 * reset to initial values
			 */
			Swiped.prototype.resetValue = function() {
						this.startSwipe = false;
						this.startScroll = false;
						this.delta = 0;
			};

			Swiped._bindEvents = function() {
						if (Swiped.eventBinded) {
									return false;
						}

						delegate(touch.move, 'touchMove');
						delegate(touch.end, 'touchEnd');
						delegate(touch.start, 'touchStart');

						Swiped.eventBinded = true;
			};

			/**
			 * detect of the user action: swipe or scroll
			 */
			Swiped.prototype.defineUserAction = function(touch) {
						var DELTA_X = 10;
						var DELTA_Y = 10;

						if (Math.abs(this.y - touch.pageY) > DELTA_Y && !this.startSwipe) {
									this.startScroll = true;
						} else if (Math.abs(this.delta) > DELTA_X && !this.startScroll) {
									this.startSwipe = true;
						}
			};

			/**
			 * Which of the touch was a first, if it's a multitouch
			 * touchId saved on touchstart
			 * @param {object} e - event
			 * @returns {boolean}
			 */
			Swiped.prototype.isValidTouch = function(e, isTouchEnd) {
						// take a targetTouches because need events on this node
						// targetTouches is empty in touchEnd, therefore take a changedTouches
						var touches = isTouchEnd ? 'changedTouches' : 'targetTouches';

						return e[touches][0].identifier === this.touchId;
			};

			Swiped.prototype.move = function() {
						if ((this.dir > 0 && (this.delta < 0 || this.left === 0)) || (this.dir < 0 && (this.delta > 0 || this.right === 0))) {
									return false;
						}

						var deltaAbs = Math.abs(this.delta);

						if (deltaAbs > this.width) {
									// linear deceleration
									this.delta = this.dir * (this.width + (deltaAbs - this.width) / 8);
						}

						this.animation(this.delta, 0);
			};

			Swiped.prototype.animation = function(x, duration) {
						duration = duration === undefined ? this.duration : duration;

						this.elem.style.cssText = cssProps.transition + ':' + cssProps.transform + ' ' + duration + 'ms; ' +
						cssProps.transform  + ':' + 'translate3d(' + x + 'px, 0px, 0px)';
			};

			Swiped.prototype.destroy = function(isRemoveNode) {
						var id = this.id;

						Swiped._elems.forEach(function(elem, i) {
									if (elem.id === id) {
												Swiped._elems.splice(i, 1);
									}
						});

						if (isRemoveNode) {
									this.elem.parentNode.removeChild(this.elem);
						}
			};

			// expose Swiped
			window.Swiped = Swiped;
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.infiniteScroll = global.infiniteScroll || {})));
}(this, function (exports) { 'use strict';

  var throttle = function throttle(fn, delay) {
			var now, lastExec, timer, context, args; //eslint-disable-line

			var execute = function execute() {
			  fn.apply(context, args);
			  lastExec = now;
			};

			return function () {
			  context = this;
			  args = arguments;

			  now = Date.now();

			  if (timer) {
						clearTimeout(timer);
						timer = null;
			  }

			  if (lastExec) {
						var diff = delay - (now - lastExec);
						if (diff < 0) {
						  execute();
						} else {
						  timer = setTimeout(function () {
									execute();
						  }, diff);
						}
			  } else {
						execute();
			  }
			};
  };

  var getScrollTop = function getScrollTop(element) {
			if (element === window) {
			  return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
			}

			return element.scrollTop;
  };

  var getComputedStyle = document.defaultView.getComputedStyle;

  var getScrollEventTarget = function getScrollEventTarget(element) {
			var currentNode = element;
			// bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
			while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
			  var overflowY = getComputedStyle(currentNode).overflowY;
			  if (overflowY === 'scroll' || overflowY === 'auto') {
						return currentNode;
			  }
			  currentNode = currentNode.parentNode;
			}
			return window;
  };

  var getVisibleHeight = function getVisibleHeight(element) {
			if (element === window) {
			  return document.documentElement.clientHeight;
			}

			return element.clientHeight;
  };

  var getElementTop = function getElementTop(element) {
			if (element === window) {
			  return getScrollTop(window);
			}
			return element.getBoundingClientRect().top + getScrollTop(window);
  };

  var isAttached = function isAttached(element) {
			var currentNode = element.parentNode;
			while (currentNode) {
			  if (currentNode.tagName === 'HTML') {
						return true;
			  }
			  if (currentNode.nodeType === 11) {
						return false;
			  }
			  currentNode = currentNode.parentNode;
			}
			return false;
  };

  var infiniteScroll = {
			doBind: function doBind() {
			  if (this.binded) return; // eslint-disable-line
			  this.binded = true;

			  var directive = this;
			  var element = directive.el;

			  directive.scrollEventTarget = getScrollEventTarget(element);
			  directive.scrollListener = throttle(directive.doCheck.bind(directive), 200);
			  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);

			  var disabledExpr = element.getAttribute('infinite-scroll-disabled');
			  var disabled = false;

			  if (disabledExpr) {
						this.vm.$watch(disabledExpr, function (value) {
						  directive.disabled = value;
						  if (!value && directive.immediateCheck) {
									directive.doCheck();
						  }
						});
						disabled = Boolean(directive.vm.$get(disabledExpr));
			  }
			  directive.disabled = disabled;

			  var distanceExpr = element.getAttribute('infinite-scroll-distance');
			  var distance = 0;
			  if (distanceExpr) {
						distance = Number(directive.vm.$get(distanceExpr));
						if (isNaN(distance)) {
						  distance = 0;
						}
			  }
			  directive.distance = distance;

			  var immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check');
			  var immediateCheck = true;
			  if (immediateCheckExpr) {
						immediateCheck = Boolean(directive.vm.$get(immediateCheckExpr));
			  }
			  directive.immediateCheck = immediateCheck;

			  if (immediateCheck) {
						directive.doCheck();
			  }

			  var eventName = element.getAttribute('infinite-scroll-listen-for-event');
			  if (eventName) {
						directive.vm.$on(eventName, function () {
						  directive.doCheck();
						});
			  }
			},

			doCheck: function doCheck(force) {
			  var scrollEventTarget = this.scrollEventTarget;
			  var element = this.el;
			  var distance = this.distance;

			  if (force !== true && this.disabled) return; //eslint-disable-line
			  var viewportScrollTop = getScrollTop(scrollEventTarget);
			  var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);

			  var shouldTrigger = false;

			  if (scrollEventTarget === element) {
						shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
			  } else {
						var elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;

						shouldTrigger = viewportBottom + distance >= elementBottom;
			  }

			  if (shouldTrigger && this.expression) {
						this.vm.$get(this.expression);
			  }
			},

			bind: function bind() {
			  var directive = this;
			  var element = this.el;

			  directive.vm.$on('hook:ready', function () {
						if (isAttached(element)) {
						  directive.doBind();
						}
			  });

			  this.bindTryCount = 0;

			  var tryBind = function tryBind() {
						if (directive.bindTryCount > 10) return; //eslint-disable-line
						directive.bindTryCount++;
						if (isAttached(element)) {
						  directive.doBind();
						} else {
						  setTimeout(tryBind, 50);
						}
			  };

			  tryBind();
			},

			unbind: function unbind() {
			  this.scrollEventTarget.removeEventListener('scroll', this.scrollListener);
			}
  };

  if (window.Vue) {
			window.infiniteScroll = infiniteScroll;
			Vue.use(install);
  }

  function install(Vue) {
			Vue.directive('infiniteScroll', infiniteScroll);
  }

  exports.install = install;
  exports.infiniteScroll = infiniteScroll;

}));