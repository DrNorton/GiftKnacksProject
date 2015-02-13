app.directive( 'setMask', function () {
	return {
		restrict: 'A',
		link: function ( scope, $elm, attr ) {
			$( function () {
				if ( attr.setMask ) {
					$elm.inputmask( { "mask": attr.setMask, "repeat": attr.maskGreedy ? '*' : false, "greedy": !attr.maskGreedy } );
				}
			} );
		}
	}
} );
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
}]);