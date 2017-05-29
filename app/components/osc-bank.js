import Ember from 'ember';

const {
  get,
  set,
} = Ember;

export default Ember.Component.extend({

  fundamental: 60,

  overtones: [.5, 1, 1.5],

  init() {
    this._super(...arguments);
    let amplitude = get(this, 'overtones').lenght / 12;
    __().compressor().dac(amplitude)
  },

  actions: {
    onUpdateFundamental(fundamental) {
      set(this, 'fundamental', fundamental);
    }
  }
});
