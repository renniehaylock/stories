// var tilePatterns = [
// 		{ imagecount: 4, 	pattern: 	'lwss' 					}, // TOP
// 		{ imagecount: 4, 	pattern: 	'wlss' 					}, // TOP
// 		{ imagecount: 6, 	pattern: 	'llssss' 				}, // TOP
// 		{ imagecount: 7, 	pattern: 	'wssssss' 			},
// 		{ imagecount: 7, 	pattern: 	'tllssss' 			}, // TOP
// 		{ imagecount: 9, 	pattern: 	'lssssssss' 		},
// 		{ imagecount: 10, pattern: 	'tlssssssss' 	},
// 	];

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