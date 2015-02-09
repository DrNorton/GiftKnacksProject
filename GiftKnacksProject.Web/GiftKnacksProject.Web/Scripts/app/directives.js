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