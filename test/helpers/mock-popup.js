import ParseQueryString from 'torii/lib/parse-query-string';

var MockPopup = function(options) {
  options = options || {};

  this.opened = false;
  this.state = options.state;
};

MockPopup.prototype.open = function(url){
  this.opened = true;

  var parser = new ParseQueryString(url, ['state']),
    data = parser.parse(),
    state = data.state;

  if (this.state !== undefined) {
    state = this.state;
  }

  return Ember.RSVP.resolve({ code: 'test', state: state });
};

export default MockPopup;
