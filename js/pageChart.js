"use strict";

// Charts
const canvas = {
	monthCtx : document.getElementById('monthlySales').getContext('2d'),	// Contexto canvas de los meses
	deptCtx : document.getElementById('deptSales').getContext('2d')	// Contexto canvas de las categorias.
};

// Valores del formulario
const formValues = {
	newAmount : document.getElementById('itemAmount'),	// Nueva cantidad.
	newMonth : document.getElementById('monthId'),	// Nuevo mes.
	categories : document.forms[0].inlineRadioOptions	// RadioButtons con las categorias de producto.
};

// Colecciones para mostrar en gráficos.
const collections =  {
	monthlySalesMap : new Map(),
	monthlySalesCamera : new Map(),	// Colección para almacenar las ventas de cámaras.
	monthlySalesPhone : new Map(),	// Colección para almacenar las ventas de teléfonos.
	monthlySalesLaptop : new Map(),	// Colección para almacenar las ventas de portátiles.
	monthlySalesTablet : new Map(),	// Colección para almacenar las ventas de tablet.
	// Colección para almacenar el total de cada venta. La clave es la categoria de producto y el valor las ventas totales de ese producto.
	totalSales : new Map([["camera", 0], ["phone", 0], ["laptop", 0], ["tablet", 0]])	// De momento todas tienen un valor inicial de 0.
};

// Variables.
const chartValues = {
	deptLabels : ["Cámara", "Móvil", "Portátil", "Tablet"],
	yearlyLabel : document.getElementById("yearlyTotal")
};

// Botones.
const buttons = {
	addSaleBtn: document.getElementById("add-sale"),
	findOver5000Btn: document.getElementById("find-over-5000"),
	resetChartBtn: document.getElementById("reset-chart"),
	showSalesBtn: document.getElementById("display-sales"),
	deleteSaleBtn: document.getElementById("delete-sale"),
};

// Gráfico de barras.
const monthlySalesChart = new Chart(canvas.monthCtx, {
	type: "bar",
	data: {
		labels: Array.from(collections.monthlySalesMap.keys()),
		datasets: [{
				label: "Cámaras",
				data: [],
				backgroundColor: 'rgba(238, 184, 104, 1)',
				borderWidth: 0
			},
			{
				label: "Móviles",
				data: [],
				backgroundColor: 'rgba(75, 166, 223, 1)',
				borderWidth: 0
			},
			{
				label: "Portátiles",
				data: [],
				backgroundColor: 'rgba(239, 118, 122, 1)',
				borderWidth: 0
			},		   
			{
				label: "Tablets",
				data: [],
				backgroundColor: 'rgba(40, 167, 69, 1)',
				borderWidth: 0
			}
		],
	},
	options: {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	},
});

// Gráfico de sectores.
const deptSalesChart = new Chart(canvas.deptCtx, {
	type: "pie",
	data: {
		labels: chartValues.deptLabels,
		datasets: [
			{
				label: "Número de ventas",
				data: [...collections.totalSales.values()],
				backgroundColor: [
					"rgba(238, 184, 104, 1)",
					"rgba(75, 166, 223, 1)",
					"rgba(239, 118, 122, 1)",
					"rgba(40, 167, 69, 1)",
				],
				borderWidth: 0,
			},
		],
	},
	options: {},
});

// * ENCONTRAR VENTAS SUPERIORES A 5000€ CON FIND()

function findOver5000() {
	let position = -1;

	// Guarda el primer elemento que coincida con la condición de la función.
	let quantity = monthSales.find(function (elem, index) {
		if (elem > 5000) {
			position = index;
			return true;
		}
		return false;
	});

	alert("Cantidad: " + quantity + " Posición: " + position);
}

// * MEJORA DEL CÁLCULO DE TOTALES.

function initMonthlyTotalSales() {
	data.yearlyLabel.innerHTML =
	// Se transforma a un array los valores del mapa y ya ahí utilizamos reduce.
		Array.from(collections.monthlySalesMap.values()).reduce(function(count, value) {
			return count + value;
		}, 0) + "€";
}

// * REINICIAR UN ARRAY.

function resetMonthlySales() {
	// Limpiamos el mapa.
	collections.monthlySalesMap.clear();

	// Limpiamos los datos del gráfico.
	monthlySalesChart.data.labels = [];

	// Actualizamos el gráfico con el método update del framework.
	monthlySalesChart.update();
	monthlySalesChart.reset();
	monthlySalesChart.render();

	// Volvemos a calcular los totales.
	initMonthlyTotalSales();
}

// * AÑADIR VENTAS AL GRÁFICO.

function cleanAddSaleForm() {
	formValues.newMonth.value = "";
	formValues.newAmount.value = "";
	formValues.categories.value = "";
}

/**
 * Función que suma una cantidad existente + la
 * cantidad que reciba del formulario. Después
 * de sumarselo lo mete al map correspondiente.
 * @param {*} map El mapa a la categoría de productos correspondiente.
 * @param {*} key La clave a buscar en ese mapa.
 */
function getTotalAmount(map, month) {
	let total = map.get(month);
	total += +formValues.newAmount.value;	// Le sumamos la cantidad actual + la nueva.
	map.set(month, total);
}

