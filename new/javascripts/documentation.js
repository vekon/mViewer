$(document).ready(function () {

$('#sidebar li').on('click',function(){
  $('#sidebar li').removeClass('active');
  $(this).addClass('active');
  $("html, body").animate({ scrollTop: 0 }, "slow");

});


$('#toggle-buttom').on('click',function(){
  $('.page-holder').toggleClass('pull-down');
  $('.side-nav').toggleClass('pull-down');
});



$('iframe').iFrameResize({ log : false, inPageLinks : true}) ;


$('[data-toggle=popover]').popover({
    content: $('#downloads').html(),
    html: true
}).click(function() {
    $(this).popover('show');
});

$(document).scroll(function () {
	var navWrap = $('#navWrap'),
    nav = $('.bs-docs-sidebar>ul'),
    startPosition = navWrap.offset().top,
    stopPosition = $('#stopHere').offset().top - nav.outerHeight();
    var y = $(this).scrollTop()

    
    if (y > startPosition) {
        nav.addClass('sticky');
		if (y > (stopPosition - 125)) {
            nav.css('top', stopPosition -125 - y);
        } else {
            nav.css('top', 20);
        }

    } else {
        nav.removeClass('sticky');
    } 
});

});




