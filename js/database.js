/**
* Objeto que interactua con la BD
*/

//La api no está disponible y usamos directamente la BD
//caso especial al meter la web en el dominio...
var no_api = false;

//Campos de la BD (nombre de los campos)
var publicFields = {'footprint_id': 'footprint_id', 
	'entity_id': 'entity_id', 'type_footprint': 'type_footprint', 'year': 'year', 
	'city': 'city', 'country': 'country',  'methodology': 'methodology', 
	'unit_measure': 'unit_measure', 'characteristic_unit_entity': 'characteristic_unit_entity', 
	'scope_3_categories_including': 'scope_3_categories_including', 'scope_study': 'scope_study', 
	'duration_days_event': 'duration_days_event', 'total_emissions': 'total_emissions', 
	'ratio_functional_unit': 'ratio_functional_unit', 'ratio_day_event': 'ratio_day_event', 
	'event_product_name': 'event_product_name', 'verified': 'verified', 
	'entity_name_alias': 'entity_name_alias', 'entity_name': 'entity_name', 
	'activity_sector': 'activity_sector', 'lat': 'lat', 'lng': 'lng', 
	'event_type': 'event_type', 'address': 'address'};

var Database = function (http, q, scope, ionicPopup) {

	var db;
	var dbSize = 300 * 1024; // bytes
	
	var table = 'huellas';
	var introFields = publicFields;
	
	var noApiWhere = " h.Estado=1 ";
	
	if(no_api){ 
		//Tablas sobre las que se actua si usamos la BD original de Carbonpedia
		table = 'huellas h inner join cp_contact_details c on c.id = h.v1_2';
		//Nombre de los campos si usamos la BD original de Carbonpedia
		introFields = {'footprint_id': 'h.id', 
			'entity_id': 'c.id', 'type_footprint': 'h.v1_1', 'year': 'h.v1_10', 
			'city': 'h.v1_8_7', 'country': 'h.v1_8_8',  'methodology': 'h.v1_11_1', 
			'unit_measure': 'h.v1_12', 'characteristic_unit_entity': 'h.v1_13_1', 
			'scope_3_categories_including': 'h.v1_14_1', 'scope_study': 'h.v1_14_2', 
			'duration_days_event': 'h.v1_16_3', 'total_emissions': 'h.v1_18', 
			'ratio_functional_unit': 'h.v1_20_1', 'ratio_day_event': 'h.v1_21_7', 
			'event_product_name': 'h.v1_4_2', 'verified': 'h.v1_27', 'entity_name_alias': 'c.alias', 'entity_name': 'c.name', 
			'activity_sector': 'c.sortname2', 'lat': 'h.lat', 'lng': 'h.lng', 
			'event_type': 'h.tipo_evento', 'address': 'h.tipo_direccion'};
	}else{
		db = window.openDatabase("carbonpedia", "1.0", "Carbonpedia DB", dbSize);
	}
	
	//Escribir en consola y pantalla
	function console_write(texts){
		alert(texts);
		console.log(texts);
	}

	//Especie de semáforo para la sincronización
	this.deferred = q.defer();	
	var deferred = this.deferred;
	
	//Lanzamos una función en transaction si tenemos la BD en local
	function launchFunctionSQL(launchFunction, parameter1, parameter2, parameter3){
		if(!no_api){ 
			db.transaction(
				function(tx) {
					 launchFunction(tx, parameter1, parameter2, parameter3);
				}, errorCB);
		}else{
			launchFunction(null, parameter1, parameter2, parameter3);
		}
	}
	
	//Eventos públicos que son llamados desde los service
	this.returnAllDB = function(parameter) {
		launchFunctionSQL(allDB, parameter);	
	}
	
	this.returnTypeDB = function(type, data) {
		launchFunctionSQL(typeDB, type, data);		
	}	
	
	this.returnIdhuellaDB = function(detailId) {
		launchFunctionSQL(idhuellaDB, detailId);		
	}	
	
	this.returnOrderedListDB = function(parameter, type) {
		launchFunctionSQL(orderedListDB, parameter, type);
	}
	
	this.returnListingDB = function(type, condition, value) {
		launchFunctionSQL(listingDB, type, condition, value);
	}
	
	this.returnMaxTotalIdDB = function() {
		launchFunctionSQL(maxFootprintDB);
	}
	
	this.returnCreateDB = function(detailId) {
		var week = 7*24*60*60*1000;
		var now = new Date().getTime();
		var time = parseInt(window.localStorage.getItem("time"));
		var networkState=true;
		if(navigator.connection){
			networkState = navigator.connection.type;
			networkState = (networkState != Connection.NONE);
			// alert(networkState + " " + navigator.connection.type);
		}
		
		 if ((!time || (time+week) < now) && !no_api && networkState){
			var db = window.openDatabase("carbonpedia", "1.0", "Carbonpedia DB", dbSize);
			window.localStorage.removeItem("time");
			window.localStorage.removeItem("1");
			window.localStorage.removeItem("2");
			window.localStorage.removeItem("3");
			db.transaction(createDB, errorCB, successCreateBD);			
		 }else{
			deferred.resolve();
		 }
	}	
		
/* 		 	Todos los campos del API
		idhuella, identidad, v1_1, v1_2, v1_10, v1_8_7, v1_8_8, v1_11_1, v1_11_2, v1_12, ' + 
		'v1_13_1, v1_13_4, v1_14, v1_14_1, Campo14, Campo15, v1_14_2, v1_16_3, ' + 
		'v1_18, v1_18_1, v1_18_2, v1_18_3, v1_20_1, v1_20_2_1, v1_20_2_2, v1_20_3, v1_20_4, ' +
		'v1_20_5, v1_20_7, v1_21_1, v1_21_2_1, v1_21_2_2, v1_21_3, v1_21_4, v1_21_5, v1_21_7, v1_4_2, ' +
		'v1_24, v1_25_1, v1_25_2, v1_25_3, v1_25_4, v1_26_1, v1_26_3, v1_26_4, v1_26_5, v1_26_6, v1_26_7, ' +
		'v1_26_8, v1_27, v1_28, v1_29, v1_30, v1_31_1, v1_31_3, v1_31_4, v1_31_5, v1_31_6, v1_31_7, ' +
		'v1_31_8, v1_32, Alias, Nombre, Entidad, Actividad, ' + 
		'lat, lng, tipo_evento, tipo_direccion */
		
	//Campos usamos de la BD (+ el id de la huella)	
	var useFields = ['entity_id', 'type_footprint', 'year', 'city', 'country',  'methodology', 'unit_measure',
		'characteristic_unit_entity', 'scope_3_categories_including', 'scope_study', 'duration_days_event', 
		'total_emissions', 'ratio_functional_unit', 'ratio_day_event', 'event_product_name',
		'verified', 'entity_name_alias', 'entity_name', 'activity_sector',
		'lat', 'lng', 'event_type', 'address'];	
	
	//Nombre original de los campos en la API
	var originalFields = {'footprint_id': 'idhuella', 
		'entity_id': 'identidad', 'type_footprint': 'v1_1', 'year': 'v1_10', 
		'city': 'v1_8_7', 'country': 'v1_8_8',  'methodology': 'v1_11_1', 
		'unit_measure': 'v1_12', 'characteristic_unit_entity': 'v1_13_1', 
		'scope_3_categories_including': 'v1_14_1', 'scope_study': 'v1_14_2', 
		'duration_days_event': 'v1_16_3', 'total_emissions': 'v1_18', 
		'ratio_functional_unit': 'v1_20_1', 'ratio_day_event': 'v1_21_7', 
		'event_product_name': 'v1_4_2', 'verified': 'v1_27', 'entity_name_alias': 'Alias', 'entity_name': 'Nombre', 
		'activity_sector': 'Actividad', 'lat': 'lat', 'lng': 'lng', 
		'event_type': 'tipo_evento', 'address': 'tipo_direccion'};
		
	// Se crea la tabla que utilizaremos, se elimina si ya existía
	function createDB(tx) {	
		
		tx.executeSql('DROP TABLE IF EXISTS '+ table);
		var sql = 'CREATE TABLE IF NOT EXISTS ' + table + ' ( ' + publicFields['footprint_id'] + ' integer unique';		
		for (f in useFields) {
			sql = sql + ", " + publicFields[useFields[f]];
		}		
		sql = sql +	' )';
		
		tx.executeSql(sql);
	}
	
	// Se insertan en la tabla los datos
	function updateDB(data, tx) {	
		for (i in data.huellas) {	
			var sql = 'INSERT INTO ' + table + ' ( ' + publicFields['footprint_id'];
			for (f in useFields) {
				sql = sql + ", " + publicFields[useFields[f]];
			}	
			sql = sql + ') VALUES ( ?'	
			for (f in useFields) {
				sql = sql + ", " + '?';
			}	
			sql = sql + ' )';
			
			
			//Corrección necesaria para usar el campo
			data.huellas[i][originalFields['verified']] = data.huellas[i][originalFields['verified']].toLowerCase().replace('\xED','i');
			
			//Corrección necesaria para usar el campo
			data.huellas[i][originalFields['methodology']] = data.huellas[i][originalFields['methodology']].replace('GHG Prototol Corporate standard', 'GHG Protocol Corporate standard');
			
			var values = [data.huellas[i][originalFields['footprint_id']]];
			for (f in useFields) {
				values[values.length] = data.huellas[i][originalFields[useFields[f]]];
			}
			
			tx.executeSql(sql, values);
		}
	}
	
	//Se solicita un idhuella
	function idhuellaDB(tx, idhuella) {
		var values = ['entity_name', 'event_product_name', 'activity_sector', 'year', 
			'type_footprint', 'city', 'country', 'total_emissions', 
			'ratio_day_event', 'footprint_id', 'entity_id', 'entity_name_alias', 'lat', 'lng', 
			'duration_days_event', 'verified', 'ratio_functional_unit', 'characteristic_unit_entity',
			'unit_measure', 'scope_study', 'scope_3_categories_including', 'event_type'
		];
		var sql = 'SELECT ' + addComma(values) + ' FROM ' + table + ' WHERE ' + introFields['footprint_id'] + '=?';
		var sqlValues = [idhuella];
		if(!no_api){
			tx.executeSql(sql, sqlValues, querySuccess, errorCB);
		}else{
			sql = 'SELECT ' + addComma(values) + ' FROM ' + table + ' WHERE ' + noApiWhere + ' and ' + introFields['footprint_id'] + '=?';
			executeSql(sql, sqlValues, querySuccessNoAPI, errorCB);
		}
	}
	
	//Se solicita el idhuella máximo
	function maxFootprintDB(tx, functionName) { // successMaxFootprintDB querySuccess
		if(!functionName){
			if(!no_api){
				functionName=querySuccess;
			}else{
				functionName=querySuccessNoAPI;
			}			
		}
		var values = "MAX(" + introFields['footprint_id'] + ") AS " + publicFields['footprint_id'] + ", " 
		+ introFields['entity_name'] + ", COUNT(" + introFields['footprint_id'] + ") AS total";
		var sql = 'SELECT ' + values + ' FROM ' + table;
		var sqlValues = [];
		if(!no_api){
			tx.executeSql(sql, sqlValues, functionName, errorCB);
		}else{
			sql = sql + ' WHERE ' + noApiWhere;
			executeSql(sql, sqlValues, functionName, errorCB);
		}
	}
	
	//Se solicita el idhuella máximo
	function topFootprintDB(max, tx) {
		var values = ['footprint_id', 'entity_name'];
		values = addComma(values);
		var sql = 'SELECT ' + values + ' FROM ' + table + ' WHERE ' + introFields['footprint_id'] + ' > ?';
		var sqlValues = [max];
		tx.executeSql(sql, sqlValues, successTopFootprintDB, errorCB);
	}
	
	//Se solicita un tipo
	function typeDB(tx, type, data) {
	
		var sqlValues = [type];
		var whereYear = "";
		var values = ['entity_name', 'event_product_name', 'activity_sector', 'year', 'type_footprint',
			'city', 'country', 'total_emissions', 'ratio_day_event', 'footprint_id', 'entity_id', 
			'entity_name_alias', 'lat', 'lng', 'verified',
			'event_type', 'address'
		];
		values = addComma(values);
		
		//Se elimina un tipo de evento de la búsqueda
		function sqlEvents(event, nameEvent){
			if(data && !data[event]){
				sqlValues[sqlValues.length] = nameEvent;
				whereYear = whereYear + " AND " + introFields['event_type'] + "!=? ";
			}
		}
			
		if(data && data.myYear && data.myYear!='' && !isNaN(data.myYear)){
			sqlValues[sqlValues.length] = data.myYear;
			whereYear = whereYear + " AND " + introFields['year'] + "=? ";
		}
		
		if(data && data.verified){
			sqlValues[sqlValues.length] = "s%";
			whereYear = whereYear + " AND " + introFields['verified'] + " LIKE ? ";
		}
		
		sqlEvents("sportEvents", "deportivo");
		sqlEvents("congress", "congresos");
		sqlEvents("courses", "cursos");
		sqlEvents("awards", "premios");
		sqlEvents("culturalEvents", "culturales");
		sqlEvents("corporateEvents", "corporativos");
		var sql = 'SELECT ' + values + ' FROM ' + table + ' WHERE ' + introFields['type_footprint'] + '=? ' 
			+ whereYear + 'ORDER BY ' + introFields['lat'] + ', ' + introFields['lng'] + ', '
			+ introFields['city'] + ' DESC, ' + introFields['country'];
		if(!no_api){	
			tx.executeSql(sql, sqlValues, querySuccess, errorCB);
		}else{
			sql = 'SELECT ' + values + ' FROM ' + table + ' WHERE ' 
				+ noApiWhere + ' and ' + introFields['type_footprint'] + '=? ' 
				+ whereYear + 'ORDER BY ' + introFields['lat'] + ', ' + introFields['lng'] + ', '
				+ introFields['city'] + ' DESC, ' + introFields['country'];
			executeSql(sql, sqlValues, querySuccessNoAPI, errorCB);
		}
	}
	
	//Añade un parámetro a la búsqueda
	function addParameterWhere(parameter, dataWhere, nameParameter, nameDB, addText){
		var where = "";
		if(parameter[nameParameter]){
			if(dataWhere.length) { where = where + " AND "; }
			if(addText){
				//Procesamos las cadenas de texto para no tener en cuenta mayusculas o minusculas o tildes
				parameter[nameParameter] = parameter[nameParameter].toLowerCase();
				// parameter[nameParameter] = parameter[nameParameter].replace(/^\s+/,'').replace(/\s+$/,'');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[o]/gi,'\xF2');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[\xF2\xF3\xF6]/gi,'[o\xF2\xF3\xF6]');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[e]/gi,'\xE8');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[\xE8\xE9\xEB]/gi,'[e\xE8\xE9\xEB]');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[u]/gi,'\xF9');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[\xF9\xFA\xFC]/gi,'[u\xF9\xFA\xFC]');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[a]/gi,'\xE0');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[\xE0\xE1\xE4]/gi,'[a\xE0\xE1\xE4]');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[i]/gi,'\xEC');
				// parameter[nameParameter] = parameter[nameParameter].replace(/[\xEC\xED\xEF]/gi,'[i\xEC\xED\xEF]');
				addText='%';
				parameter[nameParameter] = addText + parameter[nameParameter] + addText;
				// where = where + " lower(" + nameDB + ") REGEXP ? ";
				where = where + " lower(" + nameDB + ") LIKE ? ";
			}else{
				where = where + " " + nameDB + " LIKE ? ";
			}			
			dataWhere[dataWhere.length] = parameter[nameParameter];
		}
		return where;
	}
	
	//Se solicitan todos los datos que cumplen las condiciones de búsqueda
	function allDB(tx, parameter) {
		var sqlValues = [];
		var values = ['entity_name', 'event_product_name', 'activity_sector', 'year', 'type_footprint',
			'city', 'country', 'total_emissions', 'ratio_day_event', 'footprint_id', 'entity_id',
			'entity_name_alias', 'lat', 'lng'
		];	
		values = addComma(values);	
		var where = "";	
		
		where = where + addParameterWhere(parameter, sqlValues, 'year', introFields['year']);
		where = where + addParameterWhere(parameter, sqlValues, 'city', introFields['city']);
		where = where + addParameterWhere(parameter, sqlValues, 'type',  introFields['type_footprint']);
		where = where + addParameterWhere(parameter, sqlValues, 'activity',  introFields['activity_sector']);
		where = where + addParameterWhere(parameter, sqlValues, 'entity',  introFields['entity_name'], '.*');
		where = where + addParameterWhere(parameter, sqlValues, 'product',  introFields['event_product_name'], '.*');
		
		if(sqlValues.length){
			where = " WHERE " + where;
		}			
		  
		var whereEnd = " ORDER BY (TRIM(COALESCE("+ introFields['event_product_name'] 
			  + ',"")) || "" ||  TRIM(' + introFields['entity_name'] + ")), TRIM(" + introFields['year'] + ")";		
			  
		var sql = 'SELECT ' + values + ' FROM ' + table + ' ' + where + whereEnd;

		if(!no_api){
			tx.executeSql(sql, sqlValues, querySuccess, errorCB);
		}else{
			whereEnd = " ORDER BY concat(TRIM(COALESCE("+ introFields['event_product_name'] 
			  + ',"")), TRIM(' + introFields['entity_name'] + ")), TRIM(" + introFields['year'] + ")";	
			if(sqlValues.length){
				where = where + ' AND ' + noApiWhere;
			}else{
				where = where + ' WHERE ' + noApiWhere;
			}
			sql = 'SELECT ' + values + ' FROM ' + table + ' ' + where + whereEnd;
			executeSql(sql, sqlValues, querySuccessNoAPI, errorCB);
		}
	}
	
	//Se solicitan los registros ordenados por huellas de carbono
	function orderedListDB(tx, parameter, type) {
		var sqlValues = [];	

		var values = introFields[parameter] + " AS name, count(" + introFields['footprint_id'] + ") AS total";
		var where = "";
		if(type){
			where = where + ' ' + introFields['type_footprint'] + '  = ' + '?' + " AND ";
			sqlValues[sqlValues.length] = type;
		}
		where = where + introFields[parameter] + " != '' GROUP BY " + introFields[parameter] + " ORDER BY total DESC";
		var sql = 'SELECT ' + values + ' FROM ' + table + ' WHERE ' + where;
		if(!no_api){
			tx.executeSql(sql, sqlValues, querySuccess, errorCB);	
		}else{
			sql = 'SELECT ' + values + ' FROM ' + table + ' WHERE ' + noApiWhere + ' and ' + where;
			executeSql(sql, sqlValues, querySuccessNoAPI, errorCB);
		}
	}
	
	//Se solicitan un listado de todos los parámetros de un tipo
	function listingDB(tx, type, condition, value) {
		var sqlValues = [];
		
		var values = introFields[type] + " AS value";
		
		var cond = " ";
		if(condition && value){
			cond = " WHERE " + introFields[condition] + " = ? " 
			sqlValues[sqlValues.length] = value;
		}
		
		var where = "GROUP BY " + "lower( " + introFields[type] + " ) " + " ORDER BY " + introFields[type];
		if(type == publicFields['year']){
			where = where + " DESC";
		}
		var sql = 'SELECT ' + values + ' FROM ' + table + '  ' + cond + ' ' + where;
		
		if(!no_api){
			tx.executeSql(sql, sqlValues, querySuccess, errorCB);
		}else{
			if(cond == " "){
				cond = ' WHERE ' + noApiWhere;
			}else{
				cond = cond + ' and ' + noApiWhere;
			}
			sql = 'SELECT ' + values + ' FROM ' + table + '  ' + cond + ' ' + where;
			executeSql(sql, sqlValues, querySuccessNoAPI, errorCB);
		}
	}
	
	//Mostramos un mensaje de error por el fallo producido
	function errorCB(tx, err) {
		deferred.reject();
		console_write("Error processing SQL: "+err);
	}

	//Mostramos un mensaje de error por el fallo producido
	function errorCB_2(data, status, headers, config) {
		deferred.reject();
		console_write("Error processing SQL");
	}
		
	//Se ha creado la BD 
	// entonces pedimos los datos que necesitamos para rellenarla
	// cuando vayan llegando se rellenará
	function successCreateBD() {	
		var api = 'http://www.ecodes.org/carbonpedia/API/JSON.php?';
		http.get(api+'tipo=3').success(succesAPI_3).error(errorCB_2);
		http.get(api+'tipo=2').success(succesAPI_2).error(errorCB_2);
		http.get(api+'tipo=1').success(succesAPI_1).error(errorCB_2);
	}	
	
	function succesAPI_3(data, status, headers, config) {
		succesAPI(data, status, headers, config, 3);
	}
	
	function succesAPI_2(data, status, headers, config) {
		succesAPI(data, status, headers, config, 2);
	}
	
	function succesAPI_1(data, status, headers, config) {
		succesAPI(data, status, headers, config, 1);
	}
	
	//Se ha creado la BD 
	// entonces pedimos los datos que necesitamos para rellenarla
	// cuando vayan llegando se rellenará
	function succesAPI(data, status, headers, config, type) {
		//Llama a la función update con los parámetros necesarios
		function updateDBAux(tx) {	
			updateDB(data, tx);
		}
		
		//Se ha creado la BD 
		// entonces pedimos los datos que necesitamos para rellenarla
		// cuando vayan llegando se rellenará
		function successUpdateDB() {	
			//Actualizamos la fecha de la última actualización exitosa de la BD
			var now = new Date().getTime();
			window.localStorage.setItem("time", now);
			window.localStorage.setItem(type, 1);
			
			//Si esta es la última de las 3 partes en cargar miramos si tenemso nuevas huellas
			if(window.localStorage.getItem("1") && window.localStorage.getItem("2") && window.localStorage.getItem("3")){
				//Llama a la función maxFootprintDB con los parámetros necesarios
				function maxFootprintDBSuccess(tx){
					maxFootprintDB(tx, successMaxFootprintDB);
				}		
				db.transaction(maxFootprintDBSuccess, errorCB);
				deferred.resolve();
			}
		}
		
		var db = window.openDatabase("carbonpedia", "1.0", "Carbonpedia DB", dbSize);
		db.transaction(updateDBAux, errorCB, successUpdateDB);	
	}	
	
	//Se ha obtenido la huella con id máximo en la BD recién actualizada
	//Si es mayor que la anterior máxima se actualiza el máximo 
	// y se piden todas las más altas que el máximo anterior para listarlas
	function successMaxFootprintDB(tx, results) {
		var max = window.localStorage.getItem("footprint");
		//Llama a la función topFootprintDB con los parámetros necesarios
		function topFootprintDBAux(tx) {	
			topFootprintDB(max, tx);
		}
		if(!max || max < results.rows.item(0)[publicFields['footprint_id']]){
			window.localStorage.setItem("footprint", results.rows.item(0)[publicFields['footprint_id']]);
			if(max){
				db.transaction(topFootprintDBAux, errorCB);
			}
		}
	}
	
	//Se advierte con una alerta de que existen nuevos datos en la BD de Carbonpedia
	function successTopFootprintDB(tx, results) {
		var text = scope.translation.AGNADIDOS + results.rows.length + scope.translation.AGNADIDOS2;
		var alertPopup = ionicPopup.alert({
		 title: 'Base de datos actualizada',
		 template: text
		});
		alertPopup.then(function(res) {		 
		});
	
		// for (var i=0; i<results.rows.length; i++){
			// console.log("successTopFootprintDB " +results.rows.item(i)[[publicFields['footprint_id']]]);
			// alert("Añadidas a Carbonpedia " + results.rows.length + "huellas de carbono");
		// }
		
		// alert(text);
		
	}
	
	//La consulta fue un éxito y se reciben los datos
	function querySuccess(tx, results) {
	
		var list = new Array(results.rows.length);		
		for (var i=0; i<list.length; i++){
			list[i]=results.rows.item(i);
		}
		deferred.resolve(list);
	}
	
	//Se forma una cadena con los campos recibidos separados por comas
	function addComma(fields){	
		var phrase = "";
		for (f in fields) {
			if (phrase!=""){
				phrase = phrase + ", ";
			}
			phrase = phrase + introFields[fields[f]];

			if(no_api){
				phrase = phrase + " as " + publicFields[fields[f]];				
			}
			
		}
		
		return phrase;
	}
	
	//******* CONEXIÓN DIRECTA DB *******//
	
	//Campo que hay que añadir a las búsquedas contra BD de Carbonpedia: "h.Estado=1" 
	
	//Preparar los datos que se pasaran al PHP que enlaza con MySQL
	function encodeSqlValues(sql, sqlValues) {		
		var parameters = {};
		parameters['query']=sql; //utf8_encode encodeURI
		for (v in sqlValues) {
			parameters['value'+ v] = sqlValues[v];
		}
		return parameters;
	}

	//Hacer llamada post al PHP que enlaza con MySQL
	function executeSql(sql, sqlValues, querySuccess, errorCB) {	
		var api = 'http://www.ecodes.org/carbonpedia/app/extra/database.php?';
		http.post('http://www.ecodes.org/carbonpedia/app/extra/database.php',
			 encodeSqlValues(sql, sqlValues)).success(querySuccess).error(errorCB);		
	}
	
	//La consulta fue un éxito y se reciben los datos
	function querySuccessNoAPI(data, status, headers, config) {
		deferred.resolve(data);
	}
	
}