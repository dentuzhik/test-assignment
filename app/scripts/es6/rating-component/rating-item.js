
// Class for a single item of the component
var RatingItem = function(value) {
  this.classNames = {
    isFull: 'is-full',
    isChanging: 'is-changing'
  };

  this.template = function(value) {
    return '<li class="rating-component__item ' +
      (value ? 'is-full' : '') +
    '"></li>';
  };
  // DOM element
  this.el = null;

  this.isChanging = false;
  this.isChanged = false;
  this.setValue(value);
};

RatingItem.prototype = Object.create({
  create: function() {
    var el = document.createElement('div');
    el.innerHTML = this.template(this.value);
    this.el = el.firstElementChild;
    return this.el;
  },

  redraw: function() {
    this.el.classList.remove(this.classNames.isFull, this.classNames.isChanging);
    if (this._value === 1) {
      this.el.classList.add(this.classNames.isFull);
      if (this.isChanging) {
        this.el.classList.add(this.classNames.isChanging);
      }
    } else if (this.isChanged) {
      this.el.classList.add(this.classNames.isFull);
    }
  },

  setEl: function(el) {
    this.el = el;
  },

  getValue: function() {
    return this._value;
  },

  setValue: function(value) {
    this.isChanging = false;
    this._value = (value === 1) ? 1 : 0;
  },

  toJSON: function() {
    return {
      value: this._value
    };
  }
});

export default RatingItem;
