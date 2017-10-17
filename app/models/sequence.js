import DS from 'ember-data';

export default DS.Model.extend({
  filename: DS.attr(),
  hits: DS.attr(),
  steps: DS.attr(),
  offsetAmount: DS.attr(),
});
