angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $rootScope, $filter, $state, $ionicPopup, List, DBFields) {
	$rootScope.url = 'main';
	$rootScope.tab = 'main';
	
	List.update()
		.then(function(results) {
			//Huellas por tipo
			List.orderedList(DBFields.fields['type_footprint'])
				.then(function(results) {
					$scope.type = $filter('dataToChartData')(results, 'even');
					
					//% de eventos de cada tipo
					var total = $scope.type[0][1] + $scope.type[1][1] + $scope.type[2][1];
					$scope.type[0][1] =  100 * $scope.type[0][1] / total ; //Math.round(
					$scope.type[1][1] =  100 * $scope.type[1][1] / total ;
					$scope.type[2][1] =  100 * $scope.type[2][1] / total ;
					
					//Urls de las templates de cada tipo
					$scope.type[0][3] =  $filter('even_web')($scope.type[0][0]);
					$scope.type[1][3] =  $filter('even_web')($scope.type[1][0]);
					$scope.type[2][3] =  $filter('even_web')($scope.type[2][0]);			
				}, function(results) {
					//Problemas
					console.log("List.all error");
				});
        }, function(results) {
			//Problemas
			console.log($scope.translation.DATABASE_ERROR);
			alert($scope.translation.DATABASE_ERROR);
        });
})

