export const NavAProps = {
	image: {
		_type: 'image',
		value: 'https://via.placeholder.com/50'
	},

	/*
	links: {
		_type: 'array',
		value: [
			{
				link: {
					_type: 'button',
					value: {
						text: {
							_type: 'textfield',
							value: 'Link 1',
						},
						link: {
							_type: 'textfield',
							value: 'link',
						},
					}
				},
			},
			{
				link: {
					_type: 'button',
					value: {
						text: {
							_type: 'textfield',
							value: 'Link 1',
						},
						link: {
							_type: 'textfield',
							value: 'link',
						},
					}
				},
			},
			{
				link: {
					_type: 'button',
					value: {
						text: {
							_type: 'textfield',
							value: 'Link 1',
						},
						link: {
							_type: 'textfield',
							value: 'link',
						},
					}
				},
			},
		],
	},
	*/
	button: {
		_type: 'button',
		value: {
			text: {
				_type: 'textfield',
				value: 'Button',
			},
			link: {
				_type: 'textfield',
				value: 'link',
			},
			isMint: {
				_type: 'boolean',
				value: false
			}
		}
	},
	background: {
		value: '#fff',
		_type: 'textfield',
	}
};


