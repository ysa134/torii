/**
 * This class emulates a successful authentication, returning
 * a DummyAuthentication object.
 */

import DummyAuthentication from 'torii/authentications/dummy';
export default Ember.Object.extend({

  open: function(){
    return Ember.RSVP.resolve(DummyAuthentication.create());
  }

});
