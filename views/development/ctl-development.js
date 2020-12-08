app.controller('developmentController', [
	'$rootScope',
	'$scope',
	'$timeout',
	'tokkoApi',
	'$stateParams',
	'getFeaturedProperties',
	'utils',
	'sliderMoves',
	'$filter',
	'$q',
	'sharedData',
	function ($rootScope, $scope, $timeout, tokkoApi, $stateParams, getFeaturedProperties, utils, sliderMoves, $filter, $q, sharedData) {
		var development = this;

		// #region Scoped Properties

		$rootScope.activeMenu = 'developments';
		$rootScope.activeSection = '';

		development.apiReady = false;
		development.similarDevsReady = false;
		development.devPropsReady = false;
		development.generalFeaturesToShow = 5;
		development.isContactModalOpen = false;
		development.isGalleryOpen = false;
		development.galleryIndex = 1;

		// #endregion

		// #region Private Properties

		const id = $stateParams.devId;
		const generalFeaturesList = document.querySelector('.mobile-dev-general-features ul');
		const limitedHeight = `${development.generalFeaturesToShow * 40}px`;
		generalFeaturesList.style.maxHeight = limitedHeight;

		// #endregion

		// #region On Init

		var getDevsInterval = setInterval(() => {
			if (sharedData.devs.length > 0) {
				sharedData.devs = sharedData.devs.filter((dev) => dev.minPrice);

				const filteredDevs = sharedData.devs.filter((dev) => dev.location.id == development.d.location.id);

				development.similarDevs = filteredDevs.length > 1 ? filteredDevs : sharedData.devs;

				development.similarDevs = development.similarDevs
					.filter((dev) => dev.id != development.d.id)
					.map((dev) => {
						return {
							id: dev.id,
							title: dev.name,
							minPrice: dev.minPrice,
							cover_photo: dev.photos[0] ? dev.photos[0].image : '/images/no-image.png',
							address: dev.fake_address,
						};
					});

				development.similarDevs = _.shuffle(development.similarDevs);

				development.similarDevsReady = true;

				$scope.$apply();

				clearInterval(getDevsInterval);
			}
		}, 200);

		tokkoApi.find('development', id, $q.defer()).then(
			(result) => {
				result = result.data.objects[0];

				development.d = result;

				development.d.hasDuit360 = result.videos.some((video) => video.provider_id == 6);
				development.d.duit360Url = result.videos.length ? result.videos[0].player_url + '?rel=0&enablejsapi=1' : null;
				development.d.youTubeVideos = development.d.videos.filter((video) => video.provider_id != 6);

				development.showDuit360 = development.d.hasDuit360;
				development.gallerySliderLength = development.d.photos.length + development.d.youTubeVideos.length;

				development.activeGalleryPhoto = result.photos[0].image;

				development.developmentMapped = {
					photos: result.photos,
					videos: result.videos
				};

				document.title = `Emprendimiento: ${result.name} en DUIT`;

				getDevelopmentProps(result.id);

				let myLatLng = { lat: parseFloat(result.geo_lat), lng: parseFloat(result.geo_long) };

				let map = new google.maps.Map(document.getElementById('propertyMap'), {
					center: myLatLng,
					zoom: 17,
				});

				let marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					title: result.name,
				});

				let mobileMap = new google.maps.Map(document.getElementById('mobile-dev-map'), {
					center: myLatLng,
					zoom: 17,
				});

				let mobileMarker = new google.maps.Marker({
					position: myLatLng,
					map: mobileMap,
					title: result.name,
				});

				development.apiReady = true;

				const gallerySlider = document.querySelector('.thumb-gallery-slider');

				$timeout(() => google.maps.event.trigger(map, 'resize'));

				const querySubject = window.decodeURIComponent(`Consulta por propiedad #${development.d.id}:${development.d.publication_title}`);

				const cellPhone = development.d.users_in_charge.phone;
				const cleanCellPhone = `549${cellPhone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');
				development.d.formatedPhone = cleanCellPhone.replace(/^549351/, '+54 9 351 ');
				const whatsAppUri = `https://api.whatsapp.com/send?phone=${cleanCellPhone}&text=${querySubject}`;
				document.querySelector('#mobile-dev-detail .contact-globe-modal-icons .fa-whatsapp').parentElement.setAttribute('href', whatsAppUri);
				document.querySelector('.desktop-prop-detail-contact-container .fa-whatsapp').parentElement.setAttribute('href', whatsAppUri);

				const emailUri = `mailto:${development.d.users_in_charge.email}?Subject=${querySubject}`;
				document.querySelector('#mobile-dev-detail .contact-globe-modal-icons .fa-envelope').parentElement.setAttribute('href', emailUri);
				document.querySelector('.desktop-prop-detail-contact-container .fa-envelope').parentElement.setAttribute('href', emailUri);

				const shareMessage = `https://wa.me/?text=${window.encodeURIComponent(`Mira que bueno este emprendimiento de duit! ${window.location.href}`)}`;
				document.querySelector('.desktop-prop-detail-main-container .share-container a').setAttribute('href', shareMessage);
				document.querySelector('#mobile-dev-detail .share-container a').setAttribute('href', shareMessage);
			},
			(reject) => null
		);

		// #endregion

		// #region Private Methods

		function getDevelopmentProps(id) {
			getFeaturedProperties.getDevelopmentProps(id).then(
				(result) => {
					result = result.data.objects;

					development.devProps = result.map((prop) => {
						const price = prop.operations[prop.operations.length - 1].prices.slice(-1)[0];

						if (price.price < development.d.minPrice || !development.d.minPrice) {
							development.d.minPrice = price.price;
							development.d.minPriceCurrency = price.currency;
						}

						const getSpecificAddressReg = /.+(\-.+)$/gs;
						const address = getSpecificAddressReg.exec(prop.real_address);

						return {
							id: prop.id,
							type: prop.operations[0].operation_type,
							title: prop.publication_title,
							property_type: prop.type.name,
							currency: price.currency,
							price: $filter('currency')(price.price, `${price.currency} `, 0),
							cover_photo: prop.photos[0].image,
							parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
							area: prop.type.id === 1 ? `${$filter('number')(prop.surface, 0)}m²` : `${$filter('number')(prop.roofed_surface, 0)}m²`,
							sell: prop.operations.filter((p) => prop.operation_type == 'Venta')[0]
								? prop.operations.filter((p) => prop.operation_type == 'Venta')[0].prices.slice(-1)[0]
								: [],
							rent: prop.operations.filter((p) => prop.operation_type == 'Alquiler')[0]
								? prop.operations.filter((p) => prop.operation_type == 'Alquiler')[0].prices.slice(-1)[0]
								: [],
							parkings_av: prop.parking_lot_amount > 0 ? 'Si' : 'No',
							suite_amount: prop.suite_amount,
							bathroom_amount: result.bathroom_amount ? result.bathroom_amount : 0,
							address: address ? address[1].replace('-', '').trim() : prop.fake_address ? prop.fake_address : prop.address,
							prop: prop,
						};
					});

					development.devPropsReady = true;
				},
				(reject) => null
			);
		}

		// #endregion

		// #region Scoped Methods

		development.toggleGeneralFeatures = () => {
			const maxHeight = `${development.d.tags.length * 40}px`;

			if (generalFeaturesList.classList.contains('open')) {
				generalFeaturesList.classList.remove('open');
				generalFeaturesList.style.maxHeight = limitedHeight;
			} else {
				generalFeaturesList.classList.add('open');
				generalFeaturesList.style.maxHeight = maxHeight;
			}
		};

		development.toggleDescriptionDetail = () => {
			const detail = document.querySelector('#mobile-dev-detail .description-detail');
			const preElement = detail.querySelector('pre');
			const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;

			if (detail.classList.contains('visible')) {
				detail.classList.remove('visible');
				detail.style.maxHeight = '';
			} else {
				detail.classList.add('visible');
				detail.style.maxHeight = maxHeight;
			}
		};

		development.toggleDescriptionDetailDesktop = () => {
			const showMore = document.querySelector('.show-more-dev');
			const preElement = showMore.querySelector('pre');
			const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;

			if (showMore.classList.contains('visible')) {
				showMore.classList.remove('visible');
				showMore.style.maxHeight = '';
			} else {
				showMore.classList.add('visible');
				showMore.style.maxHeight = maxHeight;
			}
		};

		development.toggleContactModal = () => (development.isContactModalOpen = !development.isContactModalOpen);

		development.isDateGreaterThanToday = (date) => utils.isDateGreaterThanToday(date);

		development.toggleGallery = () => {
			const header = document.querySelector('#header');
			const body = document.querySelector('body');
			const slider = document.querySelector('.gallery-slider');

			development.isGalleryOpen = !development.isGalleryOpen;

			if (development.isGalleryOpen) {
				header.style.display = 'none';
				body.style.overflow = 'hidden';
			} else {
				header.style.display = 'block';
				body.style.overflow = 'visible';
			}

			slider.style.scrollBehavior = 'unset';

			$timeout(() => {
				slider.scrollLeft = slider.querySelector('div').offsetWidth * (development.galleryIndex - 1);
				slider.style.scrollBehavior = 'smooth';
			});
		};

		development.moveSlider = (slider, side) => {
			const step = slider.querySelector('img').offsetWidth;

			if (side == 'left' && slider.scrollLeft > 0) slider.scrollLeft -= step;

			if (side == 'right') slider.scrollLeft = slider.scrollLeft + step;
		};

		development.moveGallerySlider = (slider, side) => {
			const width = slider.querySelector('div').offsetWidth;

			development.galleryIndex = sliderMoves.moveSliderByIndex(slider, development.galleryIndex, development.gallerySliderLength, side, width);
		};

		development.setActiveImage = (image) => {
			development.activeGalleryPhoto = image.image;
			development.showGalleryVideo = false;
			development.galleryIndex = development.d.photos.findIndex((i) => i == image) + 1;
		};

		development.setActiveVideo = (video) => {
			development.showDuit360 = false;
			development.showGalleryVideo = true;
			development.activeGalleryVideo = video;
		};

		development.toggleDescriptionDetailDesktop = () => {
			const showMore = document.querySelector('.collapsable-title');
			const preElement = document.querySelector('.desktop-prop-detail-left-panel pre');
			const maxHeight = `${preElement.offsetHeight + preElement.offsetTop}px`;

			if (showMore.classList.contains('visible')) {
				showMore.classList.remove('visible');
				preElement.style.maxHeight = '';
			} else {
				showMore.classList.add('visible');
				preElement.style.maxHeight = maxHeight;
			}
		};

		// #endregion

		// #region Scoped Objects

		development.contactGlobeOpenIcon = {
			iconClass: 'fab fa-whatsapp',
			color: 'var(--whatsapp-green)',
			fontSize: '3rem',
		};

		development.contactGlobeCloseIcon = {
			iconClass: 'fa fa-times',
			color: 'var(--soft-grey)',
			fontSize: '3rem',
		};

		development.contactGlobeActions = [
			{
				hRef: '#',
				iconClass: 'fab fa-whatsapp',
				color: 'var(--whatsapp-green)',
			},
			{
				hRef: '#',
				iconClass: 'fa fa-envelope',
				fontSize: '2.7rem',
			},
		];

		development.desktopAvailablePropsColumns = [
			{
				name: 'Ubicación',
				data: 'address',
				fixed: true,
				sort: 'az',
			},
			{
				name: 'Precio',
				data: 'price',
				sort: 'number',
			},
			{
				name: 'Unidad',
				data: 'property_type',
				sort: 'az',
			},
			{
				name: 'Dormitorios',
				data: 'suite_amount',
				sort: 'number',
			},
			{
				name: 'Baños',
				data: 'bathroom_amount',
				sort: 'number',
			},
			{
				name: 'Superficie Total',
				data: 'area',
				sort: 'number',
			},
			{
				name: 'Cochera',
				data: 'parkings_av',
				sort: 'az',
			},
		];

		development.availablePropsColumns = [
			{
				name: 'Ubicación',
				icon: 'fa fa-map-marker',
				data: 'address',
				fixed: true,
				sort: 'az',
			},
			{
				name: 'Precio',
				icon: 'fa fa-dollar-sign',
				data: 'price',
				sort: 'number',
			},
			,
			{
				name: 'Unidad',
				icon: 'fas fa-home',
				data: 'property_type',
				sort: 'az',
			},
			{
				name: 'Dormitorios',
				icon: 'fas fa-bed',
				data: 'suite_amount',
				sort: 'number',
			},
			{
				name: 'Baños',
				icon: 'fas fa-bath',
				data: 'bathroom_amount',
				sort: 'number',
			},
			{
				name: 'Superficie Total',
				icon: 'fas fa-ruler-vertical',
				data: 'area',
				sort: 'number',
			},
			{
				name: 'Cochera',
				icon: 'fas fa-car',
				data: 'parkings_av',
				sort: 'az',
			},
		];

		// #endregion
	},
]);
