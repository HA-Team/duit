app.controller('homeController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'navigation',
	'utils',
	'tokkoService',
	'sharedData',
	'tokkoApi',
	'$q',
	function ($rootScope, $scope, $timeout, navigation, utils, tokkoService, sharedData, tokkoApi, $q) {
		var home = this;

		// #region Scoped Properties

		home.featured360PropsReady = false;
		home.isContactGlobeOpen = false;
		home.contactGlobeTitle = 'Te asesoramos!';
		home.agents = sharedData.agents;

		// #endregion

		// #region Private Properties
		var debouncedOnScroll = utils.debounce(onScroll, 50);
		var backgroundImageIndex = 0;

		// #endregion

		// #region On Init

		document.title = 'Duit Propiedades Inmobiliaria';

		$timeout(() => {
			$rootScope.activeMenu = 'home';
			document.querySelector('footer').style.display = 'none';
		}, 100);

		getFeatured360Props();

		home.agents.forEach((agent) => (agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351')));

		// #endregion

		// #region Private Methods

		function onScroll() {
			const duitFeaturedTop = document.querySelector('#home-featured') ? document.querySelector('#home-featured').offsetTop : 0;
			const servicesTop = document.querySelector('#servicios') ? document.querySelector('#servicios').offsetTop : 0;
			const assesorsTop = document.querySelector('#consejeros') ? document.querySelector('#consejeros').offsetTop : 0;
			const contactTop = document.querySelector('#contacto') ? document.querySelector('#contacto').offsetTop : 0;

			const scrollY = window.scrollY + 100;

			switch (true) {
				case scrollY > contactTop:
					$rootScope.activeSection = 'contacto';
					break;
				case scrollY > assesorsTop:
					$rootScope.activeSection = 'consejeros';
					break;
				case scrollY > servicesTop:
					$rootScope.activeSection = 'servicios';
					break;
				case scrollY > duitFeaturedTop:
					$rootScope.activeSection = 'destacados';
					break;
				default:
					$rootScope.activeSection = '';
					break;
			}

			$scope.$apply();
		}

		function getFeatured360Props() {
			tokkoService.getFeatured360Props().then(
				(result) => {
					result = result.data.objects;

					home.featured360Props = result
						.filter((prop) => prop.videos.some((video) => video.provider_id == 6))
						.map((prop) => {
							return {
								id: prop.id,
								coverPhoto: prop.photos[0].image,
								price: utils.getPrice(prop).price,
								currency: utils.getPrice(prop).currency,
								title: prop.publication_title,
								type: prop.type.name,
								operationType: prop.operations[0].operation_type,
								area: prop.surface,
								bedrooms: prop.suite_amount ? prop.suite_amount : 0,
								bathrooms: prop.bathroom_amount ? prop.bathroom_amount : 0,
								video_url: `${prop.videos[0].player_url}?rel=0&enablejsapi=1`,
								producer: prop.producer,
							};
						});

					home.featured360Props = _.shuffle(home.featured360Props);

					home.featured360PropsReady = true;
				},
				(reject) => null
			);
		}

		// #endregion

		// #region Scoped Methods

		home.toggleContactModal = () => (home.isContactGlobeOpen = !home.isContactGlobeOpen);

		home.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');

		home.goToSection = (page, section) => {
			if (page && section) navigation.goToSection(page, section);
		};

        home.goToAsistente = () => {
            navigation.goToSection('asistente', '');
        }

		// #endregion

		// #region Events

		window.addEventListener('scroll', debouncedOnScroll);

		$scope.$on('$destroy', () => {
			window.removeEventListener('scroll', debouncedOnScroll);
			document.querySelector('footer').style.display = 'flex';
		});

		// #endregion

		// #region Scoped Objects

		home.contactGlobeActions = [
			{
				hRef: `tel:${sharedData.duitPhone}`,
				iconClass: 'fa fa-phone',
				fontSize: '2.3rem',
			},
			{
				hRef: `mailto:${sharedData.contactEmail}`,
				iconClass: 'fa fa-envelope',
				fontSize: '2.5rem',
			},
			{
				hRef: `https://api.whatsapp.com/send?phone=${sharedData.duitWhatsapp}`,
				iconClass: 'fab fa-whatsapp',
				color: '#128c7e',
				fontSize: '3rem',
			},
		];

		home.services = [
			{
				imgSrc: '/images/services/consejeros.png',
				goTo: { page: 'home', section: 'consejeros' },
			},
			{
				imgSrc: '/images/services/alquiler.png',
				goTo: { page: 'home', section: 'home-search-bar' },
				action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 2 }),
			},
			{
				imgSrc: '/images/services/venta.png',
				goTo: { page: 'home', section: 'home-search-bar' },
				action: () => $scope.$broadcast('homeSearchServiceLinkClicked', { type: 1 }),
			},
			{
				imgSrc: '/images/services/administracion.png',
				hasTooltip: true,
				tooltipText:
					'Realizamos el cobro de alquileres e impuestos, y mantenimiento de tu propiedad. Damos una respuesta a los locatarios y evitamos a los propietarios las complicaciones derivadas con la administración y gestión de propiedades.',
				whatsAppHRef: `https://api.whatsapp.com/send?phone=${sharedData.infoWhatsapp}&text=${window.encodeURIComponent(
					'Hola, quiero hacer una consulta por una administración.'
				)}`,
				emailHRef: `mailto:${sharedData.infoEmail}?Subject=${window.encodeURIComponent('Hola, quiero hacer una consulta por una administración.')}`,
			},
			{
				imgSrc: '/images/services/tasacion.png',
				hasTooltip: true,
				tooltipText: 'Nuestro asesores matriculados CPCPI valuarán tu inmueble, para que sepas cuanto vale realemente tu propiedad.',
				whatsAppHRef: `https://api.whatsapp.com/send?phone=${sharedData.infoWhatsapp}&text=${window.encodeURIComponent(
					'Hola, quiero hacer una consulta por una tasasión.'
				)}`,
				emailHRef: `mailto:${sharedData.infoEmail}?Subject=${window.encodeURIComponent('Hola, quiero hacer una consulta por una tasasión.')}`,
			},
		];

		// #endregion
	},
]);
