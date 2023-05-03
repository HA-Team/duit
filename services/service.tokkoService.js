app.service('tokkoService', [
	'tokkoApi',
	'sharedData',
	'$filter',
	'$q',
	'utils',
	function (tokkoApi, sharedData, $filter, $q, utils) {
		var service = this;

		this.getSimilarProps = (operationType, typeId, price, customTags) => {
			let data = sharedData.tokkoSearchArgs.data;

			data.operation_types = [operationType];
			data.property_types = [typeId];
			data.price_from = Math.round(price * 0.8);
			data.price_to = Math.round(price * 1.2);
			data.filters = [];

			if (customTags > 0) data.with_custom_tags = [customTags.slice(-1)[0].id];

			const args = { data: JSON.stringify(data), order: 'desc' };

			return tokkoApi.find('property/search', args, $q.defer());
		};

		this.getDevelopmentProps = (id) => {
			const args = { development: id, order: 'desc' };
			return tokkoApi.find('property', args, $q.defer());
		};

		this.getFeaturedProps = () => {
			let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
			data.filters.push(['is_starred_on_web', '=', 'true']);
			let args = { data: JSON.stringify(data), order: 'desc' };

			return tokkoApi.find('property/search', args, $q.defer());
		};

		this.getFeatured360Props = () => {
			let data = JSON.parse(_.clone(sharedData.tokkoSearchArgs.sData));
			data.filters.push(['is_starred_on_web', '=', 'true']);
			let args = { data: JSON.stringify(data), order: 'desc' };

			args.limit = 100;

			return tokkoApi.find('property/search', args, $q.defer());
		};

		this.getDevs = () => {
			let args = { order: 'desc', limit: 100 };

			var sessionDevs = JSON.parse(sessionStorage.getItem('developments'));

			if (!sessionDevs) {
				tokkoApi.find('development', args, $q.defer()).then(
					(results) => {
						results = results.data.objects;

						var arr = [];
						results.forEach((dev) => {
							arr.push(service.getDevelopmentProps(dev.id));
						});

						$q.all(arr).then((result) => {
							result.forEach((res, index) => {
								res = res.data.objects;

								if (res.length > 0) {
									const minPriceProp = res.reduce((min, prop) => {
										const price = utils.getPrice(prop)?.price;

										return price < utils.getPrice(min)?.price ? prop : min;
									}, res[0]);

									const price = utils.getPrice(minPriceProp);

									results[index].minPrice = price ? $filter('currency')(price.price, `${price.currency} `, 0) : 0;
									results[index].minPriceId = minPriceProp.id;
								}
							});

							sharedData.setDevs(results);
							sessionStorage.setItem('developments', JSON.stringify(results));
						});
					},
					(reject) => null
				);
			} else {
				sharedData.setDevs(sessionDevs);
			}
		};

		this.getProperties = (url, args) => {
			var deferredAbort = $q.defer();

			var request = tokkoApi.find(url, args, deferredAbort);

			var promise = request.then(
				(response) => response.data,
				(reject) => $q.reject('Something went wrong!')
			);

			promise.abort = () => deferredAbort.resolve();

			promise.finally = () => {
				promise.abort = angular.noop;
				deferredAbort = request = promise = null;
			};

			return promise;
		};
	},
]);
