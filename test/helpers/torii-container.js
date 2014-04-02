import bootstrapTorii from 'torii/bootstrap';

export default function toriiContainer(fullNames) {
  var container = new Ember.Container();
  return bootstrapTorii(container);
}
