'use strict';
/**
 * @ngdoc function
 * @name giftknacksApp.controller:RootCtrl
 * @description
 * # Контроллер всего приложения
 * Controller of the giftknacksApp
 */
app.controller('RootCtrl', ['$scope', '$location', 'authService', 'signalRHubProxy', function ($scope, $location, authService, signalRHubProxy) {

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
	});

	var onlineHubProxy = signalRHubProxy(signalRHubProxy.defaultServer, 'onlinehub');
	onlineHubProxy.startPromise.done(function () {
	    onlineHubProxy.invoke('getUserOnline', function () {
	        console.log('getUserOnline done ');
	    });
	});
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
 * @name giftknacksApp.controller:FaqCtrl
 * @description
 * # Контроллер информационной страницы
 * Controller of the giftknacksApp
 */
app.controller('FaqCtrl', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
    $scope.selectedLink = 'faq';
    if ($location.hash()) {
        $anchorScroll();
        $scope.selectedLink = $location.hash();
    }

    

    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    }
}]);


/**
 * @ngdoc function
 * @name giftknacksApp.controller:UserCtrl
 * @description
 * # Контроллер страницы юзера
 * Controller of the giftknacksApp
 */
app.controller('UserCtrl', ['$scope', '$modal', 'authService', 'initialData', 'commonService', 'wishAndGiftService', 'profileService','referenceService', '$location', function ($scope, $modal, authService, initialData, commonService, wishAndGiftService, profileService,referenceService, $location) {
    $scope.enoughData = authService.authentication.isFilled;
    $scope.myId = authService.authentication.userId;
    $scope.user = {};
    $scope.gifts = [];
    $scope.wishes = [];
    $scope.references = [];
    

	$scope.recentRequestsExist = false;
	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.user = initialData.data.Result;
	}
	$scope.getRecentRequests = function (skip) {
	    $scope.recentRequestsExist = true;
	    if (!skip) {
	        wishAndGiftService.showGifts({ Length: 5, Id: $scope.user.Id }).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.gifts = response.data.Result;
	            } else {
	                //TODO:  message error
	            }
	        }, function (response) { /*TODO:  message error "Failed to add wish due to: " + commonService.displayError();*/ });

	        wishAndGiftService.showWishes({ Length: 5, Id: $scope.user.Id }).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.wishes = response.data.Result;
	            } else {
	                //TODO:  message error
	            }
	        }, function (response) {/*TODO:  message error "Failed to add wish due to: " + commonService.displayError();*/ });
	    }
	 
	}

	$scope.addReference = function () {
	 
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/addreference.html',
	        controller: 'AddReferenceCtrl',
	        resolve: {
	            params: function () {
	                return { 'OwnerId': $scope.user.Id };
	            }
	        }
	    });

	}

	$scope.getReferences = function () {
	    referenceService.getReferences($scope.user.Id).then(function (response) {
	        if (response.data && !response.data.ErrorCode) {
	            $scope.references = response.data.Result;
	        } else {
	            //$scope.message = response.data.ErrorMessage;
	        }
	    }, function (response) {
	        //$scope.message = "Failed to add wish due to: " + commonService.displayError();

	    });
	}

	if ($location.search().action == 'addreference') {
	    $scope.addReference();
	}
	$location.search('action', null);
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:UserCtrl
 * @description
 * # Контроллер страницы юзера
 * Controller of the giftknacksApp
 */
