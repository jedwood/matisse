var moment  = require('moment'),
    crypto = require('crypto');


module.exports = {
  RealTypeOf: function(v) {
    if (typeof(v) == "object") {
      if (v === null) return "null";
      if (v.constructor == (new Array).constructor) return "array";
      if (v.constructor == (new Date).constructor) return "date";
      if (v.constructor == (new RegExp).constructor) return "regex";
      return "object";
    }
    return typeof(v);
  },
  // strip an array of objects down to a simple array element
  simplifyArray: function(arr, field) {
    return arr.map(function(el){
      return el[field];
    });
  },

  saltPassword: function(password) {
    var secretsalt = "guapoyermom";
    return crypto.createHmac('sha1', secretsalt).update(password).digest('hex');
  },

  formatDateTime: function(datetime, format) {
    format = format || "L LT";
    datetime = datetime || new Date();
    return moment(datetime).format(format);
  },

  truncate: function(text, length, extraChars) {
    extraChars = extraChars || '...';
    if (text && text.length > length) {
      return text.slice(0, length - extraChars.length) + extraChars;
    } else {
      return text;
    }
  },

  numberToPhone: function(number) {
    if (number) {
      var _num = number.toString();
      var nums = _num.length > 7 ? [ _num.slice(0, 3), _num.slice(3, 6), _num.slice(6, 10) ] : [_num.slice(0, 3), _num.slice(3, 7)];
      return nums.join('-');
    }
  },

  pluralize: function(string, count) {
    return count === 1 ? string : string + "s";
  },

  alphabet: function(){
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  },

  /**
   * Get a random integer between 0 and `max`.
   * Not cryptographically strong.
   *
   * @param {Integer} max
   * @return {Integer} random integer
   */

  randomInt: function (max) {
      return Math.random() * max | 0;
  },

  /**
   * Get a random character.
   * Not cryptographically strong.
   *
   * @param {String|Array} charset
   * @return {String} a random character
   */

  randomChar: function (charset) {
    var chars = charset || this.alphabet();
    var index = this.randomInt(chars.length);
    return chars[index];
  },

  /**
   * Get a random string.
   * Not crypographically strong.
   *
   * @param {Integer} length
   * @return {String} a random string
   */

  randomString: function (length) {
    var result = [];
    while (length--)
      result.push(this.randomChar());
    return result.join('');
  },

  merge:function() {
    var objs = Array.prototype.slice.apply(arguments),
        ret = objs.shift();

    objs.forEach(function(obj) {
      for(var prop in obj) { ret[prop] = obj[prop]; }
    });
    return ret;
  }

};

