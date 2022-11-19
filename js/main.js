'use strict';
$(function () {

	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$("#toparrow").fadeIn();
		} else {
			$("#toparrow").fadeOut();
		}
	});

	let examples = $('#examples');
	let examplesRows = examples.children();
	$('#examplesLinks a').click((event) => {
		let target = $(event.target);
		let index = $(target).index();
		examplesRows.hide();
		$(examplesRows[index]).show();
		$(examplesRows[examplesRows.length - 1]).show();

		$('#result').empty();
	});

});
