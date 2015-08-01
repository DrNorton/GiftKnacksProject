'use strict';
/**
 * @ngdoc function
 * @name giftknacksApp.controller:RootCtrl
 * @description
 * # Контроллер всего приложения
 * Controller of the giftknacksApp
 */
app.controller( 'RootCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {

	$scope.logOut = function () {
		authService.logOut();
		$location.path( '/landing' );
	}

	$scope.authentication = authService.authentication;
	$scope.$on( '$locationChangeStart', function ( event, next, current ) {
		if ( $scope.authentication.isAuth && next !== current && current.indexOf( 'profile' ) > -1 ) {
			var answer = confirm( 'Are you sure you want to leave this page?' );
			if ( !answer ) {
				event.preventDefault();
			}
		}
	} );
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:MainCtrl
 * @description
 * # Контроллер главной страницы
 * Controller of the giftknacksApp
 */
app.controller( 'MainCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {
	if ( authService.authentication.isAuth ) {
		$location.path( '/dashboard' );
	}
	$scope.slideinterval = 5000;
	var slides = $scope.slides = [
	{ image: './img/large_1.jpg' },
	{ image: './img/palms.jpg' },
	{ image: './img/presents.jpg' }];
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:UserCtrl
 * @description
 * # Контроллер страницы юзера
 * Controller of the giftknacksApp
 */
app.controller( 'UserCtrl', ['$scope', 'authService', 'initialData', 'commonService', function ( $scope, authService, initialData, commonService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.user = {};
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.user = initialData.data.Result;
	}
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:UserCtrl
 * @description
 * # Контроллер страницы юзера
 * Controller of the giftknacksApp
 */
app.controller( 'HistoryCtrl', ['$scope', 'authService', 'giftsData', 'wishesData', 'commonService', function ( $scope, authService, giftsData,wishesData, commonService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.gifts = [];
	$scope.wishes = [];
	if ( giftsData.data && !giftsData.data.ErrorCode ) {
		$scope.gifts = giftsData.data.Result;
	}
	if ( wishesData.data && !wishesData.data.ErrorCode ) {
		$scope.wishes = wishesData.data.Result;
	}
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:DashboardCtrl
 * @description
 * # Контроллер страницы с последней активностью пользователя
 * Controller of the giftknacksApp
 */
app.controller( 'DashboardCtrl', ['$scope', 'authService', 'initialData', 'historyData', 'wishAndGiftService', function ( $scope, authService, initialData, historyData, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;

	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.nearWishes = initialData.data.Result.Wishes;
		$scope.nearGifts = initialData.data.Result.Gifts;
		$scope.nearMembers = initialData.data.Result.Members;
	}
	if ( historyData.data && !historyData.data.ErrorCode ) {
		$scope.historyWishes = historyData.data.Result.Wishes;
		$scope.historyGifts = historyData.data.Result.Gifts;
	}
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:FindWishCtrl
 * @description
 * # Контроллер страницы поиска вишей
 * Controller of the giftknacksApp
 */
app.controller( 'FindWishCtrl', ['$scope', 'authService', /*'initialData',*/ 'countries', 'commonService', 'wishAndGiftService', function ( $scope, authService, /*initialData,*/ countries, commonService, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.countries = [];
	$scope.getCountryError = false;
	$scope.wasSubmittedWish = false;
	$scope.queryWish = { busy: false, Offset: -20, Length: 20 };
	$scope.listWish = [];
	//lazy load

	$scope.loadWishes = function ( offset, newSearch ) {
		$scope.queryWish.busy = true;
		$scope.queryWish.Offset = typeof offset == "undefined" ? ( $scope.queryWish.Offset + $scope.queryWish.Length ) : offset;
		wishAndGiftService.getWishes( $scope.queryWish ).then( function ( response ) {
			$scope.queryWish.busy = false;
			if ( response.data && !response.data.ErrorCode ) {
				$scope.listWish = newSearch ? response.data.Result : $scope.listWish.concat( response.data.Result );
			} else {
				$scope.listWish = newSearch ? { Name: response.data.ErrorMessage } : $scope.listWish.concat( { Name: response.data.ErrorMessage } );
			}
		}, function ( response ) {
			$scope.listWish = $scope.listWish.concat( { Name: "Failed to search wishes due to: " + commonService.displayError() } );
			$scope.queryWish.busy = false;
		} );
	};
	//если начальные данные для виша получены
	/*if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.listGift = initialData.data.Result;
	}*/
	//#region получение стран и городов
	if ( countries.data && !countries.data.ErrorCode ) {
		$scope.countries = countries.data.Result;
	} else {
		//TODO: log error
		$scope.getCountryError = true;
	}

	$scope.getCountries = function ( term ) {

		var filterCountries = $scope.countries.filter( function ( value ) {
			return value.Name.toLowerCase().startsWith( term.toLowerCase() );
		} );
		return filterCountries
	}
	//#endregion

	$scope.submitWish = function ( isValid ) {
		$scope.wasSubmittedWish = true;
		if ( isValid && $scope.enoughData ) {
			$scope.loadWishes( 0, true );
		}
	};

	$scope.resetWish = function () {
		$scope.wasSubmittedWish = false;
	};
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:FindGiftCtrl
 * @description
 * # Контроллер страницы поиска гифтов
 * Controller of the giftknacksApp
 */
app.controller( 'FindGiftCtrl', ['$scope', 'authService', /*'initialData',*/ 'countries', 'commonService', 'wishAndGiftService', function ( $scope, authService, /*initialData,*/ countries, commonService, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.countries = [];
	$scope.getCountryError = false;
	$scope.wasSubmittedGift = false;
	$scope.queryGift = { busy: false, Offset: -20, Length: 20 };
	$scope.listGift = [];
	//lazy load
	$scope.loadGifts = function ( offset, newSearch ) {
		$scope.queryGift.busy = true;
		$scope.queryGift.Offset = typeof offset == "undefined" ? ( $scope.queryGift.Offset + $scope.queryGift.Length ) : offset;
		wishAndGiftService.getGifts( $scope.queryGift ).then( function ( response ) {
			$scope.queryGift.busy = false;
			if ( response.data && !response.data.ErrorCode ) {
				$scope.listGift = newSearch ? response.data.Result : $scope.listGift.concat( response.data.Result );
			} else {
				$scope.listGift = newSearch ? { Name: response.data.ErrorMessage } : $scope.listGift.concat( { Name: response.data.ErrorMessage } );
			}
		}, function ( response ) {
			$scope.listGift = $scope.listGift.concat( { Name: "Failed to search gifts due to: " + commonService.displayError() } );
			$scope.queryGift.busy = false;
		} );
	};

	//если начальные данные для виша получены
	/*if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.listGift = initialData.data.Result;
	}*/
	//#region получение стран и городов
	if ( countries.data && !countries.data.ErrorCode ) {
		$scope.countries = countries.data.Result;
	} else {
		//TODO: log error
		$scope.getCountryError = true;
	}

	$scope.getCountries = function ( term ) {

		var filterCountries = $scope.countries.filter( function ( value ) {
			return value.Name.toLowerCase().startsWith( term.toLowerCase() );
		} );
		return filterCountries
	}
	//#endregion

	$scope.submitGift = function ( isValid ) {
		$scope.wasSubmittedGift = true;
		if ( isValid && $scope.enoughData ) {
			$scope.loadGifts( 0, true );
		}
	};
	$scope.resetGift = function () {
		$scope.wasSubmittedGift = false;
	};
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:ItemCardCtrl
 * @description
 * # Контроллер страницы информации о гифте или више
 * Controller of the giftknacksApp
 */
app.controller( 'ItemCardCtrl', ['$scope', '$modal', '$route', 'authService', 'initialData', 'commonService', 'wishAndGiftService', function ( $scope, $modal, $route, authService, initialData, commonService, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;


	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.item = initialData.data.Result;

		//wish emergency
		$scope.emergencyType = 'success';
		$scope.percent = 0;
		if ( $scope.item.Emergency ) {
			$scope.percent = Math.round( 100 * ( $scope.item.Emergency / 20 ) );
			if ( $scope.percent < 25 ) {
				$scope.emergencyType = 'success';
			} else if ( $scope.percent < 50 ) {
				$scope.emergencyType = 'info';
			} else if ( $scope.percent < 75 ) {
				$scope.emergencyType = 'warning';
			} else {
				$scope.emergencyType = 'danger';
			}
		}

	}
	$scope.showmygifts = function () {
		wishAndGiftService.showMyGifts().then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {

					var modalInstance = $modal.open({
						templateUrl: '/templates/wishgiftlist.html',
						controller: 'ModalInstanceCtrl',
						resolve: {
							items: function () {
								return response.data.Result;
							},
							params: function () {
								return { 'type': 'gift', 'parentid': $scope.item.Id,'parenttype':'wish' };
							}
						}
					});

					modalInstance.result.then(function (selectedGift) {
						wishAndGiftService.linkWishAndGift($scope.item.Id, selectedGift ).then( function ( response ) {
							if ( response.data && !response.data.ErrorCode ) {
								$route.reload();
							} else {
								//$scope.message = response.data.ErrorMessage;
							}
						}, function ( response ) {
							//$scope.message = "Failed to add wish due to: " + commonService.displayError();

						} );
					}, function () {
						//$log.info('Modal dismissed at: ' + new Date());
					});
				
			} else {
				//TODO: popup message error
			}
		}, function ( response ) {
			//TODO: popup message error "Failed to add wish due to: " + commonService.displayError();
		} );
	}
	$scope.showmywishes = function () {
		wishAndGiftService.showMyWishes().then( function ( response ) {
			if ( response.data && !response.data.ErrorCode ) {
				var modalInstance = $modal.open( {
					templateUrl: '/templates/wishgiftlist.html',
					controller: 'ModalInstanceCtrl',
					resolve: {
						items: function () {
							return response.data.Result;
						},
						params: function () {
							return { 'type': 'wish', 'parentid': $scope.item.Id, 'parenttype':'gift' };
						}
					}
				} );

				modalInstance.result.then( function ( selectedWish ) {
					wishAndGiftService.linkWishAndGift( selectedWish, $scope.item.Id ).then( function ( response ) {
						if ( response.data && !response.data.ErrorCode ) {
							$route.reload();
						} else {
							//$scope.message = response.data.ErrorMessage;
						}
					}, function ( response ) {
						//$scope.message = "Failed to add wish due to: " + commonService.displayError();

					} );
				}, function () {
					//$log.info('Modal dismissed at: ' + new Date());
				} );
			} else {
				//TODO: popup message error
			}
		}, function ( response ) {
			//TODO: popup message error "Failed to add wish due to: " + commonService.displayError();
		} );
	}

}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ModalInstanceCtrl
 * @description
 * # Контроллер popup'ов
 * Controller of the giftknacksApp
 */
app.controller( 'ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', 'params', function ( $scope, $modalInstance, items, params ) {

	$scope.items = items;
	$scope.type = params.type;
	$scope.parentid = params.parentid;
	$scope.parenttype = params.parenttype;
	$scope.link = params.type + 'form';

	$scope.select = function (id) {
		$modalInstance.close( id );
	};
	$scope.create = function ( ) {
		$modalInstance.dismiss( 'add new' );
	};

	$scope.cancel = function () {
		$modalInstance.dismiss( 'cancel' );
	};
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:WishFormCtrl
 * @description
 * # Контроллер создания нового виша
 * Controller of the giftknacksApp
 */
app.controller( 'WishFormCtrl', ['$scope','$location', 'authService', 'initialData', 'countries','startPoint', 'commonService', 'wishAndGiftService', function ( $scope,$location, authService, initialData, countries,startPoint, commonService, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.wasSubmitted = false;
	$scope.percent = 0;
	$scope.overEmergency = 0;
	$scope.firstAppearance = true;
	$scope.imageExist = false;
	$scope.countries = [];
	$scope.cityOptions = {};
	$scope.getCountryError = false;
	$scope.wish = {};



	//если начальные данные для виша получены
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.wish = initialData.data.Result;
		$scope.wishCategories = $scope.wish.WishCategories
		delete $scope.wish['WishCategories'];
		$scope.wish.Category = '';
		$scope.imageExist = !!$scope.wish.ImageUrl;
		$scope.cityOptions.country = $scope.wish.Country ? $scope.wish.Country.Code : '';
		$scope.cityOptions.types = $scope.wish.Country ? '(cities)' : '';

	}
	//#region получение стран и городов
	$scope.countryFromTypehead = !!$scope.wish.Country;

	if ( countries.data && !countries.data.ErrorCode ) {
		$scope.countries = countries.data.Result;
	} else {
		//TODO: log error
		$scope.getCountryError = true;
	}
	//изменения в input страны
	$scope.countryChange = function () {
		$scope.wish.City = '';
		$scope.wish.Country.Code = '';
		$scope.countryFromTypehead = false;
	}
	//выбор страны из списка
	$scope.countrySelect = function ( $item, $model, $label ) {
		$scope.countryFromTypehead = true;
		$scope.wish.Country.Code = $item.Code;
		$scope.cityOptions = {
			types: '(cities)',
			country: $item.Code
		}
	}

	$scope.getCountries = function ( term ) {

		var filterCountries = $scope.countries.filter( function ( value ) {
			return value.Name.toLowerCase().startsWith( term.toLowerCase() );
		} );
		return filterCountries
	}
	//#endregion

	//#region emergency
	$scope.hoveringOver = function ( value ) {
		$scope.firstAppearance = false;
		$scope.overEmergency = value;
		$scope.percent = Math.round( 100 * ( value / 20 ) );
	};
	//#endregion

	$scope.submit = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid && $scope.enoughData ) {
			wishAndGiftService.addWish( $scope.wish ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.savedSuccessfully = true;
					$scope.message = "Wish has been added successfully.";
					if ( startPoint ) {
						//прилинковать созданный виш
						wishAndGiftService.linkWishAndGift( response.data.Result.Id, startPoint.itemid ).then( function ( response ) {
							if ( response.data && !response.data.ErrorCode ) {
								$location.$$search = {};
								$location.path( startPoint.itemtype + '/' + startPoint.itemid );
							} else {
								//$scope.message = response.data.ErrorMessage;
							}
						}, function ( response ) {
							//$scope.message = "Failed to add wish due to: " + commonService.displayError();
						} );
					}
					else {
						$location.path( '/history' );
					}
				} else {
					$scope.savedSuccessfully = false;
					$scope.message = response.data.ErrorMessage;
				}
			}, function ( response ) {
				$scope.savedSuccessfully = false;
				$scope.message = "Failed to add wish due to: " + commonService.displayError();
			} );
		}
	};
	$scope.reset = function () {
		$scope.wasSubmitted = false;
		$scope.wish.Emergency = 0;
		$scope.percent = 0;
	};
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:GiftFormCtrl
 * @description
 * # Контроллер создания нового гифта
 * Controller of the giftknacksApp
 */
app.controller( 'GiftFormCtrl', ['$scope','$location', 'authService', 'initialData', 'countries','startPoint', 'commonService', 'wishAndGiftService', function ( $scope,$location, authService, initialData, countries,startPoint, commonService, wishAndGiftService ) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.wasSubmitted = false;
	$scope.firstAppearance = true;
	$scope.countries = [];
	$scope.cityOptions = {};
	$scope.getCountryError = false;
	$scope.gift = {};


	//если начальные данные для виша получены
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.gift = initialData.data.Result;
		$scope.cityOptions.country = $scope.gift.Country ? $scope.gift.Country.Code : '';
		$scope.cityOptions.types = $scope.gift.Country ? '(cities)' : '';

	}
	//#region получение стран и городов
	$scope.countryFromTypehead = !!$scope.gift.Country;

	if ( countries.data && !countries.data.ErrorCode ) {
		$scope.countries = countries.data.Result;
	} else {
		//TODO: log error
		$scope.getCountryError = true;
	}
	//изменения в input страны
	$scope.countryChange = function () {
		$scope.gift.City = '';
		$scope.gift.Country.Code = '';
		$scope.countryFromTypehead = false;
	}
	//выбор страны из списка
	$scope.countrySelect = function ( $item, $model, $label ) {
		$scope.countryFromTypehead = true;
		$scope.gift.Country.Code = $item.Code;
		$scope.cityOptions = {
			types: '(cities)',
			country: $item.Code
		}
	}

	$scope.getCountries = function ( term ) {

		var filterCountries = $scope.countries.filter( function ( value ) {
			return value.Name.toLowerCase().startsWith( term.toLowerCase() );
		} );
		return filterCountries
	}
	//#endregion

	$scope.submit = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid && $scope.enoughData ) {
			wishAndGiftService.addGift( $scope.gift ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.savedSuccessfully = true;
					$scope.message = "Gift has been added successfully.";
					if ( startPoint ) {
						//прилинковать созданный гифт
						wishAndGiftService.linkWishAndGift( startPoint.itemid, response.data.Result.Id ).then( function ( response ) {
							if ( response.data && !response.data.ErrorCode ) {
								$location.$$search = {};
								$location.path( startPoint.itemtype + '/' + startPoint.itemid );
							} else {
								//$scope.message = response.data.ErrorMessage;
							}
						}, function ( response ) {
							//$scope.message = "Failed to add wish due to: " + commonService.displayError();
						} );
					}
					else {
						$location.path( '/history' );
					}
				} else {
					$scope.savedSuccessfully = false;
					$scope.message = response.data.ErrorMessage;
				}
			}, function ( response ) {
				$scope.savedSuccessfully = false;
				$scope.message = "Failed to add gift due to: " + commonService.displayError();
			} );
		}
	};
	$scope.reset = function () {
		$scope.wasSubmitted = false;
	};
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ProfileCtrl
 * @description
 * # Контроллер профиля
 * Controller of the giftknacksApp
 */
app.controller( 'ProfileCtrl', ['$scope', '$location', '$timeout', 'authService', 'profileService', 'initialData', 'countries', 'commonService', 'geoService', function ( $scope, $location, $timeout, authService, profileService, initialData, countries, commonService, geoService ) {
	$scope.wasSubmitted = false;
	$scope.wasChangePasswordSubmitted = false;
	$scope.passwordSavedSuccessfully = false;
	$scope.profileSavedSuccessfully = false;
	$scope.profileGetSuccessfully = false;
	$scope.passwordMessage = "";
	$scope.profileMessage = "";
	$scope.profileGetMessage = "";
	$scope.newContact = 'new';
	$scope.countries = [];
	$scope.cityOptions = {};
	$scope.getCountryError = false;

	//password
	$scope.passwordData = {
		oldPassword: "",
		newPassword: "",
		confirmNewPassword: ""
	};

	$scope.profile = {};

	//если данные профиля получены
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.profile = initialData.data.Result;
		$scope.profileGetMessage = "";
		$scope.profileGetSuccessfully = true;
		$scope.avatarExist = !!$scope.profile.AvatarUrl;
		$scope.cityOptions.country = $scope.profile.Country ? $scope.profile.Country.Code : '';
		$scope.cityOptions.types = $scope.profile.Country ? '(cities)' : '';


		//обработка массива контактов
		for ( var i = 0; i < $scope.profile.Contacts.length; i++ ) {
			var contact = $scope.profile.Contacts[i];
			if ( contact.MainContact ) {
				$scope.profile.MainContact = contact.Name;
			}
			//удаление из списка всех контактов тех, которые уже есть
			var index = $scope.profile.ContactTypes.indexOf( contact.Name );
			if ( index > -1 ) {
				$scope.profile.ContactTypes.splice( index, 1 );
			}
		}
	}
	else {
		$scope.profileGetMessage = "Failed to get user data:" + initialData.data.ErrorMessage;
		$scope.profileGetSuccessfully = false;
	}

	//#region получение стран и городов
	$scope.countryFromTypehead = !!$scope.profile.Country;

	if ( countries.data && !countries.data.ErrorCode ) {
		$scope.countries = countries.data.Result;
	} else {
		//TODO: log error
		$scope.getCountryError = true;
	}
	//изменения в input страны
	$scope.countryChange = function () {
		$scope.profile.City = '';
		$scope.profile.Country.Code = '';
		$scope.countryFromTypehead = false;
	}
	//выбор страны из списка
	$scope.countrySelect = function ( $item, $model, $label ) {
		$scope.countryFromTypehead = true;
		$scope.profile.Country.Code = $item.Code;
		$scope.cityOptions = {
			types: '(cities)',
			country: $item.Code
		}
	}

	$scope.getCountries = function ( term ) {

		var filterCountries = $scope.countries.filter( function ( value ) {
			return value.Name.toLowerCase().startsWith( term.toLowerCase() );
		} );
		return filterCountries
	}
	//#endregion
	//#region контакты
	//выбрать главный контакт
	$scope.chooseMainContact = function ( name ) {
		for ( var i = 0; i < $scope.profile.Contacts.length; i++ ) {
			var contact = $scope.profile.Contacts[i];
			contact.MainContact = contact.Name === name;
		}
	}
	//добавить контакт из списка
	$scope.updateContacts = function () {
		var index = $scope.profile.ContactTypes.indexOf( $scope.newContact );
		$scope.profile.ContactTypes.splice( index, 1 );
		$scope.profile.Contacts.push( { Name: $scope.newContact, Value: '', MainContact: false } );
		$scope.newContact = 'new';
	}
	//удалить контакт
	$scope.removeContact = function ( name ) {
		var setNewMain = false;
		$scope.profile.ContactTypes.push( name );
		for ( var i = 0; i < $scope.profile.Contacts.length; i++ ) {
			var contact = $scope.profile.Contacts[i];
			if ( contact.Name === name ) {
				setNewMain = contact.MainContact;
				$scope.profile.Contacts.splice( i, 1 );
				break;
			}
		}
		if ( setNewMain ) {
			$scope.profile.Contacts[0].MainContact = true;
			$scope.profile.MainContact = $scope.profile.Contacts[0].Name;
		}
	}
	//#endregion

	//обноление пароля
	$scope.changePassword = function ( isValid ) {
		$scope.wasChangePasswordSubmitted = true;
		if ( isValid ) {
			authService.changePassword( $scope.passwordData ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.passwordSavedSuccessfully = true;
					$scope.wasChangePasswordSubmitted = false;
					$scope.passwordData = {
						oldPassword: "",
						newPassword: "",
						confirmNewPassword: ""
					};
					$scope.passwordMessage = "Password has been changed successfully.";
				} else {
					$scope.passwordSavedSuccessfully = false;
					$scope.passwordMessage = response.data.ErrorMessage;
				}
			},
			 function ( response ) {

			 	$scope.passwordSavedSuccessfully = false;
			 	$scope.passwordMessage = "Failed to change password user due to:" + msg;
			 } );
		}

	};

	$scope.updatePtofile = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid ) {
			profileService.updatePtofile( $scope.profile ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.profile.ProfileProgress = response.data.Result.ProfileProgress;
					$scope.profileSavedSuccessfully = true;
					authService.setIsFilled( true );
					$scope.profileMessage = "Profile has been saved successfully.";
				} else {
					$scope.profileSavedSuccessfully = false;
					$scope.profileMessage = response.data.ErrorMessage;
				}
			}, function ( response ) {
				$scope.profileSavedSuccessfully = false;
				$scope.profileMessage = "Failed to save profile due to: " + commonService.displayError();
			} );
		}

	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.path( '/login' );
		}, 2000 );
	}
}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:SignupCtrl
 * @description
 * # Контроллер регистрации
 * Controller of the giftknacksApp
 */
app.controller( 'SignupCtrl', ['$scope', '$location', '$timeout', 'authService', 'commonService', function ( $scope, $location, $timeout, authService, commonService ) {

	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.title = 'Sign Up';
	$scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.wasSubmitted = false;

	$scope.registration = {
		email: "",
		password: "",
		confirmPassword: ""
	};

	$scope.submit = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid ) {
			authService.saveRegistration( $scope.registration ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.savedSuccessfully = true;
					$scope.message = "Thanks for signing up on KnacksGifter! We just sent you a confirmation email to " + $scope.registration.email + ". You will be redicted to home page in 10 seconds.";
					startTimer();
				} else {
					$scope.savedSuccessfully = false;
					$scope.message = response.data.ErrorMessage;
				}


			}, function ( response ) {
				$scope.savedSuccessfully = false;
				$scope.message = "Failed to register user due to:" + commonService.displayError();
			} );
		}

	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.path( '/landing' );
		}, 10000 );
	}

}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:LoginCtrl
 * @description
 * # Контроллер авторизации
 * Controller of the giftknacksApp
 */
