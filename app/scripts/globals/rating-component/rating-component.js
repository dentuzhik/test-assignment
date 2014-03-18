(function(__exports__, __dependency1__, __dependency2__) {
  "use strict";

  var Helpers = __dependency1__;
  var RatingItem = __dependency2__;

  // Class for the component itself
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
    _init: function() {
      this._createItems();
    },

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

    create: function() {
      this._render();
      this._addEventListeners();

      return this.el;
    },

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

    redraw: function() {
      for (var i = this._items.length - 1; i >= 0; i--) {
        this._items[i].redraw();
      }
    },

    _addEventListeners: function() {
      var self = this
        , minHandle = this.el.firstElementChild
        , maxHandle = this.el.lastElementChild;

      this.el.addEventListener('mouseover', function(e) {
        var current = e.target;

        if (current.tagName === 'LI') {
          var items = Array.prototype.slice.call(current.parentNode.children)
            , currentIndex = items.indexOf(current);

          self._items.forEach(function(item, index) {
            item.isChanging = false;
            item.isChanged = false;

            if (self._value > self.MIN_VALUE) {
              if (index > currentIndex) {
                item.isChanging = true;
              } else {
                item.isChanged = true;
              }
            } else {
              if (index <= currentIndex) {
                item.isChanged = true;
              }
            }
          });

          self.redraw();
        }
      });

      this.el.addEventListener('click', function(e) {
        var current = e.target;

        if (current.tagName === 'LI') {
          var items = Array.prototype.slice.call(current.parentNode.children);
          self.setValue(items.indexOf(current) + 1);
        }
      }, false);

      this.el.addEventListener('mouseleave', function() {
        self._items.forEach(function(item) {
          item.isChanged = false;
          item.isChanging = false;
        });

        self.redraw();
      }, false);

      minHandle.addEventListener('mouseover', function() {
        self._items.forEach(function(item) {
          item.isChanging = true;
          item.isChanged = false;
        });
        self.redraw();
      }, false);

      minHandle.addEventListener('click', function() {
        self.setValue(self.MIN_VALUE);
      }, false);

      maxHandle.addEventListener('mouseover', function() {
        self._items.forEach(function(item) {
          item.isChanged = true;
        });
        self.redraw();
      }, false);

      maxHandle.addEventListener('click', function() {
        self.setValue(self.MAX_VALUE);
      });
    },

    toJSON: function() {
      return {
        value: this.getValue(),
        items: this._items.map(function(item) {
          return item.toJSON();
        })
      };
    },

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

    setValue: function(value) {
      if (value >= this.MIN_VALUE && value <= this.MAX_VALUE) {
        this._items.forEach(function(item, index) {
          item.setValue( +(index < value) );
        });
        this._value = this.getValue();
        this.redraw();
      } else {
        throw new Error('The value provided is greater than maximum possible!');
      }
    }
  });

  __exports__.RatingComponent = RatingComponent;
})(window, window.Helpers, window.RatingItem);