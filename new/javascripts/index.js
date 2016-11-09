$(document).ready(function(){
  $('.slider').slick({
  	infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  dots: true,
	  adaptiveHeight: true,
	  arrows:true
  });

	$('[data-toggle=popover]').popover({
		content: $('#downloads').html(),
		html: true
	}).click(function() {
	    $(this).popover('show');
	});


});