app.controller( 'LoginCtrl', ['$scope', '$location', 'authService', 'confirmUser', '$routeParams', function ( $scope, $location, authService, confirmUser, $routeParams ) {
	authService.logOut();
	var email = $routeParams.email || '';
	$scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.wasSubmitted = false;
	$scope.loginData = {
		userName: email,
		password: ""
	};

	$scope.message = "";

	$scope.login = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid ) {
			authService.login( $scope.loginData ).then( function ( response ) {
				$location.url( $location.path() );
				$location.path( '/dashboard' );

			},
					 function ( err ) {
					 	$scope.message = err.error_description;
					 } );
		}

	};

}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ForgotPassCtrl
 * @description
 * # Контроллер отправки email для восстановления пароля
 * Controller of the giftknacksApp
 */
app.controller( 'ForgotPassCtrl', ['$scope', '$location', 'authService', function ( $scope, $location, authService ) {
	authService.logOut();
	$scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.wasSubmitted = false;
	$scope.sent = false;
	$scope.email = {
		email: ""
	};

	$scope.message = "";

	$scope.sendReset = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid ) {
			authService.sendReset( $scope.email ).then( function ( response ) {
				$scope.sent = true;
				$scope.message = 'We sent you a reset instructions to ' + $scope.email.email;

			},
			 function ( err ) {
			 	$scope.sent = false;
			 	$scope.message = err.error_description;
			 } );
		}

	};

}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:RecoverCtrl
 * @description
 * # Контроллер восстановления пароля
 * Controller of the giftknacksApp
 */
