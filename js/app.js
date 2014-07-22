// Ionic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'phonecatFilters'], function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})

.run(function($ionicPlatform, $rootScope, List, translationService) {
  $ionicPlatform.ready(function() {
	//Cargamos el idioma
	translationService.getTranslation($rootScope, 'ES');
	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
	
    .state('tab.event', {
      url: '/event',
      views: {
        'tab-main': {
          templateUrl: 'templates/tab-event.html',
          controller: 'EventCtrl'
        }
      }
    })

	.state('tab.entity', {
      url: '/entity',
      views: {
        'tab-main': {
          templateUrl: 'templates/tab-entity.html',
          controller: 'EntityCtrl'
        }
      }
    })
	
    .state('tab.product', {
      url: '/product',
      views: {
        'tab-main': {
          templateUrl: 'templates/tab-product.html',
          controller: 'ProductCtrl'
        }
      }
    }) 
	
	.state('tab.carbonpedia', {
      url: '/carbonpedia',
      views: {
        'tab-main': {
          templateUrl: 'templates/tab-carbonpedia.html',
          controller: 'CarbonpediaCtrl'
        }
      }
    })
	
	.state('tab.search', {
      url: '/search',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
	
    .state('tab.list', {
      url: '/list/:city/:year/:type/:entity/:product/:activity',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListCtrl'
        }
      }
    })
	
    .state('tab.select-list', {
      url: '/select-list/:variable/:form/:text',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-select-list.html',
          controller: 'SelectListCtrl'
        }
      }
    })
	
    .state('tab.detail', {
      url: '/detail/:detailId',
      views: {
        'tab-list': {
          templateUrl: 'templates/detail.html',
          controller: 'DetailCtrl'
        }
      }
    })

    .state('tab.main', {
      url: '/main',
      views: {
        'tab-main': {
          templateUrl: 'templates/tab-main.html',
          controller: 'MainCtrl'
        }
      }
    })

	.state('tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })
	
    .state('tab.detail_map', {
      url: '/detail_map/:detailId',
      views: {
        'tab-map': {
          templateUrl: 'templates/detail.html',
          controller: 'DetailCtrl'
        }
      }
    })
	
    .state('tab.select-list_map', {
      url: '/select-list/:variable/:form/:text',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-select-list.html',
          controller: 'SelectListCtrl'
        }
      }
    })
	
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');

});

