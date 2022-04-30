const app = angular.module('duit', ['ui.router', 'angular-google-analytics']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$provide',
	'$locationProvider',
	function ($stateProvider, $urlRouterProvider, $provide, $locationProvider) {
		$stateProvider.state('home', {
			url: '/',
			templateUrl: 'views/home/home.html',
			controller: 'homeController as home',
		});
		$stateProvider.state('propiedades', {
			url: '/propiedades?args',
			templateUrl: 'views/properties_listing/properties_listing.html',
			controller: 'propsListingController as propsListing',
			reloadOnSearch: false,
		});
		$stateProvider.state('propiedad', {
			url: '/propiedad/:propertyId',
			templateUrl: 'views/property/property.html',
			controller: 'propertyController as property',
		});
		$stateProvider.state('emprendimientos', {
			url: '/emprendimientos',
			templateUrl: 'views/developments_listing/developments_listing.html',
			controller: 'devsListingController as devsListing',
		});
		$stateProvider.state('emprendimiento', {
			url: '/emprendimiento/:devId',
			templateUrl: 'views/development/development.html',
			controller: 'developmentController as development',
		});
        $stateProvider.state('asistente', {
			url: '/asistente',
			templateUrl: 'views/asistente/asistente.html',
			controller: 'asistenteController as asistente',
		});
		$urlRouterProvider.otherwise('/');

		$provide.decorator('$uiViewScroll', function ($delegate) {
			return function (uiViewElement) {
				// let top = uiViewElement.getBoundingClientRect().top;
				window.scrollTo(0, 0);
				// Or some other custom behaviour...
			};
		});
	},
]);

app
	.config([
		'AnalyticsProvider',
		function (AnalyticsProvider) {
			// Add configuration code as desired
			AnalyticsProvider.setAccount('UA-79529729-2'); //Duit official: UA-79529729-1
		},
	])
	.run(['Analytics', function (Analytics) {}]);

/*
 * Tokko Broker API functions.
 *
 * @author: Antonio Aznarez
 * @email: antonio@ha-team.co
 * @copyright: HA 2017
 * @date: 09/06/17
 */

app.controller('startUpController', [
	'tokkoService',
	function (tokkoService) {
		tokkoService.getDevs();
	},
]);

// Filter to white list urls to embbed videos in iframes (required by angular)
app.filter('trusted', [
	'$sce',
	function ($sce) {
		return function (url) {
			return $sce.trustAsResourceUrl(url);
		};
	},
]);