app.controller('HistoryCtrl', ['$scope', 'authService', 'commonService', 'wishAndGiftService', 'countries', function ($scope, authService, commonService, wishAndGiftService, countries) {
	$scope.enoughData = authService.authentication.isFilled;
	$scope.gifts = [];
	$scope.wishes = [];
	$scope.query = {StatusCode:-1}
	$scope.queryGift = null;
	$scope.queryWish = null;
	$scope.wasSubmitted = false;
	$scope.tab = '';

    //#region получение стран и городов
	if (countries.data && !countries.data.ErrorCode) {
	    $scope.countries = countries.data.Result;
	} else {
	    //TODO: log error
	    $scope.getCountryError = true;
	}

	$scope.getCountries = function (term) {

	    var filterCountries = $scope.countries.filter(function (value) {
	        return value.Name.toLowerCase().startsWith(term.toLowerCase());
	    });
	    return filterCountries
	}
    //#endregion

	$scope.submitHistory = function (isValid) {
	    $scope.wasSubmitted = true;
	    if (isValid && $scope.enoughData) {
	        if ($scope.tab==='gifts') {
	            $scope.getGifts($scope.tab);
	        }
	        else {
	            $scope.getWishes($scope.tab);
	        }
	        
	    }
	};

	$scope.resetWish = function () {
	    $scope.wasSubmitted = false;
	};

	$scope.getGifts = function (tab) {
	    $scope.tab = tab;
	    //исключить повторные запросы
	    if (!angular.equals($scope.query, $scope.queryGift)) {
	        $scope.queryGift = angular.copy($scope.query);

	        wishAndGiftService.showGifts($scope.queryGift).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.gifts = response.data.Result;
	            } else {
	                //TODO:  message error
	            }
	        }, function (response) { /*TODO:  message error "Failed to add wish due to: " + commonService.displayError();*/ });
        }
	    }
	$scope.getWishes = function (tab) {
	    $scope.tab = tab;
        //исключить повторные запросы
	    if (!angular.equals($scope.query, $scope.queryWish)) {
	        $scope.queryWish = angular.copy($scope.query);

	        wishAndGiftService.showWishes($scope.queryWish).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.wishes = response.data.Result;
	            } else {
	                //TODO:  message error
	            }
	        }, function (response) {/*TODO:  message error "Failed to add wish due to: " + commonService.displayError();*/ });
	    }

	}

}] );
/**
 * @ngdoc function
 * @name giftknacksApp.controller:DashboardCtrl
 * @description
 * # Контроллер страницы с последней активностью пользователя
 * Controller of the giftknacksApp
 */
