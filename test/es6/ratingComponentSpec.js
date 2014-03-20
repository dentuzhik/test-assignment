
import RatingComponent from '../../app/scripts/es6/rating-component/rating-component';

describe('RatingComponent suite', function() {
  describe('Options are not set upon initialization', function() {
    beforeEach(function() {
      this.component = new RatingComponent();
    });

    it('checks initialization', function() {
      expect(this.component.el).toBeNull();
      expect(this.component.getValue()).toBe(0);
      expect(this.component.getItems().length).toBe(this.component.MAX_VALUE);
    });

    it('checks setting values', function() {
      var items = this.component.getItems()
        , minValue = this.component.MIN_VALUE
        , maxValue = this.component.MAX_VALUE
        , rand = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

      this.component.setValue(rand);

      // Check value of the component
      expect(this.component.getValue()).toBe(rand);

      // Check values of underlying items
      for (var j = rand - 1; j >= 0; j--) {
        expect(items[j].getValue()).toBe(1);
      }
      if (rand < maxValue) {
        expect(items[rand].getValue()).toBe(0);
      }

      expect(function() {
        this.component.setValue();
      }).toThrow();

      expect(function() {
        this.component.setValue(minValue - 1);
      }).toThrow();

      expect(function() {
        this.component.setValue(maxValue - 1);
      }).toThrow();
    });

    it('checks JSON representation', function() {
      expect( this.component.toJSON() ).toEqual({
        value: 0,
        items: [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 },
          { value: 0 }
        ]
      });

      this.component.setValue(4);
      expect( this.component.toJSON() ).toEqual({
        value: 4,
        items: [
          { value: 1 },
          { value: 1 },
          { value: 1 },
          { value: 1 },
          { value: 0 }
        ]
      });
    });
  });

  describe('Values are set upon initialization', function() {
    it('checks if valid value is set upon initialization', function() {
      var fixture = new RatingComponent()
        , maxValue = fixture.MAX_VALUE
        , initValue = maxValue - 1
        , component = new RatingComponent({ value: initValue })
        , items = component.getItems();

      // Check value of the component
      expect( component.getValue() ).toBe(initValue);

      // Check value of underlying items
      for (var i = initValue.length - 1; i >= 0; i--) {
        expect( items[i].getValue() ).toBe(1);
      }
      expect( items[initValue].getValue() ).toBe(0);
    });

    it('checks if invalid values are set upon initialization', function() {
      var fixture = new RatingComponent()
        , minValue = fixture.MIN_VALUE
        , maxValue = fixture.MAX_VALUE
        , ltMinComponent = new RatingComponent({ value: minValue - 1 })
        , gtMaxComponent = new RatingComponent({ value: maxValue + 1 })
        , components  = [ltMinComponent, gtMaxComponent]
        , items;

      // Check values of the components to be 0
      expect( ltMinComponent.getValue() ).toBe(minValue);
      expect( gtMaxComponent.getValue() ).toBe(minValue);

      // Check values of underlying items
      for (var i = 0; i < components.length; i++) {
        items = components[i].getItems();
        for (var j = items.length - 1; j >= 0; j--) {
          expect( items[j].getValue() ).toBe(0);
        }
      }
    });
  });

  describe('Items count is set upon initialization', function() {
    beforeEach(function() {
      this.initItemsCount = 8;
      this.component = new RatingComponent({
        itemsCount: this.initItemsCount
      });
    });

    it('checks items count', function() {
      var items = this.component.getItems();
      expect(items.length).toBe(this.initItemsCount);
    });
  });
});
