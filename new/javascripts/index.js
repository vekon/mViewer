$(document).ready(function(){
	$('[data-toggle=popover]').popover({
		content: $('#downloads').html(),
		html: true
	}).click(function() {
	    $(this).popover('show');
	});
});