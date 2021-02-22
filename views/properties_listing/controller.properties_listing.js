app.controller('propsListingController', [
	'$scope',
	'$timeout',
	'$location',
	'$rootScope',
	'tokkoApi',
	'$stateParams',
	'$state',
	'$anchorScroll',
	'utils',
	'sharedData',
	'tokkoService',
	'$q',
	function ($scope, $timeout, $location, $rootScope, tokkoApi, $stateParams, $state, $anchorScroll, utils, sharedData, tokkoService, $q) {
		var propsListing = this;

		// #region Private Properties

		propsListing.args = JSON.parse($stateParams.args);
		let data = JSON.parse(propsListing.args.data);

		var newSearch = true;
		var isDevReady = false;
		var updateSubtype = true;
		var updateLocation = true;
		var firstSearch = true;

		var currentScrollY = 0;

		const MAX_PAGES_TO_SHOW = 10;
		const PROPS_PER_PAGE = 40;

		// #endregion

		// #region Scoped Properties

		$rootScope.activeMenu = 'propiedades';

		propsListing.results = [];
		propsListing.tags = [];

		propsListing.resultsCount = 0;

		propsListing.sideBarParams = {};
		propsListing.filters = {
			minPrice: {
				default: '',
			},
			maxPrice: {
				default: '',
			},
			operations: {
				default: sharedData.tokkoSearchArgs.data.operation_types,
				action: () => propsListing.changeFilter({ type: 'o', val: this.filters.operations.default }),
			},
			types: {
				default: sharedData.tokkoSearchArgs.data.property_types,
				action: () => propsListing.changeFilter({ type: 't', val: this.filters.types.default }),
			},
			subTypes: {
				default: [],
				selected: [],
				action: (value) => propsListing.changeFilter({ type: 'st', val: value }),
			},
			rooms: {
				default: [],
				action: () => propsListing.changeFilter({ type: 'r', val: this.filters.rooms.default }),
			},
			cities: {
				default: [],
				action: () => propsListing.changeFilter({ type: 'c', val: this.filters.cities.default }),
			},
			locations: {
				default: [],
				selected: [],
				action: (value) => propsListing.changeFilter({ type: 'l', val: value }),
			},
		};
		propsListing.pages = {
			activePage: 1,
			pages: 1,
			pagesToShow: [1],
		};

		propsListing.apiReady = false;
		propsListing.ifResults = true;
		propsListing.isOrderOpen = false;
		propsListing.isFilterOpen = false;

		propsListing.operationType = data.operation_types;
		propsListing.propertyType = data.property_types;
		propsListing.locations = data.current_localization_id;

		const getSubTypesByWhitoutTag = (tags) => {
			for (const subType in sharedData.propertiesSubTypes) {
				if (tags && sharedData.propertiesSubTypes[subType].some((st) => st.id == tags[0])) {
					return sharedData.propertiesSubTypes[subType].filter((filterSubType) => !tags.includes(filterSubType.id)).map((st) => st.id);
				}
			}

			return [];
		};

		propsListing.subTypeSelected = data.with_custom_tags?.length > 0 ? data.with_custom_tags : getSubTypesByWhitoutTag(data.without_custom_tags);

		// #endregion

		// #region Private Methods

		const setActiveSection = (operationType) => ($rootScope.activeSection = operationType == 1 ? 'venta' : 'alquiler');

		const getProperties = (tokkoApi, rargs) => {
			if (isDevReady) {
				let args = {
					data: rargs.data,
					order: rargs.order,
					order_by: rargs.order_by,
					limit: rargs.limit ? rargs.limit : PROPS_PER_PAGE,
					offset: rargs.offset ? rargs.offset : 0,
				};

				propsListing.apiReady = false;
				propsListing.results = [];
				if (newSearch) {
					tokkoApi.find('property/get_search_summary', args, $q.defer()).then(
						(result) => {
							result = result.data;
							const cities = result.objects.locations.map((loc) => {
								city = {
									id: loc.parent_id,
									name: loc.parent_name,
								};

								return city;
							});

							let types = result.objects.property_types;

							propsListing.sideBarParams = {
								locations: updateLocation || propsListing.locations.length == 0 ? result.objects.locations : propsListing.sideBarParams.locations,
								cities: cities.filter((val, ind, arr) => arr.findIndex((t) => val.id && t.id === val.id) === ind),
								types: types.sort((a, b) => b.count - a.count),
								subTypes: (() => {
									if (updateSubtype) {
										if (propsListing.subTypeSelected && propsListing.subTypeSelected.length > 0 && types[0]) {
											return sharedData.propertiesSubTypes[types[0].id];
										} else {
											return types.length === 1 ? sharedData.propertiesSubTypes[types[0].id] : [];
										}
									} else {
										return propsListing.sideBarParams.subTypes;
									}
								})(),
								operations: result.objects.operation_types.sort((a, b) => b.count - a.count),
								rooms: result.objects.suite_amount.sort((a, b) => b.count - a.count),
							};

							if (propsListing.locations.length > 0 && firstSearch) {
								propsListing.filters.locations.selected = propsListing.sideBarParams.locations;
							}

							propsListing.sideBarParams.cities.forEach((city) => {
								city.count = cities.filter((c) => c.id == city.id).length;
							});

							if (propsListing.sideBarParams.rooms.find((room) => room.amount == 0)) {
								const propsWithoutRoomsDiffThanHousesOrDepts =
									propsListing.sideBarParams.types.filter((type) => type.id != 2 && type.id != 3).length > 0
										? propsListing.sideBarParams.types.reduce((total, type) => (type.id != 2 && type.id != 3 ? (total += type.count) : 0), 0)
										: 0;
								propsListing.sideBarParams.rooms.find((room) => room.amount == 0).count -= propsWithoutRoomsDiffThanHousesOrDepts;
							}

							propsListing.isAnyTypeHouseOrDept = propsListing.sideBarParams.types.some((type) => type.id == 2 || type.id == 3);

							propsListing.resultsCount = result.meta.total_count;
							propsListing.pages.cant = Math.ceil(propsListing.resultsCount / PROPS_PER_PAGE);
							propsListing.pages.pagesToShow = [
								...Array(parseInt(propsListing.pages.cant > MAX_PAGES_TO_SHOW ? MAX_PAGES_TO_SHOW : propsListing.pages.cant)).keys(),
							].map((x) => ++x);

							newSearch = false;
							firstSearch = false;
						},
						(reject) => null
					);
				}

				(getTokkoProperties = tokkoService.getProperties('property/search', args)).then(
					(result) => {
						result.objects.forEach((p) => {
							const isDevAlreadyInResults = propsListing.results.some((prop) => prop.development && p.development && prop.development.id == p.development.id);

							if (!isDevAlreadyInResults) {
								const dev = sharedData.devs.filter((dev) => dev.id == p.development?.id)[0];
								if (p.development && dev) {
									p.minPrice = dev.minPrice;
									p.id = dev.minPriceId;
									p.address = dev.address;
								}
								pushPropertyToResults(p);
							}
						});

						propsListing.results.length > 0 ? (propsListing.ifResults = true) : (propsListing.ifResults = false);
						propsListing.apiReady = true;

						if (sharedData.propertySearchScrollY) {
							$timeout(() => {
								document.documentElement.scrollTop = sharedData.propertySearchScrollY;
								sharedData.propertySearchScrollY = 0;
							});
						}
					},
					(reject) => null
				);
			}
		};

		const pushPropertyToResults = (prop) => {
			propsListing.results.push({
				id: prop.id,
				title: prop.publication_title,
				address: prop.address,
				agent: prop.branch ? prop.branch.name : '',
				area: prop.type.id === 1 ? prop.surface : prop.roofed_surface,
				type: prop.operations[0].operation_type,
				currency: utils.getPrice(prop).currency === 'ARS' ? '$' : utils.getPrice(prop).currency,
				price: utils.getPrice(prop).price,
				minPrice: prop.minPrice,
				rooms: prop.suite_amount ? prop.suite_amount : 0,
				baths: prop.bathroom_amount ? prop.bathroom_amount : 0,
				parkings: prop.parking_lot_amount ? prop.parking_lot_amount : 0,
				coverPhoto: prop.photos.length > 0 ? prop.photos[0].thumb : '/images/no-image.png',
				photos: prop.photos.length > 0 ? prop.photos : [{ image: '/images/no-image.png' }],
				location: prop.location,
				development: prop.development,
				propType: prop.type,
				webPrice: prop.web_price,
			});
		};

		const setInitialTags = () => {
			if (propsListing.operationType.length == 1) {
				propsListing.filters.operations.isActive = true;
				propsListing.filters.operations.name = propsListing.opName(propsListing.operationType[0]);
				propsListing.filters.operations.selected = propsListing.operationType[0];
			}

			if (propsListing.propertyType.length == 1) {
				const name = sharedData.propertiesTypes.find((type) => type.id == propsListing.propertyType[0]).name;
				propsListing.filters.types.isActive = true;
				propsListing.filters.types.name = name;
				propsListing.filters.types.selected = propsListing.propertyType[0];
			}

			if (data.filters[0] && data.filters[0].length > 0) {
				const rooms = data.filters[0][2];
				const name = propsListing.roomAmtName(rooms);
				propsListing.filters.rooms.isActive = true;
				propsListing.filters.rooms.name = name;
				propsListing.filters.rooms.selected = ['suite_amount', '=', rooms.toString()];
			}

			if (propsListing.subTypeSelected.length > 0) {
				for (const subType in sharedData.propertiesSubTypes) {
					if (sharedData.propertiesSubTypes[subType].some((st) => st.id == propsListing.subTypeSelected[0])) {
						propsListing.filters.subTypes.selected = sharedData.propertiesSubTypes[subType].filter((filterSubType) =>
							propsListing.subTypeSelected.includes(filterSubType.id)
						);
					}
				}
			}
		};

		const cleanFilter = (name) => {
			propsListing.filters[name].isActive = false;
			propsListing.filters[name].name = null;
			propsListing.filters[name].selected = null;
		};

		const handleFilter = (filter, name) => {
			if (filter.val == propsListing.filters[name].default) {
				cleanFilter(name);
			} else {
				propsListing.filters[name].isActive = true;
				propsListing.filters[name].name = filter.name;
				propsListing.filters[name].selected = filter.val;
			}
		};

		const onScroll = () => {
			currentScrollY = window.scrollY;
		};

		var debouncedOnScroll = utils.debounce(onScroll, 100);

		// #endregion

		// #region Scoped Methods

		propsListing.goLocation = (url) => $state.go(url);

		propsListing.opName = (type) => (type == 1 ? 'Venta' : type == 2 ? 'Alquiler' : 'Otro');

		propsListing.roomAmtName = (amount) => (parseInt(amount) > 0 ? (amount == 1 ? `${amount} Dormitorio` : `${amount} Dormitorios`) : 'Loft ');

		propsListing.find = () => {
			let findData = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));

			findData.operation_types = propsListing.operationType;
			findData.property_types = propsListing.propertyType;

			if (!propsListing.subTypeSelected || propsListing.subTypeSelected.length <= 1) {
				findData.with_custom_tags = propsListing.subTypeSelected;
			} else {
				findData.without_custom_tags = propsListing.sideBarParams.subTypes
					.filter((subType) => !propsListing.subTypeSelected.includes(subType.id))
					.map((subType) => subType.id);
			}

			findData.current_localization_id = propsListing.locations;
			findData.filters = [propsListing.rooms];

			if (propsListing.minPrice) findData.price_from = propsListing.minPrice;
			if (propsListing.maxPrice) findData.price_to = propsListing.maxPrice;

			if (findData.filters[0] && findData.filters[0][2] == '0') {
				findData.property_types = findData.property_types.filter((type) => type == 2 || type == 3);
			}

			propsListing.args.data = JSON.stringify(findData);
			propsListing.args.order_by = propsListing.order ? propsListing.order.order_by : 'price';
			propsListing.args.order = propsListing.order ? propsListing.order.order : 'asc';
			propsListing.args.offset = 0;

			getProperties(tokkoApi, propsListing.args);

			$location.search({ args: JSON.stringify(propsListing.args) });

			setActiveSection(propsListing.operationType);
		};

		propsListing.changeFilter = (filter) => {
			newSearch = true;
			updateSubtype = true;
			updateLocation = true;

			if (filter.type === 'o') {
				propsListing.operationType = filter.val;
				handleFilter(filter, 'operations');
			}

			if (filter.type === 't') {
				if (filter.val.length == propsListing.filters.types.default.length) {
					propsListing.propertyType = filter.val;
					propsListing.filters.subTypes.selected = [];
				} else {
					if (propsListing.propertyType.length == propsListing.filters.types.default.length) {
						propsListing.propertyType = filter.val;
					} else {
						propsListing.propertyType.push(filter.val);
					}
				}
				propsListing.subTypeSelected = [];
				propsListing.locations = [];
				handleFilter(filter, 'types');
			}

			if (filter.type === 'st') {
				if (propsListing.filters.subTypes.selected.indexOf(filter.val) == -1) {
					propsListing.filters.subTypes.selected.push(filter.val);
				} else {
					propsListing.filters.subTypes.selected.splice(propsListing.filters.subTypes.selected.indexOf(filter.val), 1);
				}

				propsListing.subTypeSelected = propsListing.filters.subTypes.selected.map((type) => type.id);

				updateSubtype = false;
			}

			if (filter.type === 'r') {
				propsListing.rooms = filter.val;
				handleFilter(filter, 'rooms');
			}

			if (filter.type === 'c') {
				propsListing.locations = propsListing.sideBarParams.locations
					.filter((loc) => loc.parent_id && loc.parent_id == filter.val)
					.map((loc) => loc.location_id);
				propsListing.locations = propsListing.filters.locations.default;
				handleFilter(filter, 'cities');
			}

			if (filter.type === 'l') {
				if (propsListing.filters.locations.selected.indexOf(filter.val) == -1) {
					propsListing.filters.locations.selected.push(filter.val);
				} else {
					propsListing.filters.locations.selected.splice(propsListing.filters.locations.selected.indexOf(filter.val), 1);
				}

				propsListing.locations = propsListing.filters.locations.selected.map((loc) => loc.location_id);

				updateLocation = false;
			}

			if (filter.type === 'or') {
				propsListing.order = { order_by: propsListing.orderBy.val.split('_')[0], order: propsListing.orderBy.val.split('_')[1] };
				newSearch = false;
			}

			propsListing.find();
		};

		propsListing.goToPage = (index) => {
			propsListing.pages.activePage = index;
			const halfCantOfPages = MAX_PAGES_TO_SHOW / 2;
			const isActivePageInFirstHalf = propsListing.pages.activePage < halfCantOfPages;
			const isActivePageInLastHalf = propsListing.pages.activePage > propsListing.pages.cant - halfCantOfPages;

			let pagesOffset = isActivePageInFirstHalf
				? 1
				: isActivePageInLastHalf
				? propsListing.pages.cant - MAX_PAGES_TO_SHOW + 1
				: propsListing.pages.activePage - halfCantOfPages + 1;

			propsListing.pages.pagesToShow = [
				...Array(parseInt(propsListing.pages.cant > MAX_PAGES_TO_SHOW ? MAX_PAGES_TO_SHOW : propsListing.pages.cant)).keys(),
			].map((x) => (x += pagesOffset));

			propsListing.args.offset = (index - 1) * PROPS_PER_PAGE;
			window.scrollTo(0, 0);

			$state.go('propiedades', { args: JSON.stringify(propsListing.args) });
		};

		propsListing.changeOrder = (newVal) => {
			propsListing.orderBy = newVal;
			propsListing.isOrderOpen = false;
			propsListing.changeFilter({ type: 'or' });
		};

		propsListing.toggleActiveItem = (e) => {
			e.stopPropagation();

			let item = e.target;

			while (!item.classList.contains('mobile-filter-modal-item')) item = item.parentElement;

			if (item.classList.contains('active')) item.classList.remove('active');
			else item.classList.add('active');
		};

		propsListing.pluralize = utils.pluralize;

		propsListing.clearAllFilters = () => {
			propsListing.minPrice = propsListing.filters.minPrice.default;
			propsListing.maxPrice = propsListing.filters.maxPrice.default;
			propsListing.operationType = propsListing.filters.operations.default;
			propsListing.propertyType = propsListing.filters.types.default;
			propsListing.subTypeSelected = propsListing.filters.subTypes.default;
			propsListing.locations = propsListing.filters.locations.default;
			propsListing.rooms = propsListing.filters.rooms.default;
			propsListing.find();
		};

		propsListing.doesPropertyHasEnvironments = (p) => p.propType.id != 10 && p.propType.id != 1;

		propsListing.toggleMoreLocations = (event) => {
			const itemsContainerElement = event.target.previousElementSibling;
			const maxHeight = `${itemsContainerElement.scrollHeight}px`;

			if (itemsContainerElement.classList.contains('visible')) {
				itemsContainerElement.classList.remove('visible');
				itemsContainerElement.style.maxHeight = '';
			} else {
				itemsContainerElement.classList.add('visible');
				itemsContainerElement.style.maxHeight = maxHeight;
			}
		};

		// #endregion

		// #region On Init
		document.title = 'Duit Propiedades Inmobiliaria';

		setActiveSection(propsListing.operationType);
		$anchorScroll();

		propsListing.args.data = JSON.stringify(data);
		var getDevsInterval = setInterval(() => {
			if (sharedData.devs.length > 0) {
				isDevReady = true;
				getProperties(tokkoApi, propsListing.args);
				propsListing.pages.activePage = propsListing.args.offset / PROPS_PER_PAGE + 1;
				clearInterval(getDevsInterval);
			}
		}, 200);

		setInitialTags();

		// #endregion

		// #region Events

		var cleanOnChangeFilter = $rootScope.$on('changeFilter', (event, { operationType }) => {
			propsListing.changeFilter({ type: 'o', name: propsListing.opName(operationType), val: [operationType] });
		});

		var cleanLocationChangeSucess = $rootScope.$on('$locationChangeSuccess', function (event) {
			if ($location.path().includes('propiedades') && propsListing.apiReady) {
				window.scrollTo(0, 0);

				params = $location.search();

				const args = JSON.parse(params.args);
				propsListing.pages.activePage = args.offset / PROPS_PER_PAGE + 1;

				getProperties(tokkoApi, args);
			}
		});

		window.addEventListener('scroll', debouncedOnScroll);

		$scope.$on('$destroy', () => {
			window.removeEventListener('scroll', debouncedOnScroll);
			cleanOnChangeFilter();
			cleanLocationChangeSucess();
			sharedData.propertySearchScrollY = window.scrollY;
		});

		// #endregion

		// #region Scoped Objects

		propsListing.orderBy = { val: 'price_asc', text: 'Menor Precio' };

		propsListing.orderOptions = [
			{ val: 'price_asc', text: 'Menor Precio' },
			{ val: 'price_desc', text: 'Mayor Precio' },
			{ val: 'id_asc', text: 'Más Recientes' },
		];

		// #endregion
	},
]);
