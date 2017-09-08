import Ember from 'ember';

import { computed, get, set } from "@ember/object";

export default Ember.Mixin.create({
  nexusId: computed('elementId', {
    get() {
      // strip 'ember' out of component id and use as
      // nexus instance id
      return parseInt(get(this, 'elementId').substring(5));
    },
  }),

  _nexusInit() {
    if (get(this, 'NexusElement')) {
      get(this, 'NexusElement').destroy();
    }

    // components that use this mixin must set ElementName and ElementOptions
    let ElementOptions = get(this, 'ElementOptions');
    let ElementName = get(this, 'ElementName');

    let NexusElement =  new Nexus[ElementName](`#${get(this, 'nexusId')}`, ElementOptions);

    set(this, 'NexusElement', NexusElement);

    if (get(this, 'onChangeValue')) {
      NexusElement.on('change',(v)=> {
        set(this, 'value', v);

        // components using this mixin must have an action onChangeValue passed in
        get(this, 'onChangeValue')(v);
      });
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    if (get(this, 'NexusElement')) {
      get(this, 'NexusElement').destroy();
    }

  },

});