.controller('CarbonpediaCtrl', function($scope, $rootScope, $filter, $ionicPopup, Support, List, DBFields, ChartColors) {
	$rootScope.url = 'carbonpedia';
	$rootScope.tab = 'main';
	
	if(Support.supportsSvg){ //si el navegador soporta imágenes vectoriales
		List.orderedList(DBFields.fields['verified'])
			.then(function(results) {
				$scope.verified=results;
				drawChartVerified();
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
		
		List.orderedList(DBFields.fields['type_footprint'])
			.then(function(results) {
				$scope.type=results;
				drawChartType();
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	List.maxTotal()
		.then(function(results) {
			$scope.total = results[0].total;					
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});	
	
	//Dibujamos gráfica de huellas berificadas y no verificadas
	function drawChartVerified(){
		results=$scope.verified;
		var options = {
			title: 'Huellas verificadas frente a no verificadas',
			enableInteractivity: false,
			slices: ChartColors
		};
		 $filter('drawChart')($filter('dataToChartData')(results, 'mayus'), options, 
			 'chart_verified', 'pie');	
	}
	
	//Dibujamos gráfica de huellas por tipos
	function drawChartType(){
		results=$scope.type;
		var options = {
			title: 'Distribución de los registros por tipo de huella',
			legend: { position: 'none' },
			colors: [ChartColors[0].color],
			enableInteractivity: false
		};
		$filter('drawChart')($filter('dataToChartData')(results, 'even'), 
			options, 
			'chart_type', 'bar', 'Huellas');	
	}
	
	//Dibujamos todas las gráficas
	function drawCharts(e) {
		drawChartType();
		drawChartVerified();
	}
	
	window.addEventListener("orientationchange", drawCharts, true);	 
})

.controller('EventCtrl', function($scope, $rootScope, $filter, $ionicPopup, Support, List, DBFields, ChartColors) {
	$rootScope.url = 'event';
	$rootScope.tab = 'main';
	$scope.chartColors = ChartColors;
	
	//Dibujamos gráfica de tipos de evento
	function drawChartEvenType(results){
		if(!$scope.eventType){
			$scope.eventType = $filter('dataToChartData')(results);
		}
		var options = {
			title: 'Distribución de los eventos según su tipo',
			enableInteractivity: false,
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.eventType, 
			options, 
			'chart_event_type', 'pie');	
	}
	
	if(Support.supportsSvg){
		List.orderedList(DBFields.fields['event_type'], 'Even')
			.then(function(results) {
				// $scope.eventType=results;
				drawChartEvenType(results);
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	
	window.addEventListener("orientationchange", drawChartEvenType, true);	 
	
})

.controller('EntityCtrl', function($scope, $rootScope, $filter, $ionicPopup, Support, List, DBFields, ChartColors) {
	$rootScope.url = 'entity';
	$rootScope.tab = 'main';
	$scope.chartColors = ChartColors;
	
	//Dibujamos gráfica de metodologías
	function drawChartMethodology(results){
		if(!$scope.methodology){
			$scope.methodology = $filter('dataToChartData')(results);
		}
		var options = {
			title: 'Metodología utilizada en el cálculo de las huellas de carbono',
			enableInteractivity: false,
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.methodology, 
			options, 
			'chart_methodology', 'pie');	
	}
	
	if(Support.supportsSvg){
		List.orderedList(DBFields.fields['methodology'], 'ENT')
			.then(function(results) {
				// $scope.methodology=results;
				drawChartMethodology(results);
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	
	window.addEventListener("orientationchange", drawChartMethodology, true);	 
	
})

.controller('ProductCtrl', function($scope, $rootScope, $filter, $ionicPopup, Support, List, DBFields, ChartColors) {
	$rootScope.url = 'product';
	$rootScope.tab = 'main';
	$scope.chartColors = ChartColors;

	//Dibujamos gráfica de sectores
 	function drawChartSector(results){
		if(!$scope.sector){
			$scope.sector = $filter('dataToChartData')(results, null, 3);
		}
		var options = {
			title: 'Distribución por sectores de las huellas de carbono',
			enableInteractivity: false,
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.sector, 
			options, 
			'chart_sector', 'pie');	
	}
	
	if(Support.supportsSvg){
		List.orderedList(DBFields.fields['activity_sector'], 'Prod')
			.then(function(results) {
				// $scope.sector=results;
				drawChartSector(results);
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	
	window.addEventListener("orientationchange", drawChartSector, true);	 
	
})

.controller('SearchCtrl', function($state, $scope, $rootScope, $rootScope, Support, $ionicPopup, List, DBFields) {

	$rootScope.url = 'search';
	$rootScope.tab = 'list';
	
	//Cambiamos '' por 'Todos' en el select, si procede
	$scope.functionFocus = function(names, name, text){		
		if( $scope[names][0]=='' ){
			// console.log(name + " functionFocus: " + text + " //" + $scope[names][0] + "// ");
			$scope[names][0]=text;
			if($scope.form[name]==''){
				$scope.form[name]=text;
			}
		}
	}
	
	//Cambiamos 'Todos' por '' en el select, si procede
	$scope.functionBlur = function(names, name, text){		
		if( $scope[names][0]==text && $scope.form[name]==text){
			// console.log(name + " functionBlur: " + text + " //" + $scope[names][0]  + "// ");
			$scope[names][0]='';
			$scope.form[name]='';
		}
	}
	
	//Limpia el formulario
	$scope.clearForm = function(){
		delete $rootScope.form;		
		loadForm();		
	}
	
	//Carga datos en el formulario
	function loadForm(){
		$scope.form = {};
		
		dataSelect('years', 'year', DBFields.fields['year']);
		dataSelect('cities', 'city', DBFields.fields['city']);
		dataSelect('types', 'type', DBFields.fields['type_footprint']);
		dataSelect('activities', 'activity', DBFields.fields['activity_sector']);
		
		if($rootScope.form){
			$scope.form['entity'] = $rootScope.form['entity'];
			$scope.form['product'] = $rootScope.form['product'];
		}
	}
	
	//Pasamos los valores devueltos por la BD al $scope
	function dataSelect(names, name, nameDB){
		List.listing(nameDB).then(function(results) {
			$scope[names]=[];
			for (i=0;i<results.length;i++){
				$scope[names][i] = results[i].value;
			}
			//Añadimo un primer valor vacío si no existe
			if( $scope[names][0]!='' ){
				$scope[names].unshift('');
			}
			//Cargamos el valor seleccionado previamente, si existe
			if( !$rootScope.form || !$rootScope.form[name] ){
				$scope.form[name] = $scope[names][0];
			}else{
				$scope.form[name] = $rootScope.form[name];
			}
			
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});	
	}

	//Si el dato en nulo, le ponemos el valor cadena vacía
	function dataNull(name){
		if(!$scope.form[name]){
			$scope.form[name] = '';
		}
	}	

	//Cargar datos en el formulario
	loadForm();
	
	//Hacemos la búsqedas
	$scope.searchList = function(){
	
		var parameters = {};
		dataNull('year');
		dataNull('city');
		dataNull('type');
		dataNull('activity');
		
 		if(!$scope.form.entity){
			$scope.form.entity = '';
		}
		if(!$scope.form.product){
			$scope.form.product = '';
		}
		$rootScope.form = $scope.form;
		
		//Montamos la URL del listado que mostrará el resultado de la búsqueda
		$state.transitionTo("tab.list", { "entity": encodeURIComponent($scope.form.entity), "product": encodeURIComponent($scope.form.product), 
			"city": encodeURIComponent($scope.form.city), "type": encodeURIComponent($scope.form.type), "year": encodeURIComponent($scope.form.year), "activity": encodeURIComponent($scope.form.activity) });
	}
	
})

.controller('ListCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, List, DBFields) {
	$rootScope.url = 'list';
	$rootScope.tab = 'list';
	
	$scope.fields = DBFields.fields;
	
	var parameter = {};
	if ($stateParams.year!=''){parameter["year"] = decodeURIComponent($stateParams.year)};
	if ($stateParams.city!=''){parameter["city"] = decodeURIComponent($stateParams.city)};
	if ($stateParams.type!=''){parameter["type"] = decodeURIComponent($stateParams.type)};
	if ($stateParams.activity!=''){parameter["activity"] = decodeURIComponent($stateParams.activity)};
	if ($stateParams.entity!=''){parameter["entity"] = decodeURIComponent($stateParams.entity)};
	if ($stateParams.product!=''){parameter["product"] = decodeURIComponent($stateParams.product)};
	
 	List.all(parameter)
		.then(function(results) {
			$scope.list = results;
        }, function(results) {
			//Problemas
			console.log("List.all error");
        });
		
})

.controller('DetailCtrl', function($scope, $rootScope, $stateParams, $ionicPopup, List, DBFields) {
	
	$rootScope.url = 'detail';
	$rootScope.tab = 'list';
	
	$scope.fields = DBFields.fields;
	
	List.get($stateParams.detailId)
		.then(function(results) {
				$scope.detail = results[0];
				$scope.detail.isEvent=false;
				$scope.detail.isProduct=false;
				$scope.detail.isEntity=false;
				switch($scope.detail[DBFields.fields['type_footprint']]) {
					case 'Even':
						$scope.detail.isEvent = true;
						$scope.detail.title = $scope.detail[DBFields.fields['event_product_name']];
						break;
					case 'Prod':
						$scope.detail.isProduct = true;
						$scope.detail.title = $scope.detail[DBFields.fields['event_product_name']] + " " + $scope.detail[DBFields.fields['year']];
						break;
					case 'ENT':
						$scope.detail.isEntity = true;
						$scope.detail.title = $scope.detail[DBFields.fields['entity_name']] + " " + $scope.detail[DBFields.fields['year']];
						break;
					// default:
						// return '';
				}	 
				 
				// URL de la huella en Carbonpedia http://www.ecodes.org/carbonpedia/base-de-datos/{{entity_id}}-{{entity_name_alias}}?idhuella={{footprint_id}}
				var url = 'http://www.ecodes.org/carbonpedia/base-de-datos/';
				url = url + $scope.detail[DBFields.fields['entity_id']] + '-' + $scope.detail[DBFields.fields['entity_name_alias']] + '?idhuella=' + $scope.detail[DBFields.fields['footprint_id']];
				$scope.detail.url = url;			
			}, function(results) {
				//Problemas
				console.log("List.get error");
			});	
})

.controller('MapCtrl', function($scope, $rootScope, $http, $filter, $ionicPopup, List, MapStore, DBFields) {

	$rootScope.url = 'map';
	$rootScope.tab = 'map';
	
	var change = false; 
	$rootScope.form = MapStore.form;
	$rootScope.types = MapStore.types;
	$rootScope.icons = MapStore.icons;
	
	//Si hay cambios, hacemos nueva búsqueda al recoger el panel lateral
	$scope.toggleLeftSideMenu = function(){
		if(change){
			load_events();
		}
		change = false;
	} 
	
	//Marcamos que existen cambios
	$rootScope.changeForm = function(){
		change = true;
	}
	
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([MapStore.currentLat, MapStore.currentLon], MapStore.currentZoom);	
		
	//Guardamos el zoom del mapa	
	map.on('zoomend', function(e) {
		MapStore.currentZoom = map.getZoom();
	});
	
	//Guardamos la posición del mapa
	map.on('moveend', function(e) {
		MapStore.currentLat = map.getCenter().lat;
		MapStore.currentLon = map.getCenter().lng;
	});
	
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a>' //&copy; 
	}).addTo(map);
		
	//Cargamos mapa por primera vez
	if(MapStore.firstTime){	
		map.locate({setView: true, maxZoom: MapStore.currentZoom, timeout: 10000, enableHighAccuracy: true, maximumAge: 15000});
	}	
	MapStore.firstTime = false;
	
	//Creamos el grupo al que pertenecen todos los layers
	var layerGroup = L.layerGroup();
	layerGroup.addTo(map);
	
	//Marcamos la posición del usuario
	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map);
		L.circle(e.latlng, radius).addTo(map);
	}
	function onLocationError(e) {
		console.log(e.message);
	}
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	//Situa un punto en las coordenadas dadas
	function drawPoint(lat, lon, verified, popup, layerGroup, type){
		//Clase de los iconos a crear
		var LeafIcon = L.Icon.extend({
			// Origen de los iconos:
			// http://www.apañados.es/tenemos-que-apanar/internet-tutoriales-y-trucos/419-iconos-para-google-maps.html
			// http://www.flaticon.com/packs/map-icons
			options: {
				iconSize:     [64, 64], // size of the icon
				iconAnchor:   [32, 63], // point of the icon which will correspond to marker's location
				popupAnchor:  [-3, -45] // point from which the popup should open relative to the iconAnchor
			}
		});
		
		//Elegimos el icono a utilizar
		var icon; 				
		switch(type) {
			case "Eventos deportivos":
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/sport_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/sport_no_verified.png'});
				}
				break;
			case "Congresos":
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/congress_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/congress_no_verified.png'});
				}
				break;
			case "Entregas de Premios":
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/award_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/award_no_verified.png'});
				}
				break;
			case "Cursos y jornadas":
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/course_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/course_no_verified.png'});
				}
				break;	
			case "Eventos culturales":
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/culture_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/culture_no_verified.png'});
				}
				break;	
			default: // "Eventos corporativos"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/corporate_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/corporate_no_verified.png'});
				}
				
				if(type!="Eventos corporativos"){
					console.log("Tipo invalido " + type);
				}
		} 

		var marker = L.marker([lat, lon], {icon: icon})
			.bindPopup(popup);							
		layerGroup.addLayer(marker);		
	}
		
	//Encontramos la posión de una huella y la dibujamos	
   function getPosition(qry, popup, layerGroup, verified, type) {   
   		//URL pedir coordenadas a Open Street Map
        var parameters = L.Util.extend({
            q: qry,
            format: 'json'
        }, {limit: 1});
		var api = 'http://nominatim.openstreetmap.org/search';
		var url = api + L.Util.getParamString(parameters);
		
		$http.get(url)
			.success(function(data, status, headers, config) {
				 if(data[0] && data[0].lat){
					drawPoint(data[0].lat, data[0].lon, verified, popup, layerGroup, type);
				 }
			})
			.error(function(data, status, headers, config) {
				  console.log('Error "getPosition"');
			});        
    }
	
	//Mostrar eventos en el mapa
	$scope.points = [];
	
	//Cargamos los años elegibles en el desplegable del formulario
	List.listing(DBFields.fields['year']).then(function(results) {
		$rootScope.select = [];
		$rootScope.select.years=[];
		for (i=0;i<results.length;i++){
			$rootScope.select.years[i] = results[i].value;
		}
		if( $rootScope.select.years[0]!='' ){
			$rootScope.select.years.unshift('');
		}
	}, function(results) {
		//Problemas
		console.log("List.all error");
	});
	
	//Cargar en el mapa los eventos
	function load_events(){
		//Actualizamos el formulario guardado
		MapStore.form = $rootScope.form;
		//Limpiamos el mapa
		layerGroup.clearLayers();
		//Buscamos los eventos y los mostramos
		List.map($rootScope.form)
			.then(function(results) {
				$scope.points = results; 
				var popup = null;
				for (var i in $scope.points) {
					var city = null;
					var country = null;
					var newPopup = null;
					var verified = null;
					
					verified = $scope.points[i][DBFields.fields['verified']];
					verified = $filter('mayus')(verified);
					verified = $filter('boolean')(verified);	
							
					//Construimos el link a las fichas de los eventos		
					//<a href="#/tab/detail/68">Link text</a>
					newPopup='<a href="#/tab/detail_map/' + $scope.points[i][DBFields.fields['footprint_id']]+'">';
					if ($scope.points[i][DBFields.fields['event_product_name']]){
						newPopup = newPopup + $scope.points[i][DBFields.fields['event_product_name']];
					}
					newPopup=newPopup + '</a>';
					
					//ya tenemos situado el punto
					if($scope.points[i][DBFields.fields['lat']] && $scope.points[i][DBFields.fields['lng']]){
						drawPoint($scope.points[i][DBFields.fields['lat']], $scope.points[i][DBFields.fields['lng']], 
							verified, newPopup, layerGroup, $scope.points[i][DBFields.fields['event_type']]);
					}else{
						//tenemos datos como para localizar el punto
						if($scope.points[i][DBFields.fields['city']] && $scope.points[i][DBFields.fields['city']]!="Varias Localidades"){
							city = $scope.points[i][DBFields.fields['city']];
							if($scope.points[i][DBFields.fields['country']]){
								country = $scope.points[i][DBFields.fields['country']];
							}else{
								country = 'España';
							}
							
							//Si estará en la mismas coordenadas que el punto anterior, unimos el texto
							// if($scope.points[i-1] && 
									// $scope.points[i][DBFields.fields['city']] == $scope.points[i-1][DBFields.fields['city']] && 
									// $scope.points[i][DBFields.fields['country']] == $scope.points[i-1][DBFields.fields['country']]){
								// popup = popup + '<br/>' +  newPopup;
							// }else{
								popup = newPopup;
							// }
							
							//Si estará en las mismas coordendas que el punto siguiente, no dibujamos, por ahora
							// if(!$scope.points[i+1] || 
									// $scope.points[i][DBFields.fields['city']] != $scope.points[i+1][DBFields.fields['city']] || 
									// $scope.points[i][DBFields.fields['country']] != $scope.points[i+1][DBFields.fields['country']] || 
									// $scope.points[i][DBFields.fields['address']] != $scope.points[i+1][DBFields.fields['address']]){
								getPosition($scope.points[i][DBFields.fields['address']] + ", " + city + ', ' +  country, popup, layerGroup, verified, $scope.points[i][DBFields.fields['event_type']]);
							// }
						}
					}
				}		
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	
	// Comentado para ahorrar peticiones
	// Cargar huellas en el mapa
	// load_events();
})

;