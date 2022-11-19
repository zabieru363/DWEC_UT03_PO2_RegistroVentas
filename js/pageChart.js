"use strict";

// Charts
const monthCtx = document.getElementById('monthlySales').getContext('2d');	// Contexto canvas de los meses
const deptCtx = document.getElementById('deptSales').getContext('2d');	// Contexto canvas de las categorias.

// Seleccionamos la capa para guardar el total de dinero por año.
const yearlyLabel = document.getElementById('yearlyTotal');

// Valores del formulario
const newAmount = document.getElementById('itemAmount');	// Nueva cantidad.
const newMonth = document.getElementById('monthId');	// Nuevo mes.

// Colecciones para mostrar en gráficos.
const monthlyLabelsSet = new Set();
const monthlySalesArray = [];

//! También lo podemos hacer así.
// const DATA = {
// 	monthlyLabelsSet : new Set(),
// 	monthlySalesArray : []
// };

const monthlySalesMap = new Map();

// Variables
const monthSales = Array.of(6500, 3250, 4000);
const monthLabels = Array.of('Octubre','Noviembre','Diciembre');

const deptSales = Array.of(12, 9, 7, 3);
const deptLabels = Array.of('Cámara', 'Móvil', 'Portátil', 'Tablet');

let yearlyTotal = 0;

// Gráfico de barras.
let monthlySalesChart = new Chart(monthCtx, {
	type: "bar",
	data: {
		labels: deptLabels,
		datasets: [
			{
				label: "Número de ventas",
				data: [],
				backgroundColor: [
					"rgba(238, 184, 104, 1)",
					"rgba(75, 166, 223, 1)",
					"rgba(239, 118, 122, 1)",
				],
				borderWidth: 0,
			},
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
let deptSalesChart = new Chart(deptCtx, {
	type: "pie",?
	
		datasets: [
			{
				label: "Número de ventas",
				data: deptSales,
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

// * CÁLCULO DE TOTALES CON SPREAD OPERATOR.

function addYearlyTotal(a, b, c) {
	return a + b + c;
}

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
	yearlyLabel.innerHTML =
	// Se transforma a un array los valores del mapa y ya ahí utilizamos reduce.
		Array.from(monthlySalesMap.values()).reduce(function(count, value) {
			return count + value;
		}, 0) + "€";
}

// * REINICIAR UN ARRAY.

function resetMonthlySales() {
	// Limpiamos el mapa.
	monthlySalesMap.clear();

	// Limpiamos los datos del gráfico.
	// monthlySalesChart.data.datasets[0].data = [];
	monthlySalesChart.data.labels = [];

	// Actualizamos el gráfico con el método update del framework.
	monthlySalesChart.update();
	// También se puede hacer con los métodos de Chart
	monthlySalesChart.reset();
	monthlySalesChart.render();

	initMonthlyTotalSales();
}

// * AÑADIR VENTAS AL GRÁFICO.

function cleanAddSaleForm() {
	newMonth.value = "";
	newAmount.value = "";
}

function addSale() {
	const newProduct = document.querySelector('#exampleModal input[name="inlineRadioOptions"]:checked');

	console.log('newProduct: ', newProduct);
	try {
		// En el caso de que ya esté el mes en el conjunto.
		if(monthlySalesMap.has(newMonth.value))
			// Lanzamos una excepción.
			throw {
				name: "MonthError",
				message: "El mes ya está incluido en la gráfica.",
			};

		// Lo pasamos a string ya que todo lo que recoge js de los imputs del DOM son strings.
		monthlySalesMap.set(newMonth.value, Number.parseInt(newAmount.value));
		// Recuento de totales
		initMonthlyTotalSales();

		// Actualizar gráfico
		monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.values());
		// Con spread operator
		// [...monthlySalesMap.values()];

		// Cómo el gráfico espera un array creamos un array del conjunto.
		monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
		monthlySalesChart.update();
	} catch (error) {
		// Tratamiento de excepciones
		alert(error.message);
	} finally {
		// Limpiamos el formulario independientemente de que se haya añadido la venta o no.
		cleanAddSaleForm();
	}
}

function drawSelectMontlySales() {
	// Seleccionamos el select usando id con jQuery
	let removeSales = $("#removeSales");
	// Eliminamos options del select.
	removeSales.empty();

	for(let [month, amount] of monthlySalesMap.entries()) {
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
	monthlySalesMap.delete(removeSales.value);

	// Actualizamos colección en el gráfico

	// Sus valores.
	monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.values());
	// Y sus claves.
	monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
	// Y actualizamos el gráfico.
	monthlySalesChart.update();

	// Actualizasmos la vista
	initMonthlyTotalSales();
	drawSelectMontlySales();
}
