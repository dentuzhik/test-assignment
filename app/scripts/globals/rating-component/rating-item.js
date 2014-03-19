(function(__exports__) {
  "use strict";

  /**
   * RatingItem Class
   * Is not more than just an item, from a bunch of which the RatingComponent is
   * constructred
   *
   * @param {Number} value - 1 or 0, representing state
   */
  var RatingItem = function(value) {
    this.classNames = {
      isFull: 'is-full',
      isChanging: 'is-changing'
    };

    this.template = function(value) {
      return '<li class="rating-component__item ' +
        (value ? this.classNames.isFull : '') +
      '"></li>';
    };
    // DOM element
    this.el = null;

    // Indicates, that item's value is up to date with the respective value of the
    // parent component, but some new value is being set at the moment
    this.isChanging = false;
    // Indicates, that this item is most likely will represent the new value of
    // the parent component
    this.isChanged = false;
    // Setting initial value
    this.setValue(value);
  };

  RatingItem.prototype = {
    /**
     * Creates DOM element, which represents the instance
     * @return {Element}
     */
    create: function() {
      var el = document.createElement('div');
      el.innerHTML = this.template(this.value);
      this.el = el.firstElementChild;
      return this.el;
    },

    /**
     * Redraws the element, according to its current state
     */
    redraw: function() {
      // Clearing the state in UI
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

    /**
     * Gets the value of an item
     * @return {Number} 1 or 0
     */
    getValue: function() {
      return this._value;
    },

    /**
     * Sets the value of an item, and resets isChanging state
     * @param {Number} value 1 or 0
     */
    setValue: function(value) {
      this.isChanging = false;
      this._value = (value === 1) ? 1 : 0;
    },

    /**
     * JSON representation of a class (not stringified though)
     * @return {Object}
     */
    toJSON: function() {
      return {
        value: this._value
      };
    }
  };

  __exports__.RatingItem = RatingItem;
})(window);