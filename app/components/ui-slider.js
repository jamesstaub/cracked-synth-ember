import Ember from 'ember';
import NexusMixin from 'cracked-synth-ember/mixins/nexus-ui-config';
import { get, computed } from "@ember/object";

export default Ember.Component.extend(NexusMixin, {
  classNames: ['ui-slider'],

  ElementName: 'Slider',

  ElementOptions: computed('max', 'step', 'value', {
    get() {

      return {
        'size': [20,100],
        'mode': 'relative', // "absolute" or "relative"
        'min': 0,
        'max': get(this, 'max') || 1,
        'step': get(this, 'step') || 0,
        'value': get(this, 'value')
      }
    }
  }),

});
