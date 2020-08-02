app.controller('propContactForm', ['$scope', 'tokkoApi', function ($scope, tokkoApi) {
	// #region Public Properties

	$scope.submitText = 'Enviar';
	$scope.sending = false;
	$scope.success = false;
	$scope.error = false;

	// #endregion

	// #region Public Methods

	$scope.send = function () {
		if ($scope.name || $scope.email) {
			$scope.submitText = 'Enviando';
			$scope.sending = true;

			const data = {
				email: $scope.email,
				phone: $scope.phone,
				text: $scope.message,
				properties: [$scope.p.id],
			};

			tokkoApi.insert('webcontact', data, function (response) {
				if (response.result == 'success') {
					$scope.sending = false;
					$scope.submitText = 'Enviar';
					$scope.success = true;
					$scope.email = '';
					$scope.phone = '';
					$scope.message = '';

					setTimeout(function () {
						$scope.success = false;
						$scope.$apply();
					}, 3000);

					$scope.$apply();
				} else {
					$scope.error = true;
					$scope.$apply();

					setTimeout(function () {
						$scope.error = false;
						$scope.$apply();
					}, 3000);
				}
			});
		}
	};

	// #endregion
}]);
