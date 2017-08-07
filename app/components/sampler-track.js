import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['sampler-track'],
  classNameBindings: ['isSelected'],

  _id: computed('elementId', {
    get() {
      // strip 'ember' out of id
      return parseInt(get(this, 'elementId').substring(5));
    },
  }),

  trackEnabled: false,

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
    set(this, 'isLooping', true);
    set(this, 'loopEnd', 1);
    set(this, 'speed', 1);
    set(this, 'selectedStep', 'all');
  },

  willDestroy() {
    this.disconnectAll();
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

    __(`#${get(this, '_id')}`).attr({speed:get(this, 'speed')});

  },

  actions: {
    applySettings() {
      this.disconnectAll();
      this.buildNode();
      this.bindStep();
    },

    setSampleFile(path, name) {
      set(this, 'fullFileName', `${path}${name}`);

      this.send('applySettings');
    },
    setEucSeq(seq) {
      set(this, 'sequence', seq);
      this.send('applySettings');
    },

    setDecimalSlider(evt) {
      // divide integer slider values by 100 and set property
      let name = evt.target.name;
      let val = evt.target.value / 100;
      set(this, name, val);
      this.send('applySettings');
    },

    toggleControlGroup(evt) {
      let btn = evt.target;
      let name = btn.name;
      this.$().find(`.control-group`).addClass('hidden')
      this.$().find(`.control-group.${name}`).removeClass('hidden');

      this.$().find(`.toggle-control-group`).removeClass('active');
      this.$(btn).toggleClass('active');
    },

    onSelectSeqStep(evt) {
      let name = evt.target.name;

      if (name === 'selectAllSteps') {
        set(this, 'allStepsSelected', true);
      } else {
        set(this, 'allStepsSelected', false);
        let step = parseInt(name);
        set(this, 'selectedStep', step);
      }
      return false;
    }

  }


});