app.controller( 'RecoverCtrl', ['$scope', '$location', '$timeout', '$routeParams', 'authService', 'commonService', function ( $scope, $location, $timeout, $routeParams, authService, commonService ) {
	$scope.token = $routeParams.token;
	$scope.savedSuccessfully = false;
	$scope.message = "";
	$scope.title = 'Reset password';
	$scope.emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	$scope.wasSubmitted = false;


	$scope.registration = {
		email: $routeParams.email,
		password: "",
		confirmPassword: "",
		code: $routeParams.token
	};
	//TODO: parse href for email and token 
	$scope.submit = function ( isValid ) {
		$scope.wasSubmitted = true;
		if ( isValid ) {
			authService.resetPassword( $scope.registration ).then( function ( response ) {
				if ( response.data && !response.data.ErrorCode ) {
					$scope.savedSuccessfully = true;
					$scope.message = "Your password was reset. You will be redicted to login page in 2 seconds.";
					startTimer();
				} else {
					$scope.savedSuccessfully = false;
					$scope.message = response.data.ErrorMessage;
				}


			}, function ( response ) {
				$scope.savedSuccessfully = false;
				$scope.message = "Failed to reset password due to:" + commonService.displayError();
			} );
		}

	};

	var startTimer = function () {
		var timer = $timeout( function () {
			$timeout.cancel( timer );
			$location.search( 'token', null );
			$location.path( '/login' );
		}, 2000 );
	}

}] );