
////////Controller////////

//Mete un valor en el array
function varToArray(scope, varNames, arrayName0, arrayName1, arrayName2){
	if(arrayName2){
		scope[arrayName2][arrayName1][arrayName0] = varNames;
	}else{
		scope[arrayName1][arrayName0] = varNames;
	}
}

//Extrae un valor del array
function arrayToVar(scope, arrayName0, arrayName1, arrayName2){
	var varNames;
	if(arrayName2){
		varNames = scope[arrayName2][arrayName1][arrayName0];
	}else{
		varNames = scope[arrayName1][arrayName0];
	}
	return varNames;
}

//Cambiamos '' por 'Todos' en el select, si procede
function functionFocus(scopeNames, preNames, names, scopeName, preName, name, text){
	var varNames = arrayToVar(scopeNames, 0, names, preNames);
	if( varNames=='' ){
		varNames=text;
		if(scopeName[preName][name]==''){
			scopeName[preName][name]=text;
		}
	}
	varToArray(scopeNames, varNames, 0, names, preNames);
}

//Lanza una pantalla con un desplegable que actualizará el select con el focus
function functionOldFocus(state, form, name, text, tab){	
	state.transitionTo(tab,
		{ "variable": encodeURIComponent(name), 
		"form": encodeURIComponent(form), 
		"text": encodeURIComponent(text)});	
}

//Cambiamos 'Todos' por '' en el select, si procede
function functionBlur(scopeNames, preNames, names, scopeName, preName, name, text){
	var varNames;
	var varNames = arrayToVar(scopeNames, 0, names, preNames);
	if( varNames==text && scopeName[preName][name]==text){
		varNames='';
		scopeName[preName][name]='';
	}
	varToArray(scopeNames, varNames, 0, names, preNames);
}

//Ver si la versión de Android es vieja
function oldVersion(device){	
	// return true;
	device = device.device;
	if((typeof(window.device) != "undefined") && (device.platform == "Android")){
		version = device.version.split(".");
		version = Number(version[0]);
		return version<3;
	}else{
		return false;
	}
}