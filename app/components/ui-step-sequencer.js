import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['ui-step-sequencer'],

  init() {
    this._super(...arguments);
  },

  nexusId: computed('elementId', {
    get() {
      // strip 'ember' out of id
      return parseInt(get(this, 'elementId').substring(5));
    },
  }),

  didUpdateAttrs() {

    if (get(this, 'uiElement')) {
      // TODO: create a nexusUI mixin to avoid this duplication
      get(this, 'uiElement').destroy();
    }
    let length = get(this, 'sequence.length');
    // let matrix = new Nexus.Matrix(1, length);

    // TODO: generalize ui element sizes to a global config
    let width = length * 34.1;

    let sequencer =  new Nexus.Sequencer(`#${get(this, 'nexusId')}`, {
      'size': [width,30],
      'mode': 'toggle',
      'rows': 1,
      'columns': length,
    });

    sequencer.matrix.set.row(0, get(this, 'sequence'));

    set(this, 'uiElement', sequencer);

    sequencer.on('change',(v)=> {
      set(this, 'value', v);
    });

  },

});
