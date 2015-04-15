var tilePatterns = [
		{ imagecount: 2, 	pattern: 	'lw' 						}, // TO
		{ imagecount: 2, 	pattern: 	'wl' 						}, // TO
		{ imagecount: 4, 	pattern: 	'llss' 					}, // TOP
		{ imagecount: 5, 	pattern: 	'wssss' 				}, // TO
		{ imagecount: 5, 	pattern: 	'twsss' 				}, // TOP
		{ imagecount: 7, 	pattern: 	'tlsssss' 			},
	];

var letterToSize = function(letter) {
			switch (letter) {
				case 'l':
					return 'large';
				case 't':
					return 'tall';
				case 'w':
					return 'wide';
				case 's':
					return 'small';
			}
	};