app.controller('DashboardCtrl', ['$scope', 'authService', 'initialData', 'historyGifts', 'historyWishes', 'wishAndGiftService', function ($scope, authService, initialData, historyGifts, historyWishes, wishAndGiftService) {
	$scope.enoughData = authService.authentication.isFilled;

	if ( initialData.data && !initialData.data.ErrorCode ) {
		$scope.nearWishes = initialData.data.Result.Wishes;
		$scope.nearGifts = initialData.data.Result.Gifts;
		$scope.nearMembers = initialData.data.Result.Users;
	}
	if (historyGifts.data && !historyGifts.data.ErrorCode) {
	    $scope.historyGifts = historyGifts.data.Result;
	}
	if (historyWishes.data && !historyWishes.data.ErrorCode) {
	    $scope.historyWishes = historyWishes.data.Result;
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
	$scope.allItemsLoaded = false;

	//lazy load
	$scope.loadWishes = function (offset, newSearch) {
	    if ($scope.allItemsLoaded) {
	        return;
	    }
		$scope.queryWish.busy = true;
		$scope.queryWish.Offset = typeof offset == "undefined" ? ( $scope.queryWish.Offset + $scope.queryWish.Length ) : offset;
		wishAndGiftService.getWishes( $scope.queryWish ).then( function ( response ) {
			$scope.queryWish.busy = false;
			if ( response.data && !response.data.ErrorCode ) {
			    $scope.listWish = newSearch ? response.data.Result : $scope.listWish.concat(response.data.Result);
			    if (response.data.Result.length < $scope.queryWish.Length) {
			        $scope.allItemsLoaded = true;
			    }
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
		if (isValid && $scope.enoughData) {
		    $scope.allItemsLoaded = false;
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
	$scope.allItemsLoaded = false;
	//lazy load
	$scope.loadGifts = function (offset, newSearch) {
	    if ($scope.allItemsLoaded) {
	        return;
	    }
		$scope.queryGift.busy = true;
		$scope.queryGift.Offset = typeof offset == "undefined" ? ( $scope.queryGift.Offset + $scope.queryGift.Length ) : offset;
		wishAndGiftService.getGifts( $scope.queryGift ).then( function ( response ) {
			$scope.queryGift.busy = false;
			if ( response.data && !response.data.ErrorCode ) {
			    $scope.listGift = newSearch ? response.data.Result : $scope.listGift.concat(response.data.Result);
			    if (response.data.Result.length < $scope.queryGift.Length) {
			        $scope.allItemsLoaded = true;
			    }
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
		if (isValid && $scope.enoughData) {
		    $scope.allItemsLoaded = false;
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
app.controller('ItemCardCtrl', ['$scope', '$modal','$compile', '$route', 'authService', 'initialData', 'commonService', 'wishAndGiftService', 'commentService', function ($scope, $modal,$compile, $route, authService, initialData, commonService, wishAndGiftService, commentService) {
    $scope.enoughData = authService.authentication.isFilled;
    $scope.myId = authService.authentication.userId;
    $scope.wasSubmitted = false;
    $scope.wasSubmittedReply = false;
    $scope.comments = []
    $scope.allCommentsLoaded = false;
    $scope.commentText = '';
    $scope.replyText = {};
    $scope.newComments = {};
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

	$scope.query = { busy: false, Id: $scope.item.Id, Offset: -10, Length: 10 };

	//lazy load
	$scope.loadComments = function (type, offset) {
	    if ($scope.allCommentsLoaded) {
	        return;
	    }
	    var method = 'getWishComments';
	    if (type=='gift') {
	        method = 'getGiftComments';
	    }
	    $scope.query.busy = true;
	    $scope.query.Offset = typeof offset == "undefined" ? ($scope.query.Offset + $scope.query.Length) : offset;
	    commentService[method]($scope.query).then(function (response) {
	        $scope.query.busy = false;
			if ( response.data && !response.data.ErrorCode ) {
			    $scope.comments = $scope.comments.concat(response.data.Result);
			    if (response.data.Result.length < $scope.query.Length) {
			        $scope.allCommentsLoaded = true;
			    }
			} else {
			    $scope.comments = $scope.comments.concat({ Name: response.data.ErrorMessage });
			}
		}, function ( response ) {
		    $scope.comments = $scope.comments.concat({ Name: "Failed to search wishes due to: " + commonService.displayError() });
			$scope.query.busy = false;
		} );
	};

	$scope.addComment = function (isValid, type, commentId) {
	    $scope.wasSubmitted = true;
	    var method = 'addWishComment';
	    var IdName = 'WishId';
	    if (type == 'gift') {
	        method = 'addGiftComment';
	        IdName = 'GiftId';
	    }
	    var commentQuery={
	        'ParentCommentId': commentId,
	        'Text': $scope.commentText
	    }
	    commentQuery[IdName] = $scope.item.Id;

	    if (isValid && $scope.enoughData) {
	        commentService[method](commentQuery).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.commentText = '';
	                $scope.wasSubmitted = false;
	                var id=response.data.Result.Id;
	                $scope.newComments['comment'+id] = response.data.Result;
	                var comment = $(document.createElement('comment-block'));
	                comment.attr('comment', 'newComments.comment'+id);
	                $compile(comment)($scope);
	                
	                var reply = $(document.createElement('reply-form'));
	                reply.attr('comment', 'newComments.comment' + id);
	                reply.attr('enough-data', '{{enoughData}}');
	                reply.attr('add-reply', 'addReply');
	                reply.attr('type', type);
	                reply.attr('reply-text', 'replyText');
	                $compile(reply)($scope);

	                var newComment = $('<li class="list-group-item comment-li"></li>');
	                newComment.prepend(reply);
	                newComment.prepend(comment);
	                $('.comment-list').prepend(newComment);
	                
	            } else {
	                //TODO: обработчик ошибки
	            }
	        }, function (response) {
	            //TODO: обработчик ошибки
	            $scope.wasSubmitted = false;
	        });
	    }
	}
	$scope.addReply = function (isValid, type, commentId, $event) {
	    $scope.wasSubmittedReply = true;
	    var method = 'addWishComment';
	    var IdName = 'WishId';
	    if (type == 'gift') {
	        method = 'addGiftComment';
	        IdName = 'GiftId';
	    }
	    var commentQuery = {
	        'ParentCommentId': commentId,
	        'Text': $scope.replyText[commentId]
	    }
	    commentQuery[IdName] = $scope.item.Id;

	    if (isValid && $scope.enoughData) {
	        commentService[method](commentQuery).then(function (response) {
	            if (response.data && !response.data.ErrorCode) {
	                $scope.replyText[commentId] = '';
	                $scope.wasSubmittedReply = false;
	                var id = response.data.Result.Id;
	                $scope.newComments['comment' + id] = response.data.Result;
	                var comment = $(document.createElement('comment-block'));

	                comment.attr('comment', 'newComments.comment' + id);
	                $compile(comment)($scope);

	                var $element = $($event.currentTarget);
	                var $parentLi=$element.parents('.comment-li');
	                var newComment = $('<li class="list-group-item"></li>');
	                newComment.prepend(comment);
	                if (!$parentLi.find('ul.list-group').length) {
	                    $parentLi.append(newComment);
	                    newComment.wrap('<ul class="list-group"></ul>');
	                }
	                else {
	                    $parentLi.find('ul.list-group').prepend(newComment);
	                }
	               

	            } else {
	                //TODO: обработчик ошибки
	            }
	        }, function (response) {
	            //TODO: обработчик ошибки
	            $scope.wasSubmittedReply = false;
	        });
	    }
	}
	$scope.showmyitems = function (type) {
	    var method = 'showGifts';
	    var parenttype = 'wish';
	    if (type=='wish') {
	        method = 'showWishes'
	        parenttype = 'gift';
	    }
	    wishAndGiftService[method]({}).then(function (response) {
			if ( response.data && !response.data.ErrorCode ) {

					var modalInstance = $modal.open({
						templateUrl: '/templates/wishgiftlist.html',
						controller: 'ModalInstanceCtrl',
						resolve: {
							items: function () {
								return response.data.Result;
							},
							params: function () {
							    return { 'type': type, 'parentid': $scope.item.Id, 'parenttype': parenttype };
							}
						}
					});

			    modalInstance.result.then(function (selectedItem) {
			        var gift = selectedItem;
			        var wish = $scope.item.Id;
			        if (type == 'wish') {
			            gift = $scope.item.Id;
			            wish = selectedItem;
			        }

			        wishAndGiftService.linkWishAndGift(wish, gift).then(function (response) {
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

	$scope.closeItem = function (type) {
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/participantslist.html',
	        controller: 'ModalCloseItemCtrl',
	        resolve: {
	            items: function () {
	                return $scope.item.Participants;
	            },
	            params: function () {
	                return { 'itemId': $scope.item.Id, 'type':type};
	            }
	        }
	    });
	}
}] );

/**
 * @ngdoc function
 * @name giftknacksApp.controller:ModalInstanceCtrl
 * @description
 * # Контроллер popup'а для join
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
}]);

/**
 * @ngdoc function
 * @name giftknacksApp.controller:AddReferenceCtrl
 * @description
 * # Контроллер popup'а для добавлния отзыва
 * Controller of the giftknacksApp
 */
app.controller('AddReferenceCtrl', ['$scope', '$modalInstance', 'referenceService', 'params', '$route', function ($scope, $modalInstance, referenceService, params, $route) {


    $scope.reference = { 'Rate': 3, 'ReferenceText': '' };
    $scope.reference.OwnerId = params.OwnerId;
    $scope.rateHover = 0;
    $scope.overStar = false;

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.rateHover = value;
    };

    $scope.add = function () {
        referenceService.addReference($scope.reference).then(function (response) {
            if (response.data && !response.data.ErrorCode) {
                $route.reload();
                //TODO: trigger show reference tab
            } else {
                //$scope.message = response.data.ErrorMessage;
            }
        }, function (response) {
            //$scope.message = "Failed to add wish due to: " + commonService.displayError();

        });
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
/**
 * @ngdoc function
 * @name giftknacksApp.controller:ModalCloseItemCtrl
 * @description
 * # Контроллер popup'а для закрытия айтема
 * Controller of the giftknacksApp
 */
app.controller('ModalCloseItemCtrl', ['$scope', '$modalInstance', 'items', 'params', 'wishAndGiftService', '$route', function ($scope, $modalInstance, items, params, wishAndGiftService, $route) {

    $scope.participants = items;

    var method = 'close' + params.type;
   
    $scope.closeItem = function (userId) {
        var obj = {
            'Id': params.itemId
        }
        if (userId>=0) {
            obj.CloserId = userId;
        }
       
        wishAndGiftService[method](obj).then(function (response) {
            if (response.data && !response.data.ErrorCode) {
                $modalInstance.close();
                $route.reload();
            } else {
                //TODO: popup message error
            }
        }, function (response) {
            //TODO: popup message error "Failed to add wish due to: " + commonService.displayError();
        });
       
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

/**
 * @ngdoc function
 * @name giftknacksApp.controller:WishFormCtrl
 * @description
 * # Контроллер создания нового виша
 * Controller of the giftknacksApp
 */
app.controller( 'WishFormCtrl', ['$scope','$location', 'authService', 'initialData', 'countries','startPoint', 'commonService', 'wishAndGiftService', function ( $scope,$location, authService, initialData, countries,startPoint, commonService, wishAndGiftService ) {
    $scope.enoughData = authService.authentication.isFilled;
    $scope.today = new Date();
    $scope.today.setHours(0, 0, 0, 0);
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

	$scope.cropControl = false;
     $scope.croppedImage = '';
     var handleFileSelect = function (evt) {
         var file = evt.currentTarget.files[0];
         if (!file) {
             return;
         }
         $scope.cropControl = true;
         var reader = new FileReader();
         reader.onload = function (evt) {
             $scope.$apply(function ($scope) {
                 $scope.wish.ImageUrl = evt.target.result;
                 $scope.imageExist = true;
             });
         };
         reader.readAsDataURL(file);
     };
     angular.element(document.querySelector('[name=uploadImage]')).on('change', handleFileSelect);

	$scope.clearImage = function () {
	    $scope.imageExist = false;
	    $scope.wish.ImageUrl = null;
	    $scope.wish.Image = null;
	    $scope.cropControl = false;
	    $scope.croppedImage = '';
	}


	$scope.submit = function ( isValid ) {
		$scope.wasSubmitted = true;
		if (isValid && $scope.enoughData) {
		    if ($scope.cropControl) {
		        $scope.wish.Image.result= $scope.wish.ImageUrl = $scope.croppedImage;
		    }
		    $scope.wish.Category = $scope.wish.Category.Name;//TODO: поправить костыль
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
    $scope.today = new Date();
    $scope.today.setHours(0, 0, 0, 0);
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
	$scope.latinTooltip = [false, false];

	$scope.showLatinTooltip = function (index, result) {
	    $scope.$apply(function () {
	        if (result === false) {
	            $scope.latinTooltip[index] = true;
	        }
	        else {
	            $scope.latinTooltip[index] = false;
	        }
	    });
	    

	}
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

    //image
	$scope.cropControl = false;
	$scope.croppedImage = '';
	var handleFileSelect = function (evt) {
	    var file = evt.currentTarget.files[0];
	    if (!file) {
	        return;
	    }
	    $scope.cropControl = true;
	    var reader = new FileReader();
	    reader.onload = function (evt) {
	        $scope.$apply(function ($scope) {
	            $scope.profile.AvatarUrl = evt.target.result;
	            $scope.avatarExist = true;
	        });

	    };
	    reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('[name=uploadAvatar]')).on('change', handleFileSelect);

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

	$scope.clearAvatar = function () {
	    $scope.avatarExist = false;
	    $scope.profile.UploadAvatar = null;
	    $scope.profile.AvatarUrl = null;
	    $scope.cropControl = false;
	    $scope.croppedImage = '';
	}

	$scope.updatePtofile = function ( isValid ) {
		$scope.wasSubmitted = true;
		if (isValid) {
		    if ($scope.cropControl) {
		        $scope.profile.UploadAvatar.result = $scope.profile.AvatarUrl = $scope.croppedImage;
		    }
		   
			profileService.updatePtofile( $scope.profile ).then( function ( response ) {
			    if (response.data && !response.data.ErrorCode) {
			        $scope.cropControl = false;
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

}]);