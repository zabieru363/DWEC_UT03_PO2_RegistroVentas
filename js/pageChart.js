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
	categories : document.forms[0].inlineRadioOptions,	// RadioButtons con las categorias de producto.
	months : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]	// Array con los meses para cargar en el select de eliminar ventas.
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
	deptLabels : ["Cámaras", "Móviles", "Portátiles", "Tablets"],	// Labels para el gráfico de sectores.
	yearlyLabel : document.getElementById("yearlyTotal"),	// Muestra el total de ventas anuales.
	monthsKey : ["2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12"]
};

// Botones.
const buttons = {
	addSaleBtn: document.getElementById("add-sale"),	// Botón para añadir una venta.
	findOver5000Btn: document.getElementById("find-over-5000"),	// Botón para encontrar ventas superiores a 5000€.
	resetChartBtn: document.getElementById("reset-chart"),	// Botón para resetear los gráficos.
	showSalesBtn: document.getElementById("display-sales"),	// Botón para mostrar las ventas en el select del modal deletesales.
	deleteSaleBtn: document.getElementById("delete-sale"),	// Botón que permite eliminar una venta.
};

// Gráfico de barras.
const monthlySalesChart = new Chart(canvas.monthCtx, {
	type: "bar",
	data: {
		labels: [...collections.monthlySalesMap.keys()],
		datasets: [{
				label: "Cámaras",
				data: [...collections.monthlySalesCamera.values()],
				backgroundColor: 'rgba(238, 184, 104, 1)',
				borderWidth: 0
			},
			{
				label: "Móviles",
				data: [...collections.monthlySalesPhone.values()],
				backgroundColor: 'rgba(75, 166, 223, 1)',
				borderWidth: 0
			},
			{
				label: "Portátiles",
				data: [...collections.monthlySalesLaptop.values()],
				backgroundColor: 'rgba(239, 118, 122, 1)',
				borderWidth: 0
			},		   
			{
				label: "Tablets",
				data: [...collections.monthlySalesTablet.values()],
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

/**
 * Función que encuentra ventas superiores a 5000.
 * Indica la cantidad y la posición en la que está.
 */
function findOver5000() {
	let position = -1;

	// Guarda el primer elemento que coincida con la condición de la función.
	const quantity = [...collections.totalSales.values()].find(function (sale, index) {
		if (sale > 5000) {
			position = index;
			return true;
		}
		return false;
	});

	alert(!quantity ? "No hay ventas superiores a 5000€" : "Cantidad: " + quantity + "€" +  " Posición: " + position);
}

// * CÁLCULO DE TOTALES.

/**
 * Calcula las ventas totales anuales. Si hay 0€
 * muestra "Sin ventas".
 */
function initMonthlyTotalSales() {
	// Reducimos todas las ventas a un único valor.
	const total = [...collections.monthlySalesMap.values()].reduce(function(count, value) {
		return count + value;
	}, 0);

	const result = !total ? "Sin ventas" : total + "€";

	chartValues.yearlyLabel.innerHTML = result;
}

// * REINICIAR LOS GRAFICOS.

/**
 * Función que reinicia los gráficos.
 */
function resetMonthlySales() {
	// Limpiamos todos los mapas.
	collections.monthlySalesMap.clear();
	collections.monthlySalesCamera.clear();
	collections.monthlySalesPhone.clear();
	collections.monthlySalesLaptop.clear();
	collections.monthlySalesTablet.clear();

	// Limpiamos los meses del gráfico.
	monthlySalesChart.data.labels = [];

	// Resetear el gráfico de barras.
	monthlySalesChart.update();
	monthlySalesChart.reset();
	monthlySalesChart.render();

	// Resetear el gráfico de sectores.
	deptSalesChart.update();
	deptSalesChart.reset();
	deptSalesChart.render();

	// Volvemos a calcular los totales.
	initMonthlyTotalSales();
}

/**
 * Función que limpia los campos del formulario.
 */
function cleanAddSaleForm() {
	formValues.newMonth.value = "";
	formValues.newAmount.value = "";
	formValues.categories.value = "";
}

// * AÑADIR VENTAS AL GRÁFICO.

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

/**
 * Función que añade el producto independientemente de su categoria
 * a su mapa correspondiente para posteriormente poder usarlo en los gráficos.
 * Trabaja con los mapas del gráfico de barras y con el mapa del gráfico de sectores.
 */
function addProductToMap() {
	// Agrega el producto según el valor que recibe al map correspondiente.
	switch(formValues.categories.value) {	// Para cada caso tenemos que hacer lo siguiente.
		case "camera":
			if(collections.monthlySalesCamera.has(formValues.newMonth.value)) {
				// Si el producto ya está añadido.
				// Hay que hacer sumarle la cantidad que ya tenía + la nueva.
				getTotalAmount(collections.monthlySalesCamera,formValues.newMonth.value);
			} else {
				// En caso contrario...
				/* Lo que tenemos que hacer es registrarlo en el mapa correspondiente. Su clave
				será el mes introducido por el formulario y si valor la cantidad de ese producto. */
				collections.monthlySalesCamera.set(formValues.newMonth.value, +formValues.newAmount.value);
				// También hay que tener en cuenta que el resto de productos puede ser que no tengan ventas.
				collections.monthlySalesPhone.set(formValues.newMonth.value, "");
				collections.monthlySalesLaptop.set(formValues.newMonth.value, "");
				collections.monthlySalesTablet.set(formValues.newMonth.value, "");
			}

			// Calculamos las ventas totales del producto.
			getTotalAmount(collections.totalSales, "camera");
			break;
		case "phone":
			if (collections.monthlySalesPhone.has(formValues.newMonth.value)) {
				getTotalAmount(collections.monthlySalesPhone, formValues.newMonth.value);
			} else {
				collections.monthlySalesCamera.set(formValues.newMonth.value, "");
				collections.monthlySalesPhone.set(formValues.newMonth.value, +formValues.newAmount.value);
				collections.monthlySalesLaptop.set(formValues.newMonth.value, "");
				collections.monthlySalesTablet.set(formValues.newMonth.value, "");
			}

			getTotalAmount(collections.totalSales, "phone");
			break;
		case "laptop":
			if (collections.monthlySalesLaptop.has(formValues.newMonth.value)) {
				getTotalAmount(collections.monthlySalesLaptop, formValues.newMonth.value);
			} else {
				collections.monthlySalesCamera.set(formValues.newMonth.value, "");
				collections.monthlySalesPhone.set(formValues.newMonth.value, "");
				collections.monthlySalesLaptop.set(formValues.newMonth.value, +formValues.newAmount.value);
				collections.monthlySalesTablet.set(formValues.newMonth.value, "");
			}

			getTotalAmount(collections.totalSales, "laptop");
			break;
		case "tablet":
			if (collections.monthlySalesTablet.has(formValues.newMonth.value)) {
				getTotalAmount(collections.monthlySalesTablet, formValues.newMonth.value);
			} else {
				collections.monthlySalesCamera.set(formValues.newMonth.value, "");
				collections.monthlySalesPhone.set(formValues.newMonth.value, "");
				collections.monthlySalesLaptop.set(formValues.newMonth.value, "");
				collections.monthlySalesTablet.set(formValues.newMonth.value, +formValues.newAmount.value);
			}

			getTotalAmount(collections.totalSales, "tablet");
			break;
	}
}

/**
 * Función que comprueba si los campos están vacíos.
 * Lanza una excepción si alguno de ellos está vacío.
 */
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

/**
 * Función que comprueba si la cantidad que se ha
 * introducido en el formulario es válida. Si es
 * negativa o no contiene números lanza una excepción.
 */
function isNotValidAMount() {
	if(formValues.newAmount.value < 0
	|| !/\d+/.test(formValues.newAmount.value)) {	// Comprobamos también si el campo contiene números.
		throw {
			name : "InvalidValue",
			message : "Valor para la cantidad inválido."
		};
	}
}

/**
 * Función que actualiza el gráfico de barras.
 * Mete en un array las ventas de cada colección 
 * de productos y lo añade al gráfico de barras.
 */
function updateBarChart() {
	monthlySalesChart.data.datasets[0].data = [...collections.monthlySalesCamera.values()];
	monthlySalesChart.data.datasets[1].data = [...collections.monthlySalesPhone.values()];
	monthlySalesChart.data.datasets[2].data = [...collections.monthlySalesLaptop.values()];
	monthlySalesChart.data.datasets[3].data = [...collections.monthlySalesTablet.values()];
}

/**
 * Función que actualiza el gráfico de sectores.
 * Mete en un array las ventas totales del mapa que almacena las ventas totales.
 */
function updatePieChart() {
	deptSalesChart.data.datasets[0].data = [...collections.totalSales.values()];
}

/**
 * Función que permite añadir una venta.
 * Comprueba primero que los datos del formulario son correctos
 * después comprueba si el mes existe en el mapa principal. Si este
 * existe añade el producto con su cantidad actualizada. Si no existe
 * añade el mes y el producto.
 */
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
		monthlySalesChart.data.labels = [...collections.monthlySalesMap.keys()];

		// Actualizamos el gráfico de barras.
		updateBarChart();
		monthlySalesChart.update();
		monthlySalesChart.render();

		// Actualizamos el gráfico de sectores.
		updatePieChart();
		deptSalesChart.update();
		deptSalesChart.render();

	} catch(error) {
		if(error.name === "FormError") alert(error.name + ": " + error.message);
		if(error.name === "InvalidValue") alert(error.name + ": " + error.message);
	} finally {
		cleanAddSaleForm();
	}
}

// ! YO VOY A TRATAR DE HACER LA OPCIÓN C PARA ELIMINAR LAS VENTAS.

function drawSelectMontlySales() {
	// Seleccionamos el select usando id con jQuery
	const removeSalesSelect = $("#removeSales");
	// Eliminamos options del select.
	removeSalesSelect.empty();

	let index = 0;	// Necesitamos esta variable para ir asignando las claves de los meses a los options del select.

	for(const month of formValues.months) {
		const option = $("<option>")
			.val(chartValues.monthsKey[index])	// El valor serán las claves de los meses que se guardan en los mapas.
			.text(month);	// Y el texto será el nombre del mes.
		removeSalesSelect.append(option);	// Añadimos los options al select.
		index++;
	}
}

function monthExists(month) {
	if(!collections.monthlySalesMap.has(month)) {
		throw {
			name : "MonthError",
			message : "No hay ventas para este mes."
		};
	}
}

function productHasMonth(map, month) {
	return collections[map].has(month);
}

function removeMonthlySale() {
	const removeSalesSelect = document.getElementById("removeSales");
	const categories = document.forms[1].inlineRadioOptions;

	try {
		if(!monthExists(removeSalesSelect.value)) {
			// Borramos la venta de la colección.
			switch(categories.value) {
				case "camera":
					if(productHasMonth("monthlySalesCamera", removeSalesSelect.value)) {
						collections.monthlySalesCamera.delete(removeSalesSelect.value);
						collections.totalSales.delete("camera");
					}
					break;
				case "phone":
					if(productHasMonth("monthlySalesPhone", removeSalesSelect.value)) {
						collections.monthlySalesPhone.delete(removeSalesSelect.value);
						collections.totalSales.delete("phone");
					}
					break;
				case "laptop":
					if(productHasMonth("monthlySalesLaptop", removeSalesSelect.value)) {
						collections.monthlySalesLaptop.delete(removeSalesSelect.value);
						collections.totalSales.delete("laptop");
					}
					break;
				case "tablet":
					if(productHasMonth("monthlySalesTablet", removeSalesSelect.value)) {
						collections.monthlySalesTablet.delete(removeSalesSelect.value);
						collections.totalSales.delete("tablet");
					}
					break;
			}
		}
	} catch(error) {
		alert(error.name + " " + error.message);
	}

	// Actualizamos colección en el gráfico
	updateBarChart();
	updatePieChart();

	// Y actualizamos el gráfico de barras.
	monthlySalesChart.update();
	monthlySalesChart.render();

	// Actualizamos el gráfico de sectores.
	deptSalesChart.update();
	deptSalesChart.render();

	// Actualizasmos la vista
	initMonthlyTotalSales();
}

initMonthlyTotalSales();	// Ejecutamos esta función para que desde el inicio calcule el total de las ventas.

// * EVENT LISTENERS.

buttons.addSaleBtn.addEventListener("click", addSale);
buttons.findOver5000Btn.addEventListener("click", findOver5000);
buttons.resetChartBtn.addEventListener("click", resetMonthlySales);
buttons.showSalesBtn.addEventListener("click", drawSelectMontlySales);
buttons.deleteSaleBtn.addEventListener("click", removeMonthlySale);