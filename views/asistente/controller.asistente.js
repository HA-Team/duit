app.controller('asistenteController', ['tokkoApi', '$timeout', '$scope', 'sharedData', function(tokkoApi, $timeout, $scope, sharedData) {
    var asistente = this;

    asistente.contactGlobeTitle = 'Te asesoramos!';
    asistente.contactGlobeActions = [
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

    asistente.agents = sharedData.agents.filter(agent => agent.name != 'Teresita Sciortino');

    asistente.agents.forEach((agent) => (agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351')));

    asistente.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');

    asistente.submitText = 'Enviar';
    asistente.sending = false;
    asistente.success = false;
    asistente.error = false;
    asistente.message = 'Consulta desde formulario de Asistente Inmobiliario Personal, contactar urgente.'

    asistente.focusFormControl = (e) => {
        const dataName = e.target.htmlFor;
        const input = document.querySelector(`#asistente-personal .form-control[name='${dataName}']`);
        input.focus();
    };

    asistente.send = function () {
        if (asistente.name && asistente.email && asistente.lastName && asistente.phone) {

            asistente.submitText = 'Enviando';
            asistente.sending = true;

            const fullName = `${asistente.name} ${asistente.lastName}`;

            const data = {
                name: fullName,
                email: asistente.email,
                phone: asistente.phone,
                text: asistente.message,
            }

            tokkoApi.insert('webcontact', data, function (response) {
                if (response.status == 201) {

                asistente.sending = false;
                asistente.submitText = 'Enviar';
                asistente.success = true;
                asistente.name = '';
                asistente.lastName = '';
                asistente.email = '';
                asistente.phone = '';
                asistente.message = '';

                $timeout(function() {
                    asistente.success = false;
                }, 3000);

                $scope.$apply();
                } else {
                asistente.error = true;

                $scope.$apply();

                $timeout(function() {
                    asistente.error = false;
                }, 3000);
                }
            });
        }
    }
}]);