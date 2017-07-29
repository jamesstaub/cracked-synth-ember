import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['sampler-track'],
  _id: computed('elementId', {
    get() {
      // strip 'ember' out of id
      return parseInt(get(this, 'elementId').substring(5));
    },
  }),

  isDisabled: false,
  autoApply: true, // update settings continuously

  fullFileName: computed('filePath', 'fileName', {
    get() {
      return `${get(this, 'filePath')}${get(this, 'fileName')}`;
    }
  }),

  didReceiveAttrs() {
    this._super(...arguments);
  },

  disconnectAll() {
    __(`#${get(this, '_id')}`).unbind("step");
    __(get(this, '_id')).remove();
  },

  buildNode() {
    __()
    .sampler({
      id: `${get(this, '_id')}`,
      path: get(this, 'fullFileName'),
    })
    .connect(get(this, 'outputSelector'));
  },

  bindStep() {
    __(`#${get(this,'_id')}`).bind("step",
      get(this, 'onStepCallback'),
      get(this,'sequence')
    );
  },

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    if (data) {
      __(this).stop();
      __(this).start();
    }
  },

  actions: {

    applySettings() {
      set(this, 'isDisabled', true);
      this.disconnectAll();
      this.buildNode();
      this.bindStep();
    },

    setSampleFile(path, name) {
      set(this, 'isDisabled', false);
      set(this, 'fullFileName', `${path}${name}`);

      if (get(this, 'autoApply')) {
        this.send('applySettings');
      }
    },
    setEucSeq(seq) {
      set(this, 'isDisabled', false);
      set(this, 'sequence', seq);

      if (get(this, 'autoApply')) {
        this.send('applySettings');
      }
    }
  }


});
