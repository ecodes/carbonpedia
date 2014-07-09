describe('filter', function() {
  beforeEach(module('phonecatFilters'));

  describe('interpolate', function() {
    it('should even', inject(function(evenFilter) {
      expect(evenFilter('Even')).toEqual('Evento');
    }));
  });
  
});

describe('service', function() {
  beforeEach(module('starter.services'));

  describe('MapStore', function() {
    it('should MapStore', inject(function(MapStore) {
      expect(MapStore.currentLat).toEqual(40.4167754);
    }));
  });
  
  describe('List', function() {
    it('should List', inject(function(List) {
	
	List.update().then(function(results) {
			expect(0).toEqual(0);			
        }, function(results) {
			expect(0).toEqual(1);
        });
    }));
  });
  
});

describe('controllers', function(){
	beforeEach(module('starter.controllers'));
	
	it('should AccountCtrl', inject(function($controller) {
		//spec body
		var var1 = $controller('AccountCtrl', { $scope: {} });
		expect(var1).toBeDefined();
	}));
	
});

 describe('controllers services', function(){
	beforeEach(module('starter.controllers'));
	beforeEach(module('starter.services'));	
	
	describe('pre List', function() {
		beforeEach(inject(function(List) {
			List.update().then(function(results) {
				// expect(0).toEqual(0);			
			}, function(results) {
				// expect(0).toEqual(1);
			});
		}));
	});	
	
 	it('should DashCtrl', inject(function($controller, List) {
		google.load('visualization', '1.0', {'packages':['corechart']}); 
		
		var body = document.createElement("body");
		body.innerHTML = "<p>hello world</p>";
		document.firstChild.appendChild(body);
		
		var msgContainer = document.createElement('div');
		msgContainer.setAttribute('id', 'chart_div2');
		document.body.appendChild(msgContainer);
			
		var var1 = $controller('DashCtrl', { $scope: {} }, List);
		expect(var1).toBeDefined();	
	}));
});

////////////////////////////////////////////////////////////////////////////////////////////////

/* // var document = { getElementById: function(value) {return '<div id="chart_div2"></div>';} };

 describe('controllers services', function(){
	beforeEach(module('starter.controllers'));
	beforeEach(module('starter.services'));	
	// beforeEach(google.load('visualization', '1.0', {'packages':['corechart']}));
	
	describe('pre List', function() {
		beforeEach(inject(function(List) {
			List.update().then(function(results) {
				// expect(0).toEqual(0);			
			}, function(results) {
				// expect(0).toEqual(1);
			});
		}));
	});	
	
 	describe('pre google', function() {
		beforeEach(inject(function(google) {
			google.load('visualization', '1.0', {'packages':['corechart']});
			// var submit = jasmine.createSpy();
			// spyOn(document, 'getElementById').andReturn({submit:submit});
			// spyOn(document, 'getElementById').andReturn( { value: 'chart_div2' } );
			// var text = '<div id="chart_div2"></div>';			
			 // spyOn(document, 'getElementById').andReturn('<div id="chart_div2"></div>');
			
			// var msgContainer = document.createElement('div');
			// msgContainer.setAttribute('id', 'chart_div2');
			// document.body.appendChild(msgContainer);
			
					var body = document.createElement("body"); //HTMLNode
		body.innerHTML = "<p>hello world</p>";
		document.firstChild.appendChild(body);
		
		var msgContainer = document.createElement('div');
		msgContainer.setAttribute('id', 'chart_div2');
		document.body.appendChild(msgContainer);
		}));
	});	
	
 	it('should DashCtrl', inject(function($controller, List) {
		//spec body
		google.load('visualization', '1.0', {'packages':['corechart']}); 
		//Error al hacer -> document.getElementById('chart_div2')
		// expect(var1).toBeDefined();
		// console.log("DashCtrl " + document.getElementById('chart_div2'););
		// document.getElementById('chart_div2')
		// document.body.innerHTML += '<div id="chart_div2"></div>'
		
		var body = document.createElement("body"); //HTMLNode
		body.innerHTML = "<p>hello world</p>";
		document.firstChild.appendChild(body);
		
		var msgContainer = document.createElement('div');
		msgContainer.setAttribute('id', 'chart_div2');
		document.body.appendChild(msgContainer);
			
		var var1 = $controller('DashCtrl', { $scope: {} }, List);
		expect(var1).toBeDefined();	
		// expect(document.getElementById('chart_div2')).toEqual(msgContainer);
		// expect(document).toEqual('lala');
	}));
}); */