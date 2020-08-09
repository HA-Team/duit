app.controller('contactFormController', ['$rootScope', '$scope', 'tokkoApi', function($rootScope, $scope, tokkoApi) {
  var contactForm = this;
  
  // #region Scoped Properties

  $rootScope.activeMenu = 'contactUs';
  contactForm.submitText = 'Enviar';
  contactForm.sending = false;
  contactForm.success = false;
  contactForm.error = false;

  // #endregion

  // #region Scoped Methods

  contactForm.focusFormControl = (e) => {
    const dataName = e.target.htmlFor;
    const input = document.querySelector(`#home-contact .form-control[name='${dataName}']`);
    input.focus();    
  };

  contactForm.send = function () {
    if (contactForm.name && contactForm.email && contactForm.message) {
      
      contactForm.submitText = 'Enviando';
      contactForm.sending = true;

      const fullName = `${contactForm.name} ${contactForm.lastName}`;

      const data = {
        name: fullName,
        email: contactForm.email,
        phone: contactForm.phone,
        text: contactForm.message,
      }

      tokkoApi.insert('webcontact', data, function (response) {
        if (response.status == 201) {

          contactForm.sending = false;
          contactForm.submitText = 'Enviar';
          contactForm.success = true;
          contactForm.name = '';
          contactForm.lastName = '';
          contactForm.email = '';
          contactForm.phone = '';
          contactForm.message = '';

          setTimeout(function() {
            contactForm.success = false;
            $scope.$apply()
          }, 3000);

          $scope.$apply();
        } else {
          contactForm.error = true;

          $scope.$apply();

          setTimeout(function() {
            contactForm.error = false;
            $scope.$apply()
          }, 3000);
        }
      });
    }
  };

  // #endregion
}]);