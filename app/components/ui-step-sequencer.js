import Ember from 'ember';
import NexusMixin from 'cracked-synth-ember/mixins/nexus-ui-config';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-step-sequencer'],

  ElementName: 'Sequencer',

  ElementOptions: computed('width', 'length', 'value', {
    get() {
      // TODO: generalize ui element sizes to a global config
      // (or nexus mixin)

      return {
        'size': [get(this, 'width'), 30],
        'mode': 'toggle',
        'rows': 1,
        'columns': get(this, 'length'),
      }
    }
  }),

  length: computed('sequence.length', {
    get() {
      return get(this, 'sequence.length');
    }
  }),

  width: computed('length', {
    get() {
      return get(this, 'length') * 34.1;
    }
  }),

  init() {
    this._super(...arguments);
    set(this, 'initNexusOnHook', 'didUpdateAttrs');
  },

  didUpdateAttrs() {
    this._super(...arguments);

    this._nexusInit();

    if (get(this, 'sequence')) {

      let sequencer = get(this, 'NexusElement');

      sequencer.matrix.set.row(0, get(this, 'sequence'));

      sequencer.on('change',(v)=> {
        set(this, 'value', v);
      });

      this.bindStep();
    }
  },

  bindStep() {
    // on every step of the cracked step sequencer,
    // advance the NexusUI sequencer interface to next step (visual only)
    __(`.${get(this,'samplerId')}`).unbind('step');

    __(`.${get(this,'samplerId')}`).bind('step', ()=>{
        let sequencer = get(this, 'NexusElement');
        sequencer.next();
      },get(this,'sequence'));
  },

});
