
import Helpers from '../../app/scripts/es6/rating-component/helpers';

describe('Helpers suite', function() {
  beforeEach(function() {
    this.firstId = Helpers.uuid();
    this.secondId = Helpers.uuid();
  });

  it('generates unique uuids', function() {
    expect(this.firstId.length).toBe(36);
    expect(this.first).not.toEqual(this.secondId);
  });
});
