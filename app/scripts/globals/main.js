(function(__dependency1__) {
  "use strict";

  var RatingComponent = __dependency1__;

  var nodes = document.querySelectorAll('.rating');

  for (var i = nodes.length - 1; i >= 0; i--) {
    nodes[i].appendChild( new RatingComponent().create() );
  }
})(window.RatingComponent);