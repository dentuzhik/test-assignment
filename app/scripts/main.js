
(function(RatingComponent) {
  var nodes = document.querySelectorAll('.rating')
    , rc = new RatingComponent();

  for (var i = nodes.length - 1; i >= 0; i--) {
    nodes[i].appendChild( new RatingComponent().create() );
  }

  window.rc = rc;
})(RatingComponent);