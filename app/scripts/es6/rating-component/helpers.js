
var Helpers = {
  // See http://stackoverflow.com/a/2117523/1815933
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },

  isTouchDevice: function() {
    return ('ontouchstart' in window) ||
      window.DocumentTouch &&
      document instanceof DocumentTouch;
  }
};

export default Helpers;