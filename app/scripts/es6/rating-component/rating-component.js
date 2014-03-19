
import Helpers from 'helpers';
import RatingItem from 'rating-item';

var RatingComponent = function(options) {
  this.uuid = Helpers.uuid();

  this.MIN_VALUE = 0;
  this.MAX_VALUE = (options && options.itemsCount > 0) ? options.itemsCount : 5;
  this._items = [];

  this._value =
    (options && options.value >= this.MIN_VALUE && options.value <= this.MAX_VALUE) ?
    options.value : this.MIN_VALUE;

  this.template = function() {
    return '<div class="rating-component">' +
      '<span class="rating-component__min-handle"></span>' +
      '<ul class="rating-component__list">' +
      '</ul>' +
      '<span class="rating-component__max-handle"></span>' +
    '</div>';
  };
  // DOM element
  this.el = null;

  return this._init();
};

RatingComponent.prototype = Object.create({
  /**
   * Initializes instance upon creation
   */
  _init: function() {
    this._createItems();
  },

  /**
   * Creates instances of items for the component
   */
  _createItems: function() {
    var items = [];
    for (var i = this.MIN_VALUE; i < this.MAX_VALUE; i++) {
      items.push(
        // Coniderting current component value, it creates appropriate items
        new RatingItem( +(i < this._value) )
      );
    }
    this._items = items;
  },

  /**
   * Creates component
   * @return {Element}
   */
  create: function() {
    this._render();
    this._addEventListeners();

    return this.el;
  },

  /**
   * Renders component initially
   */
  _render: function() {
    var el = document.createElement('div')
      , frag = document.createDocumentFragment();

    el.innerHTML = this.template();

    this.el = el.firstElementChild;
    this._items.forEach(function(item) {
      frag.appendChild( item.create() );
    });
    this.el.querySelector('ul').appendChild(frag);
  },

  /**
   * Redraws the whole component
   */
  redraw: function() {
    for (var i = this._items.length - 1; i >= 0; i--) {
      this._items[i].redraw();
    }
  },

  /**
   * Attaches necessary event handlers
   */
  _addEventListeners: function() {
    var self = this
      , minHandle = this.el.firstElementChild
      , maxHandle = this.el.lastElementChild;

    // Touchy replacements for mouseover events, and triggering of click by touchend
    if ( Helpers.isTouchDevice() ) {
      var triggerClick = function(e) {
            var target = getTouchmoveTarget(e);
            e.preventDefault();
            target.click();
          }
        , getTouchmoveTarget = function(e) {
            var touch = e.changedTouches[0];
            return document.elementFromPoint(touch.clientX, touch.clientY);
          }
        , touchmoveHandler = function(e) {
            e.preventDefault();

            var target = getTouchmoveTarget(e);
            // Stupid event delegation
            if (target.tagName === 'LI') {
              self._elMouseoverHandler.call(self, target);
            } else if (target === minHandle) {
              self._minMouseoverHandler.call(self);
            } else if (target === maxHandle) {
              self._maxMouseoverHandler.call(self);
            }
          };

      this.el.addEventListener('touchstart', touchmoveHandler, false);
      this.el.addEventListener('touchmove', touchmoveHandler, false);
      this.el.addEventListener('touchend', triggerClick, false);

      minHandle.addEventListener('touchstart', touchmoveHandler, false);
      minHandle.addEventListener('touchmove', touchmoveHandler, false);
      minHandle.addEventListener('touchend', triggerClick, false);

      maxHandle.addEventListener('touchstart', touchmoveHandler, false);
      maxHandle.addEventListener('touchmove', touchmoveHandler, false);
      maxHandle.addEventListener('touchend', triggerClick, false);

    // Mouseover events
    } else {
      this.el.addEventListener('mouseover', function(e) {
        // Stupid event delegation
        if (e.target.tagName === 'LI') {
          self._elMouseoverHandler.call(self, e.target);
        } else if (e.target === minHandle) {
          self._minMouseoverHandler.call(self);
        } else if (e.target === maxHandle) {
          self._maxMouseoverHandler.call(self);
        }
      }, false);
    }

    this.el.addEventListener('click', function(e) {
      var current = e.target;

      if (current.tagName === 'LI') {
        var items = Array.prototype.slice.call(current.parentNode.children);
        // Sets the value and redraws
        self.setValue(items.indexOf(current) + 1);
      }
    }, false);

    this.el.addEventListener('mouseleave', function() {
      self._items.forEach(function(item) {
        item.isChanged = false;
        item.isChanging = false;
      });
      // Since items' values haven't changed, redraw will reset component state
      self.redraw();
    }, false);

    minHandle.addEventListener('click', function() {
      // Sets value and redraws
      self.setValue(self.MIN_VALUE);
    }, false);

    maxHandle.addEventListener('click', function() {
      // Sets value and redraws
      self.setValue(self.MAX_VALUE);
    });
  },

  /**
   * Handles either mouse or touch events on component's items
   */
  _elMouseoverHandler: function(target) {
    var items = Array.prototype.slice.call(target.parentNode.children)
      , currentIndex = items.indexOf(target);

    this._items.forEach(function(item, index) {
      // Clearing intermediate states
      item.isChanging = false;
      item.isChanged = false;

      // Current value should be dimmed
      if (this._value > this.MIN_VALUE) {
        // All the items to the right of current are changing (dimmed in UI)
        if (index > currentIndex) {
          item.isChanging = true;
        // All the items to the right of current are changed (filled in UI)
        } else {
          item.isChanged = true;
        }
      // Current value is the minimum one
      } else {
        if (index <= currentIndex) {
          item.isChanged = true;
        }
      }
    }, this);

    this.redraw();
  },

  /**
   * Handles either mouse or touch events on handle, which sets MIN_VALUE
   */
  _minMouseoverHandler: function() {
    // Current value marked as changing
    this._items.forEach(function(item) {
      item.isChanging = true;
      item.isChanged = false;
    });
    this.redraw();
  },

  /**
   * Handles either mouse or touch events on handle, which sets MAX_VALUE
   */
  _maxMouseoverHandler: function() {
    // All the items are chagned, since we want to set MAX_VALUE
    this._items.forEach(function(item) {
      item.isChanged = true;
    }, this);
    this.redraw();
  },

  /**
   * Gets the value of the component, using its items
   * @return {[type]} [description]
   */
  getValue: function() {
    var index = 0;
    for (var i = this._items.length - 1; i >= 0; i--) {
      if (this._items[i].getValue() === 1) {
        index = i + 1;
        break;
      }
    }
    return index;
  },

  /**
   * Sets the value of all the items of the component and the component itself
   * @param {Number} value - should be in permitted range
   */
  _setValue: function(value) {
    if (value >= this.MIN_VALUE && value <= this.MAX_VALUE) {
      this._items.forEach(function(item, index) {
        item.setValue( +(index < value) );
      });
      this._value = this.getValue();
    } else {
      throw new Error('The value provided is greater than maximum possible!');
    }
  },

  /**
   * Sets the value of the component and redraws it
   * Seems like a useful sideeffect to me
   */
  setValue: function(value) {
    this._setValue(value);
    this.redraw();
  },

  /**
   * JSON representation of a class (not stringified though)
   * @return {Object}
   */
  toJSON: function() {
    return {
      value: this.getValue(),
      items: this._items.map(function(item) {
        return item.toJSON();
      })
    };
  },
});

export default RatingComponent;
