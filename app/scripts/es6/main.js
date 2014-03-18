
import RatingComponent from 'rating-component/rating-component';

var nodes = document.querySelectorAll('.rating');

for (var i = nodes.length - 1; i >= 0; i--) {
  nodes[i].appendChild( new RatingComponent().create() );
}
