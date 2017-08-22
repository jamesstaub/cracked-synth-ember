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

    // dict of parameter values for each step
    // in current sequence
    let seqParamsDict = {
      speed: new Array(16).fill(1),
      loopEnd: new Array(16).fill(1),
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

  // callback functions to be called on each step of sequencer
  onStepCallback(index, data){
    if (data) {
      __(this).stop();
      __(this).start();

      let speed = get(this, 'seqParamsDict')['speed'][index];

      __(`#${get(this, '_id')}`).attr({speed: speed});


    if(get(this, 'isLooping')){
        let loopEnd = get(this, 'seqParamsDict')['loopEnd'][index];

        __(`#${get(this, '_id')}`).attr({loop:true, start: 0, end: loopEnd});
      }
    } else {
      __(`#${get(this, '_id')}`).attr({loop:false});
    }

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

    setParamDial(parameter, index, value) {
      let dict = get(this, 'seqParamsDict');
      dict[parameter][index] = value;
    },
  }


});
