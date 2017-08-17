import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
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
      get(this, 'uiElement').destroy();
    }

    if (get(this, 'sliders')) {
      set(this, 'width', get(this, 'sliders') * 33.5);

      let uiElement =  new Nexus.Multislider(`#${get(this, 'nexusId')}`, {
       'size': [get(this, 'width') ,100],
       'numberOfSliders': get(this, 'sliders'),
       'min': 0,
       'max': 1,
       'step': 0,
     });

      set(this, 'uiElement', uiElement);

      uiElement.on('change',(v)=> {
        set(this, 'value', v);
        get(this, 'onChangeValue'(v));
      });
    }
  },

  didInsertElement() {
    this._super(...arguments);

  },
});
