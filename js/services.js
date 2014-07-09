angular.module('starter.services', [])
	
/**
 * Devuelve la lista de valores o el valor solicitado
 * Busca en la BD y hace la petición a la API si es necesario actualizar la BD
 */
 
 //Nombre de los campos de la BD
.factory('DBFields', function() {
	return {
		fields: publicFields
	}
})

 //Colores de las gráficas
.factory('ChartColors', function() {
	return {		
		0: { color: '#ae0001' },
		1: { color: 'blue' },
		2: { color: 'orange' },
		3: { color: 'green' },
		4: { color: 'purple' },
		5: { color: 'yellow' },
		6: { color: 'CornflowerBlue' },
		7: { color: 'Chartreuse' },
		8: { color: 'Crimson' }			
	}
})

//Valores de interes para el mapa
.factory('MapStore', function() {
	return {
		currentLat: 40.4167754,
		currentLon: -3.7037901999999576,
		currentZoom: 5, //10
		firstTime: true,
		types: [ "sportEvents", "congress", "courses", "awards", "culturalEvents", "corporateEvents" ],
		icons: { "sportEvents": "flaticon-basketball35", "congress": "flaticon-town1", "awards": "flaticon-trophy36", "courses": "flaticon-educative1", "culturalEvents": "flaticon-picture12", "corporateEvents": "flaticon-business60" },
		form: { "sportEvents": true, 
			"congress": true, "courses": true, "awards": true, 
			"culturalEvents": true, "corporateEvents": true, "verified": false, "myYear": '' }
	}
})

//Soporta el navegador imágenes vectoriales o no
.factory('Support', function($document) {
	return {
		supportsSvg: $document[0].implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
	}
})

//Peticiones a la BD
.factory('List', function($http, $q, $rootScope, $ionicPopup) {
	return {
		update: function() {
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnCreateDB();
			return db.deferred.promise;
		},
		 all: function(parameter) {	
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnAllDB(parameter);
			return db.deferred.promise;
		 },
		orderedList: function(parameter, type) {
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnOrderedListDB(parameter, type);	
			return db.deferred.promise;
		},
		maxTotal: function() { 
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnMaxTotalIdDB();	
			return db.deferred.promise;
		},
		listing: function(type) {
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnListingDB(type);
			return db.deferred.promise;
		},
		map: function(data) {
			var type = 'Even';
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnTypeDB(type, data);
			return db.deferred.promise;
		},
		get: function(detailId) {	
			var db = new Database($http, $q, $rootScope, $ionicPopup);
			db.returnIdhuellaDB(detailId);
			return db.deferred.promise;
		}
	}
})

//Soporte multiidioma
//Tomado de http://blog.novanet.no/creating-multilingual-support-using-angularjs/
.service('translationService', function($http) {
	this.getTranslation = function($rootScope, language) {
		var languageFilePath = 'json\\' + language + '.json';
		var ssid = 'language_' + language;
		
		function errorCB_2(data, status, headers, config) {
			console.log("Error processing SQL");
		}
		
        if (sessionStorage) {
            if (sessionStorage.getItem(ssid)) {
                $rootScope.translation = JSON.parse(sessionStorage.getItem(ssid));
            } else {			
				$http.get(languageFilePath)
					.success(function (data) {
						$rootScope.translation = data;
						sessionStorage.setItem(ssid, JSON.stringify($rootScope.translation));
					})
					.error(errorCB_2);
            };
        } else {
			$http.get(languageFilePath)
				.success(function (data) {
					$rootScope.translation = data;
				})
				.error(errorCB_2);
        }
	};
})

;
