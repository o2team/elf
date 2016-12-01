jQuery(document).ready(function ($) {
	'use strict';

	//Vars
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	$(document).scroll(function () {
		var y = $(this).scrollTop();
		if ($(this).scrollTop() > 100) {
			$('header').stop().animate({
				backgroundColor: 'rgba(0,0,0,1)'
			}, 'fast');
		} else {
			if (!$("body").hasClass("no-cover")) {
				$('header').stop().animate({
					backgroundColor: 'rgba(0,0,0,0)'
				}, 'fast');
			}
		}
	});

	//Navigate
	$(".navigation li").click(function (e) {

		var type = $(this).attr("data-type");

		if (type === "in") {

			var name = $(this).attr("data-url");
			$('.navigation li[data-url="' + name + '"]').addClass('active', {
				duration: 300
			});
			$('.navigation li[data-url="' + name + '"]').siblings().removeClass('active', {
				duration: 300
			});

			if (!$('header .navigation').is(":hidden")) {
				$('header .logo').stop().animate({
					top: 15
				}, 'fast');
				$('header .menu').stop().animate({
					top: 25
				}, 'fast');
				if (!$('header .menu').is(":hidden")) $('header .navigation').slideUp("fast", "easeOutQuart");
				$('header').stop().animate({
					height: '70px'
				}, 'fast', function () {
					$('html,body').stop().animate({
						scrollTop: $("section." + name).position().top - 60
					}, 1000);
				});
			}

		} else {
			var url = $(this).attr("data-url");
			window.location = url;
		}
	});

	$(".subscribe .arrow, footer .arrow").click(function (e) {
		$('html,body').animate({
			scrollTop: 0
		}, 'slow')
		return false;
	});

	$("header .logo").click(function (e) {
		$('html,body').animate({
			scrollTop: 0
		}, 'slow')
		return false;
	});

	// $(".home .learn").click(function (e) {
	// 	var y = $("section.about").position().top - 60;
	// 	$('html,body').animate({
	// 		scrollTop: y
	// 	}, 'slow')
	// 	return false;
	// });
	//Navigate

	//Navigation Menu
	var sectionOffset = '15%';
	$("section").waypoint({
		handler: function (event, direction) {
			var name = $(this).attr("id");
			if (direction === "up") name = $(this).prev().attr("id");
			if (direction === "up") sectionOffset = '30%';
			$('.navigation li[data-url="' + name + '"]').addClass('active', {
				duration: 300
			});
			$('.navigation li[data-url="' + name + '"]').siblings().removeClass('active', {
				duration: 300
			});
		},
		offset: sectionOffset
	});


	//Navigation Menu
	$("header .menu").click(function (e) {
		if ($('header .navigation').is(":hidden")) {
			var md = windowHeight - ($('header .navigation li').length * 34);
			$('header').stop().animate({
				height: windowHeight
			}, 'slow');
			$('header .logo').stop().animate({
				top: windowHeight - 55
			}, 'fast');
			$('header .menu').stop().animate({
				top: windowHeight - 45
			}, 'fast');
			$('header .navigation').slideDown("fast", "easeInQuart");
			$('header .navigation ul').stop().animate({
				marginTop: md / 2
			}, 'fast');
		} else {
			$('header .logo').stop().animate({
				top: 15
			}, 'fast');
			$('header .menu').stop().animate({
				top: 25
			}, 'fast');
			$('header .navigation').slideUp("fast", "easeOutQuart");
			$('header').stop().animate({
				height: 70
			}, 'slow');
		}
	});
	//Navigation Menu

	//Home
	// $(".home .download li").click(function () {
	// 	var url = $(this).attr("data-url");
	// 	window.open(url, '_blank');
	// });

	// $(".home .watch").magnificPopup({
	// 	disableOn: 700,
	// 	type: 'iframe',
	// 	mainClass: 'mfp-fade',
	// 	removalDelay: 160,
	// 	preloader: false,

	// 	fixedContentPos: false
	// });

	// $(".home .more").click(function () {
	// 	var y = $('section.about').position().top - 60;
	// 	$('html,body').animate({
	// 		scrollTop: y
	// 	}, 1000);
	// 	return false;
	// });
	//Home

	//About 
	// $('.about .screen').flexslider({
	// 	animation: "slide",
	// 	animationLoop: true,
	// 	animationSpeed: 400,
	// 	easing: "easeOutBack",
	// 	slideshow: false,
	// 	pauseOnHover: false,
	// 	controlNav: false,
	// 	directionNav: false
	// });

	// $('.about .text').flexslider({
	// 	animation: "slide",
	// 	animationLoop: true,
	// 	animationSpeed: 400,
	// 	easing: "easeOutBack",
	// 	slideshow: true,
	// 	slideshowSpeed: 3000,
	// 	controlNav: true,
	// 	directionNav: false,
	// 	before: function () {
	// 		var currentID = $('.about .text li').index($(".flex-active-slide"));
	// 		$('.about .screen').flexslider(currentID);
	// 	}
	// });

	// $(".home .arrow, notfound .back").css('left', (windowWidth - 50) / 2);

	// $(".about .text .slides li").each(function () {
	// 	$(this).css('margin-top', (387 - $(this).height()) / 2);
	// });
	//About

	//Features
	// $('.features .feature').hover(function () {
	// 	$('.features .feature').stop().animate({
	// 		opacity: 0.3
	// 	}, 'fast');
	// 	$(this).stop().animate({
	// 		opacity: 1
	// 	}, 'fast');
	// }, function () {
	// 	$('.features .feature').stop().animate({
	// 		opacity: 1
	// 	}, 'fast');
	// });
	//Features

	//Featured
	$(".featured .logos .item div").click(function () {
		var url = $(this).attr("data-url");
		window.open(url, '_blank');
	});
	//Featured

	//404
	$(".notfound button").click(function () {
		var url = $(this).attr("data-url");
		window.open(url, "_self");
	});
	//404

});


