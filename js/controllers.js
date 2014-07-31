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
		
		$scope.click = function(type){
			$state.transitionTo("tab." + $scope.type[type][3]);
		}
		
})

.controller('CarbonpediaCtrl', function($scope, $rootScope, $filter, $ionicPopup, Support, List, DBFields, ChartColors) {
	$rootScope.url = 'carbonpedia';
	$rootScope.tab = 'main';
	$scope.chartColors = ChartColors;
	$scope.supportsSvg = Support.supportsSvg;
	
	List.orderedList(DBFields.fields['verified'])
		.then(function(results) {
			drawChartVerified(results);
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});
	
	List.orderedList(DBFields.fields['type_footprint'])
		.then(function(results) {
			drawChartType(results);
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});
			
	List.maxTotal()	
		.then(function(results) {
			$scope.total = results[0].total;					
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});	
	
	//Dibujamos gráfica de huellas verificadas y no verificadas
	function drawChartVerified(results){
		if(!$scope.verified){
			$scope.verified=$filter('dataToChartData')(results, 'mayus');
		}
		// $scope.verifiedTitle= 'Huellas verificadas frente a no verificadas';
		var options = {
			// title: $scope.verifiedTitle,
			slices: ChartColors
		};
		 $filter('drawChart')($scope.verified, options, 
			 'chart_verified', 'pie', Support.supportsSvg);	
	}
	
	//Dibujamos gráfica de huellas por tipos
	function drawChartType(results){
		if(!$scope.type){
			$scope.type=$filter('dataToChartData')(results, 'even');
		}
		// $scope.typeTitle = 'Distribución de los registros por tipo de huella';
		var options = {
			// title: $scope.typeTitle,
			legend: { position: 'none' },
			colors: [ChartColors[0].color],
			slices: ChartColors,
		};
		$filter('drawChart')($scope.type, 
			options, 
			'chart_type', 'bar', Support.supportsSvg, 'Huellas');
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
			$scope.eventType = $filter('dataToChartData')(results, 'type_even');
		}
		var options = {
			title: 'Distribución de los eventos según su tipo',
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.eventType, 
			options, 
			'chart_event_type', 'pie', Support.supportsSvg);	
	}
	
	List.orderedList(DBFields.fields['event_type'], 'Even')
		.then(function(results) {
			drawChartEvenType(results);
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});
	
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
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.methodology, 
			options, 
			'chart_methodology', 'pie', Support.supportsSvg);	
	}
	
	List.orderedList(DBFields.fields['methodology'], 'ENT')
		.then(function(results) {
			drawChartMethodology(results);
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});
	
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
			legend: 'none',
			chartArea: {  width: "100%", height: "100%" },
			slices: ChartColors
		};
		$filter('drawChart')($scope.sector, 
			options, 
			'chart_sector', 'pie', Support.supportsSvg);	
	}
	
	List.orderedList(DBFields.fields['activity_sector'], 'Prod')
		.then(function(results) {
			drawChartSector(results);
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});
	
	window.addEventListener("orientationchange", drawChartSector, true);	 
	
})

