import Ember from 'ember';

import { get, set, computed } from "@ember/object";


export default Ember.Component.extend({
  classNames: ['sampler-track'],

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

  init() {
    this._super(...arguments);
    set(this, 'isLooping', true);
    set(this, 'loopEnd', 1);
    set(this, 'speed', 1);
    set(this, 'trackGain', .7);

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
    __(`.${get(this, '_id')}`).unbind("step");
    __(get(this, '_id')).remove();
  },

  buildNode() {

    __()
    .sampler({
      class: `${get(this, '_id')}`,
      path: get(this, 'fullFileName'),
    })
    .gain({
      class:`${get(this, '_id')}-gain`,
    })
    .connect(get(this, 'outputSelector'));

    __(`.${get(this, '_id')}-gain`).volume(get(this, 'trackGain'));

  },

  bindStep() {
    __(`.${get(this,'_id')}`).bind("step",
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
      __(this).attr({speed: speed});


    if(get(this, 'isLooping')){
        let loopEnd = get(this, 'seqParamsDict')['loopEnd'][index];
        __(this).attr({loop:true, start: 0, end: loopEnd});
      }
    } else {
      if (!get(this, 'isLegato')) {
        __(this).attr({loop:false});
      }
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

    setTrackValue(parameter, value){

      if(parameter == 'trackGain') {
        // shitty amplitude to db
        // value = __.scale(value, 1, 0, 0, 100, 'logarithmic') * -1;
        __(`.${get(this, '_id')}-gain`).volume(value);
         value = Math.round(value * 100) / 100;
      }
      set(this, parameter, value);

    },

    // TODO: rename this to make it a general action for setting onstep values (not dial specific)
    setParamDial(parameter, index, value) {
      let paramDict = get(this, 'seqParamsDict');
      if (index === 'all') {
        set(this, `seqParamsDict.${parameter}`, paramDict[parameter].map(()=> value));
      } else {
        paramDict[parameter][index] = value;
      }

    },
  }


});
