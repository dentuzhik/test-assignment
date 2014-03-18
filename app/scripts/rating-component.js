
(function() {
  var Helpers = {
    // See http://stackoverflow.com/a/2117523/1815933
    uuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    }
  };


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

  window.RatingComponent = RatingComponent;
})();