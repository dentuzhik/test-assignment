
import RatingItem from '../../app/scripts/es6/rating-component/rating-item';

describe('RatingItem suite', function() {
  describe('Value is not set upon initialization', function() {
    beforeEach(function() {
      this.item = new RatingItem();
    });

    it('checks initial value of an item to be 0', function() {
      expect( this.item.getValue() ).toBeDefined();
      expect( this.item.getValue() ).toBe(0);
    });

    it('sets a new value and checks new value and isChanging flag', function() {
      this.item.setValue(0);
      expect( this.item.getValue() ).toBe(0);
      expect( this.item.isChanging ).toBe(false);

      this.item.setValue(1);
      expect( this.item.getValue() ).toBe(1);
      expect( this.item.isChanging ).toBe(false);

      // Invalid cases
      this.item.setValue();
      expect( this.item.getValue() ).toBe(0);
      expect( this.item.isChanging ).toBe(false);

      this.item.setValue(-1);
      expect( this.item.getValue() ).toBe(0);
      expect( this.item.isChanging ).toBe(false);

      this.item.setValue(2);
      expect( this.item.getValue() ).toBe(0);
      expect( this.item.isChanging ).toBe(false);
    });

    it('checks JSON representation', function() {
      expect( this.item.toJSON() ).toEqual({ value: 0 });

      this.item.setValue(1);
      expect( this.item.toJSON() ).toEqual({ value: 1 });
    });

    it('checks element creation', function() {
      expect(this.item.el).toBeNull();
      this.item.create();
      expect(this.item.el).not.toBeNull();
    });
  });

  describe('Value is set upon initialization to 0', function() {
    beforeEach(function() {
      this.item = new RatingItem(0);
    });

    it('checks initial value of an item to be 0', function() {
      expect( this.item.getValue() ).toBeDefined();
      expect( this.item.getValue() ).toBe(0);
    });
  });

  describe('Value is set upon initialization to 1', function() {
    beforeEach(function() {
      this.item = new RatingItem(1);
    });

    it('checks initial value of an item to be 1', function() {
      expect( this.item.getValue() ).toBeDefined();
      expect( this.item.getValue() ).toBe(1);
    });
  });
});
