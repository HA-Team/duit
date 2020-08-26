app.service('utils', ['$timeout', function ($timeout) {
	this.getDaysDifference = (date) => {
		const today = Date.now();
		const newDate = new Date(date);
		const diffTime = Math.abs(newDate - today);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	};

	this.debounce = function (func, wait, immediate) {
		var timeout;
		return function () {
			var context = this,
				args = arguments;
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = $timeout(function () {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			}, wait);
			if (callNow) func.apply(context, args);
		};
	};
	
	this.pluralize = (name) => ['a','e','i','o','u'].includes(name.slice(-1)) ? `${name}s` : `${name}es`;

	this.pluralizeWithItem = (items, name) => {
		if (items > 1) {
			if (['a','e','i','o','u'].includes(name.slice(-1))) return `${name}s`;
			else return `${name}es`;
		}
		else return name;
	};

	this.isDateGraterThanToday = (date) => new Date(date) >= new Date();

	this.sides = [
		{
			rotated: 'up',
			side: 'left',
			oposite: 'right'
		},
		{
			rotated: 'down',
			side: 'right',
			oposite: 'left'
		}
	];
}]);
