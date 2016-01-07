app.directive( 'setMask', function () {
	return {
	    restrict: 'A',
	    scope: {
	        onKeyValidation: '&'
	    },
		link: function ( scope, $elm, attr ) {
		    $(function () {
			    if (attr.setMask) {
			        $elm.inputmask({ "mask": attr.setMask, "clearIncomplete": true, "repeat": attr.maskGreedy ? '*' : false, "greedy": !attr.maskGreedy, onKeyValidation: function (result) { scope.onKeyValidation({ result: result }) } });
				}
			} );
		}
	}
});
app.directive('scrollup', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm, attr) {
            $(function () {
                $(window).scroll(function () {
                    if ($(window).scrollTop() > 0) {
                        $elm.fadeIn("slow");
                    }
                    else {
                        $elm.fadeOut("slow");
                    }
                });


            });
        }
    }
});
app.directive('activeScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm, attr) {
            $(function () {
                function isScrolledIntoView(elem) {
                    if (!$(elem).length) {
                        return false;
                    }
                    var docViewTop = $(window).scrollTop();
                    var docViewBottom = docViewTop + $(window).height();
                    var elemTop = $(elem).offset().top;
                    var elemBottom = elemTop + $(elem).height();
                    return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
                }
                var currentEl;
                var current = $('.sidebar .active');
                if (current.length) {
                    currentEl = $.grep(current.attr('class').split(" "), function (v, i) {
                        return v.indexOf('scroll') === 0;
                    }).join();
                }

                $(window).scroll(function () {
                    for (var i = 0; i < $('.scroll-anchor').length; i++) {
                        var el = $('.scroll-anchor').get(i);
                        var selector = 'scroll-' + $(el).attr('id');

                        if (isScrolledIntoView($(el))) {
                            currentEl = selector;
                            $('.sidebar>.list-group-item').removeClass('active');
                            $('.sidebar>.' + currentEl).addClass('active');
                            break;
                        }
                    }
                });
            });
        }
    }
});
app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                    // or all selected files:
                    // scope.fileread = changeEvent.target.files;
                });
            });
        }
    }
}] );
/* google geolocation api*/
app.directive('ngAutocomplete', function() {
	return {
		require: 'ngModel',
		scope: {
			ngModel: '=',
			options: '=?',
			details: '=?'
		},

		link: function(scope, element, attrs, controller) {

			//options for autocomplete
		    var opts;
		    var watchEnter = false;
			//convert options provided to opts
			var initOpts = function() {

				opts = {}
				if (scope.options) {

					if (scope.options.watchEnter !== true) {
					    watchEnter = false;
					} else {
					    watchEnter = true;
					}

					if (scope.options.types) {
					    opts.types = [];
					    opts.types.push(scope.options.types);
					    scope.gPlace.setTypes(opts.types);
					} else {
					    scope.gPlace.setTypes([]);
					}

					if (scope.options.bounds) {
					    opts.bounds = scope.options.bounds;
					    scope.gPlace.setBounds(opts.bounds);
					} else {
					    scope.gPlace.setBounds(null);
					}

					if (scope.options.country) {
						opts.componentRestrictions = {
							country: scope.options.country
						}
					    scope.gPlace.setComponentRestrictions(opts.componentRestrictions);
					} else {
					    scope.gPlace.setComponentRestrictions(null);
					}
				}
			}

			if (scope.gPlace == undefined) {
				scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
			}
		    google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
		        var result = scope.gPlace.getPlace();
		        if (result !== undefined) {
		            if (result.address_components !== undefined) {

		                scope.$apply(function() {

		                    scope.details = result;

		                    controller.$setViewValue(element.val());
		                });
		            } else {
		                if (watchEnter) {
		                    getPlace(result);
		                }
		            }
		        }
		    });

			//function to get retrieve the autocompletes first result using the AutocompleteService 
			var getPlace = function(result) {
				var autocompleteService = new google.maps.places.AutocompleteService();
				if (result.name.length > 0){
					autocompleteService.getPlacePredictions(
						{
							input: result.name,
							offset: result.name.length
						},
						function listentoresult(list, status) {
							if(list == null || list.length == 0) {

								scope.$apply(function() {
									scope.details = null;
								});

							} else {
								var placesService = new google.maps.places.PlacesService(element[0]);
								placesService.getDetails(
									{'reference': list[0].reference},
									function detailsresult(detailsResult, placesServiceStatus) {

										if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
											scope.$apply(function() {

												controller.$setViewValue(detailsResult.formatted_address);
												element.val(detailsResult.formatted_address);

												scope.details = detailsResult;

												//on focusout the value reverts, need to set it again.
											    var watchFocusOut = element.on('focusout', function(event) {
											        element.val(detailsResult.formatted_address);
											        element.unbind('focusout');
											    });

											});
										}
									}
								);
							}
						});
				}
			}

			controller.$render = function () {
				var location = controller.$viewValue;
				element.val(location);
			};

			//watch options provided to directive
			scope.watchOptions = function () {
			    return scope.options;
			};
			scope.$watch(scope.watchOptions, function () {
			    initOpts();
			}, true);

		}
	};
} );

