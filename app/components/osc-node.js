import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({

  isOn: false,
  classNames: ['osc-node'],
  classNameBindings:['isOn'],

  type: 'square',

  min: 0,
  max: 30,

  rangeValue: computed('ratio', {
    get(val) {
      return val;
    },
    set(key, val) {
      set(this, 'ratio', val / 10);
      return val;
    }
  }),

  frequency: computed('fundamental', 'ratio', {
    get() {
      return get(this, 'fundamental') * get(this, 'ratio');
    },
  }),

  didInsertElement() {
    let frequency = get(this, 'frequency');
    __()[get(this, 'type')]({frequency, id:`osc-${this.elementId}`}).connect('compressor');
  },

  actions: {
    onUpdateRatio(ratio) {
      set(this, 'ratio', ratio);
      let frequency = get(this, 'frequency');
      __(`#osc-${this.elementId}`).attr({frequency});
    },

    toggle(ratio) {
      this.toggleProperty('isOn');
      set(this, 'ratio', ratio);

      let frequency = get(this, 'frequency');
      if (get(this, 'isOn')) {
        __(`#osc-${this.elementId}`).attr({frequency}).start();
      } else {
        __(`#osc-${this.elementId}`).stop();
      }
    },

  }

});