function addProductToMap() {
	// Agrega el producto según el valor que recibe al map correspondiente.
	switch(formValues.categories.value) {	// Para cada caso tenemos que hacer lo siguiente.
		case "camera":
			if(collections.monthlySalesCamera.has(formValues.categories.value)) {	// Si el producto ya está añadido.
				// Hay que hacer sumarle la cantidad que ya tenía + la nueva.
				getTotalAmount(collections.monthlySalesCamera, formValues.newMonth.value);
			} else {	// En caso contrario...
				/* Lo que tenemos que hacer es registrarlo en el mapa correspondiente. Su clave
				será el mes introducido por el formulario y si valor la cantidad de ese producto. */
				collections.monthlySalesCamera.set(formValues.newMonth.value, +formValues.newAmount.value);
				// También hay que tener en cuenta que el resto de productos puede ser que no tengan ventas.
				collections.monthlySalesPhone.set(newMonth.value, 0);
				collections.monthlySalesLaptop.set(newMonth.value, 0);
				collections.monthlySalesTablet.set(newMonth.value, 0);
			}
			break;
		case "phone":
			if(collections.monthlySalesPhone.has(formValues.categories.value)) {
				getTotalAmount(collections.monthlySalesPhone, formValues.newMonth.value);
			} else {
				collections.monthlySalesPhone.set(formValues.newMonth.value, +formValues.newAmount.value);
				collections.monthlySalesCamera.set(newMonth.value, 0);
				collections.monthlySalesLaptop.set(newMonth.value, 0);
				collections.monthlySalesTablet.set(newMonth.value, 0);
			}
			break;
		case "laptop":
			if(collections.monthlySalesLaptop.has(formValues.categories.value)) {
				getTotalAmount(collections.monthlySalesLaptop, formValues.newMonth.value);
			} else {
				collections.monthlySalesLaptop.set(formValues.newMonth.value, +formValues.newAmount.value);
				collections.monthlySalesCamera.set(newMonth.value, 0);
				collections.monthlySalesPhone.set(newMonth.value, 0);
				collections.monthlySalesTablet.set(newMonth.value, 0);
			}
			break;
		case "tablet":
			if(collections.monthlySalesTablet.has(formValues.categories.value)) {
				getTotalAmount(collections.monthlySalesTablet, formValues.newMonth.value);
			} else {
				collections.monthlySalesTablet.set(formValues.newMonth.value, +formValues.newAmount.value);
				collections.monthlySalesCamera.set(newMonth.value, 0);
				collections.monthlySalesPhone.set(newMonth.value, 0);
				collections.monthlySalesLaptop.set(newMonth.value, 0);
			}
			break;
	}
}


function checkFields() {
	if(formValues.newMonth.value === ""
	|| formValues.newAmount.value === ""
	|| formValues.categories.value === "") {
		throw {
			name : "FormError",
			message : "Algunos campos están vacios."
		};
	}
}

function isNotValidAMount() {
	if(formValues.newAmount.value < 0
	|| !/\d+/.test(formValues.newAmount.value)) {	// Comprobamos también si el campo contiene números.
		throw {
			name : "InvalidValue",
			message : "Valor para la cantidad inválido."
		};
	}
}

function updateBarChart() {
	monthlySalesChart.data.datasets[0].data = [...collections.monthlySalesCamera.values()];
	monthlySalesChart.data.datasets[1].data = [...collections.monthlySalesPhone.values()];
	monthlySalesChart.data.datasets[2].data = [...collections.monthlySalesLaptop.values()];
	monthlySalesChart.data.datasets[3].data = [...collections.monthlySalesTablet.values()];
}

function addSale() {
	try {
		if(!checkFields() && !isNotValidAMount()) {	// Si los datos están correctos.
			if(collections.monthlySalesMap.has(formValues.newMonth.value)) {	// Si el mes ya existe en el mapa principal.
				getTotalAmount(collections.monthlySalesMap, formValues.newMonth.value);	// Hacemos la suma total del producto.
				addProductToMap();
			} else {	// En caso contrario.
				collections.monthlySalesMap.set(formValues.newMonth.value, +formValues.newAmount.value);	// Tenemos que registrar el mes.
				addProductToMap();
			}
		}

		// Después de eso cálculamos los totales.
		initMonthlyTotalSales();

		// Para que aparezcan agrupados por meses.
		monthlySalesChart.data.labels = Array.from(collections.monthlySalesMap.keys());

		// Finalmente actualizamos el gráfico de barras.
		updateBarChart();

	} catch(error) {
		if(error.name === "FormError") alert(error.name + ": " + error.message);
		if(error.name === "InvalidValue") alert(error.name + ": " + error.message);
	}
}

function drawSelectMontlySales() {
	// Seleccionamos el select usando id con jQuery
	let removeSales = $("#removeSales");
	// Eliminamos options del select.
	removeSales.empty();

	for(let [month, amount] of collections.monthlySalesMap.entries()) {
		// Creamos elemento option con jQuery
		let opt = $("<option>")
			.val(month)	// El valor es el mes.
			.text(month + ": " + amount);	// Y el texto el mes + la cantidad.

			// Añadimos elemento al select.
		removeSales.append(opt);
	}
}

function removeMonthlySale() {
	let removeSales = document.getElementById("removeSales");

	// Borramos de la colección la venta.
	collections.monthlySalesMap.delete(removeSales.value);

	// Actualizamos colección en el gráfico

	// Sus valores.
	monthlySalesChart.data.datasets[0].data = Array.from(collections.monthlySalesMap.values());
	// Y sus claves.
	monthlySalesChart.data.labels = Array.from(collections.monthlySalesMap.keys());
	// Y actualizamos el gráfico.
	monthlySalesChart.update();

	// Actualizasmos la vista
	initMonthlyTotalSales();
	drawSelectMontlySales();
}

// * EVENT LISTENERS.

buttons.addSaleBtn.addEventListener("click", addSale);
buttons.findOver5000Btn.addEventListener("click", findOver5000);
buttons.resetChartBtn.addEventListener("click", resetMonthlySales);
buttons.showSalesBtn.addEventListener("click", drawSelectMontlySales);
buttons.deleteSaleBtn.addEventListener("click", removeMonthlySale);