app.directive( "fieldMatch", function () {
	return {
		require: "ngModel",
		scope: {
			fieldMatch: '='
		},
		link: function ( scope, element, attrs, ctrl ) {
			scope.$watch( function () {
				var combined;

				if ( scope.fieldMatch || ctrl.$viewValue ) {
					combined = scope.fieldMatch + '_' + ctrl.$viewValue;
				}
				return combined;
			}, function ( value ) {
				if ( value ) {
					ctrl.$parsers.unshift( function ( viewValue ) {
						var origin = scope.fieldMatch;
						if ( origin !== viewValue ) {
							ctrl.$setValidity( "fieldMatch", false );
							return undefined;
						} else {
							ctrl.$setValidity( "fieldMatch", true );
							return viewValue;
						}
					} );
				}
			} );
		}
	};
} );
app.directive( "customContact", function () {
	return {
		require: "ngModel",
		link: function ( scope, element, attrs, ctrl ) {
			ctrl.$parsers.unshift( function ( value ) {
				var valid;
				if ( value ) {
					switch ( attrs.name.toLowerCase() ) {
						case 'email':
							valid = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( value );
							break;
						default:
							valid = true;
							break;

					}
					ctrl.$setValidity( 'customContact', valid );
				}
				return value;
			} );

		}
	};
} );

app.directive( 'emptyToNull', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function ( scope, elem, attrs, ctrl ) {
			ctrl.$parsers.push( function ( viewValue ) {
				if ( viewValue === "" ) {
					return null;
				}
				return viewValue;
			} );
		}
	};
});

app.directive('commentBlock', ['cacheVersion', function (cacheVersion) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/comment.html?ver=' + cacheVersion,
        scope: { comment: '=' }

    };
}]);
app.directive('feedBlock', ['cacheVersion', function (cacheVersion) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/feed.html?ver=' + cacheVersion,
        scope: { feed: '=' }

    };
}]);
app.directive('replyForm', ['cacheVersion', function (cacheVersion) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/replyform.html?ver=' + cacheVersion,
        scope: { comment: '=', addReply: '=', wasSubmittedReply:'=', enoughData: '@', type: '@', replyText: '=' }
    };
}]);
app.directive('signupForm', ['cacheVersion',  function (cacheVersion) {
    return {
        restrict: 'A',
        controller: 'SignupInlineCtrl',
        templateUrl: '/templates/signup.html?ver=' + cacheVersion

    };
}]);
var isValidDate = function (dateStr) {
    if (dateStr == undefined)
        return false;
    
    var dateTime = Date.parse(dateStr);

    if (isNaN(dateTime)) {
        return false;
    }
    return true;
};
var getDateDifference = function (fromDate, toDate) {
    return Date.parse(toDate) - Date.parse(fromDate);
};
var isValidDateRange = function (fromDate, toDate) {
    if (fromDate == "" || toDate == "")
        return true;
    if (isValidDate(fromDate) == false) {
        return false;
    }
    if (isValidDate(toDate) == true) {
        var days = getDateDifference(fromDate, toDate);
        if (days < 0) {
            return false;
        }
    }
    return true;
};
app.directive('dateLowerThan', ["$filter", function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateDateRange = function (inputValue) {
                var fromDate = $filter('date')(inputValue, 'short');
                var toDate = $filter('date')(attrs.dateLowerThan, 'short');
                //convert dd.mm.yyyy to mm.dd.yyyy for parsing
                if (typeof fromDate === 'string') {
                    var dateStrArr = fromDate.split(".");
                    if (dateStrArr.length == 3) {
                        fromDate = dateStrArr[1] + '.' + dateStrArr[0] + '.' + dateStrArr[2];
                    }
                }
                if (typeof toDate === 'string') {
                    dateStrArr = toDate.split(".");
                    if (dateStrArr.length == 3) {
                        toDate = dateStrArr[1] + '.' + dateStrArr[0] + '.' + dateStrArr[2];
                    }
                }
                var isValid = isValidDateRange(fromDate, toDate);
                ctrl.$setValidity('dateLowerThan', isValid);
                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateLowerThan', function () {
                validateDateRange(ctrl.$viewValue);
            });
        }
    };
}]);
app.directive('dateGreaterThan', ["$filter", function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var validateDateRange = function (inputValue) {
                var fromDate = $filter('date')(attrs.dateGreaterThan, 'short');
                var toDate = $filter('date')(inputValue, 'short');
                //convert dd.mm.yyyy to mm.dd.yyyy for parsing
                if (typeof fromDate === 'string') {
                    var dateStrArr = fromDate.split(".");
                    if (dateStrArr.length == 3) {
                        fromDate = dateStrArr[1] + '.' + dateStrArr[0] + '.' + dateStrArr[2];
                    }
                }
                if (typeof toDate === 'string') {
                    dateStrArr = toDate.split(".");
                    if (dateStrArr.length == 3) {
                        toDate = dateStrArr[1] + '.' + dateStrArr[0] + '.' + dateStrArr[2];
                    }
                }
                var isValid = isValidDateRange(fromDate, toDate);
                ctrl.$setValidity('dateGreaterThan', isValid);
                return inputValue;
            };

            ctrl.$parsers.unshift(validateDateRange);
            ctrl.$formatters.push(validateDateRange);
            attrs.$observe('dateGreaterThan', function () {
                validateDateRange(ctrl.$viewValue);

            });
        }
    };
}]);
app.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src !== attrs.onErrorSrc) {
                    attrs.$set('src', attrs.onErrorSrc);
                }
            });
        }
    }
});
