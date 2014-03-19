(function(__exports__) {
  "use strict";

  var Helpers = {
    /**
     * Generates UUID according to RFC-4122
     * See http://stackoverflow.com/a/2117523/1815933
     *
     * @return {String} unique identifier
     */
    uuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    /**
     * Checks for touch support on a device
     *
     * @return {Boolean}
     */
    isTouchDevice: function() {
      return ('ontouchstart' in window) ||
        window.DocumentTouch &&
        document instanceof DocumentTouch;
    }
  };

  __exports__.Helpers = Helpers;
})(window);