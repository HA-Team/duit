app.service('sharedData', function () {
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
			name: 'Fernando Gavier',
			position: 'Consejero',
			phone: '(0351) 155145491',
			email: 'fgavier@duitpropiedades.com.ar',
			facebook: 'https://www.facebook.com/fngavier',
			twitter: 'https://twitter.com/fngavier',
			linkedin: '',
			instagram: '',
			pic: '/images/team/fernando-gavier-profile.jpg',
		},
		{
			name: 'Hugo Miranda',
			position: 'Consejero',
			phone: '(351) 2462630',
			email: 'hmiranda@duitpropiedades.com.ar',
			facebook: ' ',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/hugo-miranda-profile.jpg',
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
			name: 'Carolina Valarolo',
			position: 'Consejera',
			phone: '(351) 5513711',
			email: 'carolina@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/carolina-valarolo-1-profile.jpg',
		},
		{
			name: 'Teresita Sciortino',
			position: 'Secretaria Administración',
			phone: '(351) 6840250',
			email: 'teresita@duitpropiedades.com.ar',
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
			pic: '/images/team/recepcion-profile.jpg',
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
		]
	};

	this.propertiesTypes = [
		{
			id: 3,
			name: 'Casas',
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
			goTo: { page: 'developments', section: '' },
		},
	];

	this.tokkoSearchArgs = {
		data: {
			current_localization_id: 0,
			current_localization_type: 'country',
			price_from: 0,
			price_to: 999999999,
			operation_types: [1, 2],
			property_types: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			currency: 'ANY',
			filters: [],
		},
		sData:
			'{"current_localization_id":0,"current_localization_type":"country","price_from":0,"price_to":999999999,"operation_types":[1,2],"property_types":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],"currency":"ANY","filters":[]}',
	};

	this.devs = [];

	this.setDevs = (value) => this.devs = value;
});
