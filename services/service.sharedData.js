app.service('sharedData', function () {
	this.duitWhatsapp = 5493512463530;
	this.infoWhatsapp = 5493512463606;
	this.infoEmail = 'info@duitpropiedades.com.ar';
	this.contactEmail = 'contacto@duitpropiedades.com.ar';
	this.duitPhone = '+5493512463530';

	this.agents = [
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
			name: 'Fernando Gavier',
			position: 'Consejero',
			phone: '(0351) 5145491',
			email: 'fgavier@duitpropiedades.com.ar',
			facebook: 'https://www.facebook.com/fngavier',
			twitter: 'https://twitter.com/fngavier',
			linkedin: '',
			instagram: '',
			pic: '/images/team/fernando-gavier-profile.jpg',
		},
		{
			name: 'Severo Sosa',
			position: 'Consejero',
			phone: '(351) 5648467',
			email: 'severo@duitpropiedades.com.ar',
			facebook: 'https://www.facebook.com/sapo.sosa',
			twitter: 'https://twitter.com/severososa',
			linkedin: 'https://www.linkedin.com/in/severo-sosa-barreneche-590a3b1b/',
			instagram: 'http://www.instagram.com/sapososa/',
			pic: '/images/team/severo-sosa-profile.jpg',
		},
		{
			name: 'Santiago Paulus',
			position: 'Asesor',
			phone: '(351) 5908204',
			email: 'santiago@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/santiago-pablu-profile.jpg',
		},
		{
			name: 'Maria Victoria Colombo',
			position: 'Asesora',
			phone: '(351) 3490274',
			email: 'mariav@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/maria-victoria-colombo-profile.jpg',
		},
		{
			name: 'Matias Navarro',
			position: 'Asesor',
			phone: '(351) 3907964',
			email: 'matias@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/matias-navarro-profile.jpg',
		},
		{
			name: 'Tomas Martinez',
			position: 'Asesor',
			phone: '(351) 6808842',
			email: 'tomas@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/tomas-martinez-profile.jpg',
		},
		{
			name: 'Maria Luz Caceres',
			position: 'Administración',
			phone: '(351) 2463606',
			email: 'administracion@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/maria-luz-caceres-profile.jpg',
		},
		{
			name: 'Maria Pamela Caceres',
			position: 'Administración',
			phone: '(351) 8119965',
			email: 'administracion@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/maria-pamela-caceres-profile.jpg',
		},
	];

	this.propertiesSubTypes = {
		// Houses subtypes
		3: [
			{
				id: 718,
				name: 'Barrios Abiertos',
			},
			{
				id: 719,
				name: 'Barrios Cerrados',
			},
		],
		// Apartments subtypes
		2: [
			{
				id: 673,
				name: 'A Estrenar',
			},
			{
				id: 653,
				name: 'Construcción',
			},
			{
				id: 674,
				name: 'Usados',
			},
		],
		// Terreno
		1: [
			{
				id: 720,
				name: 'Abiertos',
			},
			{
				id: 721,
				name: 'Cerrados',
			},
		],
	};

	this.propertiesTypes = [
		{
			id: 3,
			name: 'Casas / Dúplex',
		},
		{
			id: 2,
			name: 'Departamentos',
		},
		{
			id: 7,
			name: 'Locales',
		},
		{
			id: 5,
			name: 'Oficinas',
		},
		{
			id: 1,
			name: 'Terrenos',
		},
		{
			id: 10,
			name: 'Cocheras',
		},
		{
			id: 14,
			name: 'Depósitos',
		},
		{
			id: 99,
			name: 'Emprendimientos',
			showOnlyInOperationType: 1,
			goTo: { page: 'emprendimientos', section: '' },
		},
	];

	this.tokkoSearchArgs = {
		data: {
			current_localization_id: 0,
			current_localization_type: 'country',
			price_from: 0,
			price_to: 999999999,
			operation_types: [1, 2],
			property_types: [1, 2, 3, 5, 7, 10, 14], // Search only for types listed in this.propertiesTypes array.
			currency: 'ANY',
			filters: [],
		},
	};

	this.tokkoSearchArgs.sData = `{"current_localization_id":${this.tokkoSearchArgs.data.current_localization_id},"current_localization_type":"${this.tokkoSearchArgs.data.current_localization_type}","price_from":${this.tokkoSearchArgs.data.price_from},"price_to":${this.tokkoSearchArgs.data.price_to},"operation_types":[${this.tokkoSearchArgs.data.operation_types}],"property_types":[${this.tokkoSearchArgs.data.property_types}],"currency":"${this.tokkoSearchArgs.data.currency}","filters":[${this.tokkoSearchArgs.data.filters}]}`;

	this.devs = [];

	this.setDevs = (value) => (this.devs = value);

	this.propertySearchScrollY = 0;
});
