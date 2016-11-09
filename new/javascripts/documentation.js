$(document).ready(function () {

$('#sidebar li').on('click',function(){
  $('#sidebar li').removeClass('active');
  $(this).addClass('active');
  $("html, body").animate({ scrollTop: 0 }, "slow");

});


$('iframe').iFrameResize({
				log                     : false,                  // Enable console logging
				inPageLinks             : true
			}) ;


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




