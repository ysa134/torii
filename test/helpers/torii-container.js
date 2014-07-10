import bootstrapTorii from 'torii/bootstrap/torii';

export default function toriiContainer(fullNames) {
  var container = new Ember.Container();
  return bootstrapTorii(container);
}
