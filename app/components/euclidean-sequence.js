import Ember from 'ember';
import E from 'cracked-synth-ember/utils/euclidean';

const {
  get,
  computed,
  set,
  run: { next },
} = Ember;

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    set(this, 'lo', 2);
    set(this, 'hi', 8);
  },

  seq: computed('lo', 'hi', {
    // // TODO: done use computed prop here bc
    // it relies on value being printed in template
    // to execute
    get() {
      // preserve lo, hi order
      if (get(this, 'lo') > get(this, 'hi')) {
        next(() => {
          set(this, 'hi', get(this, 'lo'));
        });
      } else if (get(this, 'hi') < get(this, 'lo')) {
        next(() => {
          set(this, 'lo', get(this, 'hi'));
        });
      }

      let seq = E(get(this, 'lo'), get(this, 'hi'));
      get(this, 'onSetSeq')(seq);
      return seq;
    },

  }),

  actions: {
    setValue(evt) {
      set(this, evt.target.name, parseInt(evt.target.value));
    }
  }


});
