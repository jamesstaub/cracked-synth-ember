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
      // shared id with cracked sampler node
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

    // dict of paramter values for each step
    // in current sequence
    let seqParamsDict = {
      speed: new Array(16),
      loopEnd: new Array(16),
    };
    set(this, 'seqParamsDict', seqParamsDict);
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

  allStepsSelected: computed('selectedStep', {
    get() {
      return get(this, 'selectedStep') === 'all';
    }
  }),

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    if (data) {
      __(this).stop();
      __(this).start();

    if(get(this, 'isLooping')){
        let loopEnd = get(this, 'allStepsSelected')
          ? get(this, 'loopEnd')
          : get(this, 'seqParamsDict')['loopEnd'][index];

        __(`#${get(this, '_id')}`).attr({loop:true, start: 0, end: loopEnd});
      }
    } else {
      __(`#${get(this, '_id')}`).attr({loop:false});
    }

    let speed = get(this, 'allStepsSelected')
      ? get(this, 'speed')
      : get(this, 'seqParamsDict')['speed'][index];

    __(`#${get(this, '_id')}`).attr({speed: speed});

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

    setParam(evt) {
      let name = evt.target.name;

      // divide integer slider values by 100 and set property
      let val = evt.target.value / 100;
      if (get(this, 'allStepsSelected')) {
        set(this, name, val);
        this.send('applySettings');
      } else {

        let parmsDict = get(this, 'seqParamsDict');
        let selectedStep = get(this, 'selectedStep')

        parmsDict[name][selectedStep] = val;
      }

    },

    toggleControlGroup(evt) {
      let btn = evt.target;
      let name = btn.name;
      set(this, 'visibleControlGroup', name);

      this.$().find(`.control-group`).addClass('hidden')
      this.$().find(`.control-group.${name}`).removeClass('hidden');

      this.$().find(`.toggle-control-group`).removeClass('active');
      this.$(btn).toggleClass('active');
    },

    onSelectSeqStep(evt) {
      let name = evt.target.name;

      if (name === 'selectAllSteps') {
        set(this, 'selectedStep', 'all');
      } else {
        let step = parseInt(name);
        set(this, 'selectedStep', step);
      }
      return false;
    }

  }


});