.controller('SearchCtrl', function($state, $scope, $rootScope, $rootScope, Support, $ionicPopup, List, DBFields) {

	$rootScope.url = 'search';
	$rootScope.tab = 'list';	
	  
	//Solo en webkit se muestran bien los select
	if (Support.webkit){
		$scope.okSelect = 'select';
	}else{
		$scope.okSelect = 'no-select';
	}
	
	//Cambiamos '' por 'Todos' en el select, si procede
	$scope.functionFocus = function(names, name, text){
		if(oldVersion(window)){
			functionOldFocus($state, 'formSearch', name, text, "tab.select-list");
		}else{
			functionFocus($scope, null, names, $rootScope, 'formSearch', name, text);
		}
	}
	
	//Cambiamos 'Todos' por '' en el select, si procede
	$scope.functionBlur = function(names, name, text){
		functionBlur($scope, null, names, $rootScope, 'formSearch', name, text, $state);
	}
	
	//Limpia el formulario
	$scope.clearForm = function(){
		delete $rootScope.formSearch;		
		loadForm();		
	}
	
	//Carga datos en el formulario
	function loadForm(){
		$scope.form = {};
		if( !$rootScope.formSearch ){
			$rootScope.formSearch = {};
		}
		dataSelect('years', 'year', DBFields.fields['year']);
		dataSelect('cities', 'city', DBFields.fields['city']);
		dataSelect('types', 'type', DBFields.fields['type_footprint']);
		dataSelect('activities', 'activity', DBFields.fields['activity_sector']);
	}
	
	//Pasamos los valores devueltos por la BD al $scope
	function dataSelect(names, name, nameDB){
		List.listing(nameDB).then(function(results) {
			$scope[names]=[];
			f=0;
			for (i=0;i<results.length;i++){
				if(results[i].value != null && results[i].value != ''){
					$scope[names][f] = results[i].value;
					f=f+1;
				}
			}
			
			//Añadimo un primer valor vacío
			$scope[names].unshift('');
			
			//Cargamos el valor seleccionado previamente, si existe
			if( !$rootScope.formSearch || !$rootScope.formSearch[name] ){
				$rootScope.formSearch[name] = $scope[names][0];
			}
			
		}, function(results) {
			//Problemas
			console.log("List.all error");
		});	
	}

	//Si el dato en nulo, le ponemos el valor cadena vacía
	function dataNull(name){
		if(!$rootScope.formSearch[name] || $rootScope.formSearch[name]=='Todos' || $rootScope.formSearch[name]=='Todas'){
			$rootScope.formSearch[name] = '';
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
		
 		if(!$rootScope.formSearch.entity){
			$rootScope.formSearch.entity = '';
		}
		if(!$rootScope.formSearch.product){
			$rootScope.formSearch.product = '';
		}
		
		//Montamos la URL del listado que mostrará el resultado de la búsqueda
		$state.transitionTo("tab.list", { "entity": encodeURIComponent($rootScope.formSearch.entity), 
											"product": encodeURIComponent($rootScope.formSearch.product), 
											"city": encodeURIComponent($rootScope.formSearch.city), 
											"type": encodeURIComponent($rootScope.formSearch.type), 
											"year": encodeURIComponent($rootScope.formSearch.year), 
											"activity": encodeURIComponent($rootScope.formSearch.activity) });
	}
	
})

//Sustituye a los select en versiones antiguas de Android
.controller('SelectListCtrl', function( $scope, $rootScope, $stateParams, 
							$filter, $ionicNavBarDelegate, $ionicScrollDelegate, 
							$ionicSideMenuDelegate, List, DBFields) {
	$rootScope.url = 'select-list';
	$rootScope.tab = 'list';
	
	if ($stateParams.variable!=''){nameDB = decodeURIComponent($stateParams.variable)};
	if ($stateParams.form!=''){form = decodeURIComponent($stateParams.form)};
	if ($stateParams.text!=''){text = decodeURIComponent($stateParams.text)};
	// console.log("nameDB " + nameDB);
	name=nameDB;
	//Los nombres usados no coincidían con los de BD
	if ('type_footprint'.indexOf(name)>=0) {
		name='type_footprint';
	}
	if ('activity_sector'.indexOf(name)>=0) {
		name='activity_sector';
	}
	var condition=0;
	var value=0;
	//Hemos llegado desde el mapa
	if ('myYear'.indexOf(name)>=0) {
		name='year';
		$rootScope.map_menu=true;
		condition=DBFields.fields['type_footprint'];
		value='Even';
		//Recogemso el menú lateral
		$ionicSideMenuDelegate.toggleLeft();
	}
	
	$scope.updateForm = function(value){
		if (name=='type_footprint') {
			value = $filter('even')(value);		}
		
		if(value==text){
			value='';
		}		
		$rootScope[form][nameDB] = value;
		$ionicNavBarDelegate.back(); //Volver a la pantalla anterior
	}
	
	List.listing(DBFields.fields[name], condition, value).then(function(results) {
		$scope.list=[];
		for (i=0;i<results.length;i++){
			$scope.list[i] = results[i].value;
			if (name=='type_footprint') {
				$scope.list[i] = $filter('even')($scope.list[i]);
			}
		}
		if( $scope.list[0]=='' ){
			$scope.list[0]=text;
		}else{
			$scope.list.unshift(text);
		}
		$ionicScrollDelegate.resize();
	})
	$scope.title="Seleccionar";	
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

.controller('MapCtrl', function($scope, $rootScope, $state, $http, $ionicSideMenuDelegate, 
								$filter, $ionicPopup, Support, List, MapStore, DBFields) {

	$rootScope.url = 'map';
	$rootScope.tab = 'map';
	
	//Solo en webkit se muestran bien los select
	if (Support.webkit){
		$rootScope.okSelect = 'select';
	}else{
		$rootScope.okSelect = 'no-select';
	}
	
	//Cambiamos '' por 'Todos' en el select, si procede
	$rootScope.functionFocus = function(names, name, text, preNames){	
		if(oldVersion(window)){
			functionOldFocus($state, 'form', name, text, 'tab.select-list_map');
		}else{
			functionFocus($rootScope, preNames, names, $rootScope, 'form', name, text);
		}
	}
	
	//Cambiamos 'Todos' por '' en el select, si procede
	$rootScope.functionBlur = function(names, name, text, preNames){		
		functionBlur($rootScope, preNames, names, $rootScope, 'form', name, text);
	}
	
	$rootScope.form = MapStore.form;
	$rootScope.types = MapStore.types;
	$rootScope.icons = MapStore.icons;
	
	//Marcamos que existen cambios
	$rootScope.changeForm = function(){
		load_events();
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
	var layerGroup = new L.MarkerClusterGroup({
		 maxClusterRadius: 30,
		 spiderfyDistanceMultiplier: 2
	}); //L.layerGroup();
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
			case "deportivo": //deportivo "Eventos deportivos"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/sport_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/sport_no_verified.png'});
				}
				break;
			case "congresos": //congresos "Congresos"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/congress_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/congress_no_verified.png'});
				}
				break;
			case "premios": //premios "Entregas de Premios"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/award_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/award_no_verified.png'});
				}
				break;
			case "corporativos": //corporativos "Eventos corporativos"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/corporate_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/corporate_no_verified.png'});
				}
				break;
			case "culturales": //culturales "Eventos culturales"
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/culture_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/culture_no_verified.png'});
				}
				break;	
			default: // "Cursos y jornadas" cursos		
				if(verified){
					icon = new LeafIcon({iconUrl:  'img/map_icon/course_verified.png'});
				}else{
					icon = new LeafIcon({iconUrl:  'img/map_icon/course_no_verified.png'});
				}
				if(type!="cursos"){
					console.log("Tipo invalido /" + type + "/");
				}
		} 

		var marker = L.marker([lat, lon], {icon: icon})
			.bindPopup(popup);							
		layerGroup.addLayer(marker);		
	}		
	
	//Mostrar eventos en el mapa
	$scope.points = [];
	
	//Cargamos los años elegibles en el desplegable del formulario
	List.listing(DBFields.fields['year'], DBFields.fields['type_footprint'], 'Even').then(function(results) {
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
						drawPoint($scope.points[i][DBFields.fields['lat']], 
								$scope.points[i][DBFields.fields['lng']], verified, 
								newPopup, layerGroup, $scope.points[i][DBFields.fields['event_type']]);			

					}
				}		
			}, function(results) {
				//Problemas
				console.log("List.all error");
			});
	}
	
	// Cargar huellas en el mapa
	load_events();
})

;