$(window).load(function () {

	fixSizes();

	var y = $(this).scrollTop();
	if ($(this).scrollTop() > 100) {
		$('header').stop().animate({
			backgroundColor: 'rgba(0,0,0,1)'
		}, 'fast');
	} else {
		if (!$("body").hasClass("no-cover")) {
			$('header').stop().animate({
				backgroundColor: 'rgba(0,0,0,0)'
			}, 'fast');
		}
	}

	$(".loader").delay(1000).fadeOut('slow');
	$("body").css("overflow", "auto");

	//Animations
	setTimeout(function () {
		$('header').addClass('animated fadeInDown')
	}, 1300);
	// setTimeout(function () {
	// 	$('#home .phone').addClass('animated fadeInLeft')
	// }, 1600);
	setTimeout(function () {
		$('#home .info').addClass('animated fadeIn')
	}, 1600);

	// $('#about .story').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#about .story .sixteen').addClass('animated fadeInDown')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	// $('#about .video').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#about .media').addClass('animated fadeInLeft')
	// 	}, 0);
	// 	setTimeout(function () {
	// 		$('#about .info').addClass('animated fadeInRight')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	// $('#features .main').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#features .main .feature-list').addClass('animated fadeIn')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	// $('#features .more').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#features .more .feature').addClass('animated fadeInDown')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	// $('#gallery').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#gallery .screenshots').addClass('animated fadeInDown')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	// $('#reviews').waypoint(function () {
	// 	setTimeout(function () {
	// 		$('#reviews .quotes').addClass('animated fadeInLeft')
	// 	}, 0);
	// }, {
	// 	offset: '50'
	// });

	$('#featured').waypoint(function () {
		setTimeout(function () {
			$('#featured .item').addClass('animated fadeInDown')
		}, 0);
	}, {
		offset: '50'
	});

	$('#contact').waypoint(function () {
		setTimeout(function () {
			$('#contact .phone').addClass('animated fadeInLeft')
		}, 0);
		setTimeout(function () {
			$('#contact .form').addClass('animated fadeInRight')
		}, 0);
	}, {
		offset: '50'
	});
	//Animations


});


$(window).resize(function () {
	fixSizes();
});

function fixSizes() {

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	$(".fullscreen").css('height', windowHeight);

	if (windowWidth > 960) {

		$(".home, .home .background, .home .container").css('height', 770);

		var t = 650 - $(".home .info").height()
		$(".home .info").css('bottom', t / 2);
		// $(".home .info").css('left', 0);

	} else {

		$(".home .info").css('margin-top', ($(".home .info").parent().height() - $(".home .info").height()) / 2);

	}

	$(".vertical-center").each(function () {
		$(this).css('margin-top', ($(this).parent().height() - $(this).height()) / 2);
	});

}