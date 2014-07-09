angular.module('phonecatFilters', [])

//Dado el valor de la BD nos da equivalente amigable
.filter('even', function() {
  return function(input) {
	//'Even' 'Prod' 'ENT' 
	switch(input) {
		case 'Even':
			return 'Evento';
			break;
		case 'Prod':
			return 'Producto';
			break;
		case 'ENT':
			return 'Entidad';
			break;
		default:
			return input; //'';
	}	
  };
})

//Dado el valor de la BD nos da el parámetro de la URL que le corresponde
.filter('even_web', function() {
  return function(input) {
	//'Even' 'Prod' 'ENT' 
	switch(input) {
		case 'Even':
			return 'event';
			break;
		case 'Prod':
			return 'product';
			break;
		case 'ENT':
			return 'entity';
			break;		
		case 'Evento':
			return 'event';
			break;
		case 'Producto':
			return 'product';
			break;
		case 'Entidad':
			return 'entity';
			break;
		default:
			return '';
	}	
  };
})

//Devolvemos la cadena con mayuscula solo en la primera letra
.filter('mayus', function() {
  return function(input) {
	if(input){
		return input.charAt(0).toUpperCase() + input.toLowerCase().slice(1);
	}else{
		return '';
	}
  };
})

//Transforma de booleano a cadena y al contrario
.filter('boolean', function() {
  return function(input) {
	switch(input) {
		case 'Si':
			return true;
			break;
		case 'No':
			return false;
			break;
		case true:
			return 'Si';
			break;
		default:
			return 'No';
	}	
  };
})

//Devuelve el campo value
.filter('value', function() {
  return function(input) {
	return input.value;	
  };
})

//Procesa los datos para adaptarlos a ser procesador para una gráfica
.filter('dataToChartData', function($filter) { //$filter('dataToChartData')
  return function(list, filter, max) {
	var values = [];
	var extra = 0;
	n=list.length;
	if(n>12){ n= 7; } //Si son pocos campos mostramos todos
	for (i = 0; i < n; i++) { 
		if(!max || i<=max){
			if(filter){
				values[values.length] = [
					$filter(filter)(list[i].name), 
					list[i].total
					];
			}else{
				values[values.length] = [
						list[i].name, 
						list[i].total
						];
			}
		}else{
			extra = extra + list[i].total;
		}
	}
	//Si eran muchos campos, formamos un campo resumen
	if(i>max){
		values[values.length] = [
			'Resto', 
			extra
			];
	}
	return values;
};
})

//Dibuja una gráfica
.filter('drawChart', function($filter) { //$filter('drawChart')
	return function(values, options, element, type, head) {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Topping');
		if(!head){ head='Slices'; }
		data.addColumn('number', head);
		data.addRows(values);
		
		var chart;
		if(type=='bar'){
			chart = new google.visualization.BarChart(document.getElementById(element));
		}else{
			chart = new google.visualization.PieChart(document.getElementById(element));
		}
		chart.draw(data, options);
		return chart;
	};
})

//Genera un rango numérico
.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
})

;