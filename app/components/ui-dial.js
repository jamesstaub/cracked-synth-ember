import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['ui-dial'],
  tagName: ['span'],

  init() {
    this._super(...arguments);
  },
  nexusId: computed('elementId', {
    get() {
      // strip 'ember' out of id
      return parseInt(get(this, 'elementId').substring(5));
    },
  }),

  didInsertElement() {

    if (get(this, 'uiElement')) {
      get(this, 'uiElement').destroy();
    }

    // if (get(this, 'value')) {
      let uiElement =  new Nexus.Dial(`#${get(this, 'nexusId')}`, {
        'size': [30,30],
        'interaction': 'vertical', // "radial", "vertical", or "horizontal"
        'mode': 'relative', // "absolute" or "relative"
        'min': 0,
        'max': 2,
        'step': 0,
        'value': get(this, 'value')
      });

      set(this, 'uiElement', uiElement);

      uiElement.on('change',(v)=> {
        set(this, 'value', v);
        get(this, 'onChangeValue')(v);
      });
    // }
  },

});
