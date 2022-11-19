(function (){
	let divExamples = document.getElementById('examples').children[0];
	let buttons = divExamples.getElementsByClassName('tab-pane')[0].getElementsByTagName('button');

	buttons[0].addEventListener('click', function(){
		$$result.clear();
		$$result.log('<h1>Ejemplo</h1>');
		$$result.log('Ejemplo de log');
		$$result.log([1, 2, 3, 4, 5]);
		$$result.hr();
		$$result.logRaw('Ejemplo raw <h1>prueba</h1>');
		$$result.logRaw([1, 2, 3, 4, 5]);
		$$result.hr();
		$$result.logBold("Ejemplo de bold");
		$$result.logBold("Etiqueta", "Valor");

		let computer1 = {
			brand: 'HP',
			model: 'EliteBook',
			arr: [1,2,3],
			memory: 16,
			date: new Date(),
			SSD: 2,
			test: {
				a: 'a',
				b: 1,
				c: [1,2,3],
				d: new Date()
			},
			discounted: true,
			price: 2000
		}
		$$result.hr();
		$$result.log(computer1);
	});

	buttons[1].addEventListener('click', function(){
		$$result.clear();
		$$result.logBold('');
	});

	let examples = $('#examples');
	let examplesRows = examples.children();
	$(examplesRows[0]).show();
	$(examplesRows[examplesRows.length - 1]).show();
	let tabLinks = examplesRows[0].getElementsByClassName('nav-link');
	let tabPane = examplesRows[0].getElementsByClassName('tab-pane');
	// tabLinks[0].classList.remove('active');
	// tabLinks[1].classList.add('active');
	// tabPane[0].classList.remove('active');
	// tabPane[1].classList.add('active');
	buttons[0].click();

})();

