"use strict";

// Charts
const canvas = {
	monthCtx : document.getElementById('monthlySales').getContext('2d'),	// Contexto canvas de los meses
	deptCtx : document.getElementById('deptSales').getContext('2d')	// Contexto canvas de las categorias.
};

// Valores del formulario
const formValues = {
	newAmount : document.getElementById('itemAmount').value,	// Nueva cantidad.
	newMonth : document.getElementById('monthId').value	// Nuevo mes.
};

// Colecciones para mostrar en gráficos.
const monthlySalesMap = new Map();

// Variables.
const data = {
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
		labels: Array.from(monthlySalesMap.keys()),
		datasets: [{
				label: 'Cámaras',
				data: [],
				backgroundColor: 'rgba(238, 184, 104, 1)',
				borderWidth: 0
			},
			{
				label: 'Portátiles',
				data: [],
				backgroundColor: 'rgba(75, 166, 223, 1)',
				borderWidth: 0
			},
			{
				label: 'Teléfonos',
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
		labels: deptLabels,
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
		Array.from(monthlySalesMap.values()).reduce(function(count, value) {
			return count + value;
		}, 0) + "€";
}

// * REINICIAR UN ARRAY.

function resetMonthlySales() {
	// Limpiamos el mapa.
	monthlySalesMap.clear();

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
}

function addSale() {
	try {
		// En el caso de que ya esté el mes en el conjunto.
		if(monthlySalesMap.has(formValues.newMonth))
			// Lanzamos una excepción.
			throw {
				name: "MonthError",
				message: "El mes ya está incluido en la gráfica.",
			};

		// Lo pasamos a string ya que todo lo que recoge js de los imputs del DOM son strings.
		monthlySalesMap.set(formValues.newMonth, +formValues.newAmount);

		// Recuento de totales
		initMonthlyTotalSales();

		// Actualizar gráfico
		monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.values());

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

// * EVENT LISTENERS.

buttons.addSaleBtn.addEventListener("click", addSale);
buttons.findOver5000Btn.addEventListener("click", findOver5000);
buttons.resetChartBtn.addEventListener("click", resetMonthlySales);
buttons.showSalesBtn.addEventListener("click", drawSelectMontlySales);
buttons.deleteSaleBtn.addEventListener("click", removeMonthlySale);