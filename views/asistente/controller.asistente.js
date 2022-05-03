app.controller('asistenteController', ['tokkoApi', '$timeout', '$scope', function(tokkoApi, $timeout, $scope) {
    var asistente = this;

    asistente.agents = [
		{
			name: 'Agustín Aznarez',
			position: 'Consejero',
			phone: '(351) 3102556',
			email: 'agustin@duitpropiedades.com.ar',
			facebook: 'https://www.facebook.com/agustin.aznarez',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/agustin-aznarez-profile.jpg',
		},
		{
			name: 'Daniel Ganim',
			position: 'Consejero',
			phone: '(351) 5647780',
			email: 'danielganim@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/daniel-ganim-profile.jpg',
		},
		{
			name: 'Carolina Valarolo',
			position: 'Consejera',
			phone: '(351) 5513711',
			email: 'carolina@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/carolina-valarolo-1-profile.jpg',
		}
	];

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