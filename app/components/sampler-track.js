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

  fullFileName: computed('filePath', 'fileName', {
    get() {
      return `${get(this, 'filePath')}${get(this, 'fileName')}`;
    }
  }),

  isLooping: computed({
    set(key, value) {
      {
        __(`#${get(this, '_id')}`).attr({loop: value});
        return value;
      }
    },
  }),

  init() {
    this._super(...arguments);
    set(this, 'isLooping', false);
    set(this, 'loopEnd', 1);
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
      get(this, 'onStepCallback').bind(this),
      get(this,'sequence')
    );
  },

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    if (data) {
      __(this).stop();
      __(this).start();

      if(get(this, 'isLooping')){
        __(`#${get(this, '_id')}`).attr({loop:true, start: 0, end: get(this, 'loopEnd')});
      }
    } else {
      __(`#${get(this, '_id')}`).attr({loop:false});
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

      this.send('applySettings');
    },
    setEucSeq(seq) {
      set(this, 'isDisabled', false);
      set(this, 'sequence', seq);
      this.send('applySettings');
    },

    setDecimalSlider(evt) {
      let name = evt.target.name;
      let val = evt.target.value / 100;
      set(this, name, val);
    }
  }


});
