import Ember from 'ember';
// import E from 'cracked-synth-ember/utils/euclidean';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({

  tracks: computed('filepath', {
    get() {
      let path = '/samples/Kurzweil_K2000/';
      return [
        {
          fileName: `kick.wav`,
          filePath: path
        },
        {
          fileName: `snare3.wav`,
          filePath: path
        },
        {
          fileName: `hihat.wav`,
          filePath: path
        },
        {
          fileName: `tomshakr.wav`,
          filePath: path
        }
      ];
    }
  }),

  initSignalChain() {
    // create a compressor -> DAC node for other nodes to connect to
    __()
    .compressor({
      release:.1,
      id: 'master-compressor',
    })
    .dac(get(this, 'dacGain'));
  },



  connectEffectsChains() {
    // in parallel connect samplers effects chains
    // __('sampler').ring()
    //   .highpass({frequency: 2000, q: 30})
    //   .gain(.6)
    //   .delay({damping:.9, delay:.11, feedback:.9})
    //   .connect('#master-compressor')
    //
    // __().lfo({frequency: 1, gain: 2000, modulates:'frequency'}).connect('highpass')
    // __().lfo({type:"triangle", modulates:"delay", frequency:.001, gain:3}).connect("delay");
    // __('#kick').gain(3).reverb({decay:50}).connect('#master-compressor');
  },

  // buildSamplerNodes() {
  //   let samples = get(this, 'samples');
  //
  //   Object.keys(samples).forEach(function(sample){
  //     __()
  //     .sampler({
  //       id:sample,
  //       path:samples[sample],
  //         })
  //       .connect('#master-compressor');
  //   });
  //
  // },

  // callback functions to be called on each step of sequencer
  seqCBs: {
    sampleNoteOn(index, data) {
      if (data) {
        __(this).stop();
        __(this).start();
      }
    },

    repitchRandom(index, data) {
      if (data) {
        __(this).stop();
        __(this).start();
        __.speed(__.random(.125, 4));
      }
    },

    loopPointRandom(index, data) {
      if (data) {
        __(this).stop();
        __(this).start();

      }

      let endpoint = data ? Math.random() / (index + 1) : 0;

      // arbitrary beats to glitch looppint on
      if (index % 8 === 0 || index %3 === 0) {
        __(this).attr({loop:true, start: 0, end: endpoint});
      } else {
        __(this).attr({loop:false});
      }
    },

  },

  bindSamplersToSequences() {
    //
    // __("#kick").bind("step", this.seqCBs.sampleNoteOn, E(7, 16));
    //
    // __("#snare").bind("step", this.seqCBs.loopPointRandom, E(5, 16));
    //
    // __("#clap").bind("step", this.seqCBs.sampleNoteOn, E(4, 16));
    //
    // __("#gong").bind("step", this.seqCBs.loopPointRandom, E(1, 64));
    //
    // __("#hihat").bind("step", this.seqCBs.sampleNoteOn, E(13, 16));
    //
  },

  didInsertElement() {

    this.initSignalChain();
    this.connectEffectsChains();
    // this.buildSamplerNodes();

    __().play();
    __.loop(250);

    this.bindSamplersToSequences();
    __.loop("start");
  },

  willDestroyElement() {
    __.loop("stop");
    __("*").remove();
  },

  actions: {
    setDacGain(evt) {
      let gain = (evt.target.value * 1.2) / 100;
      __('dac').attr({gain:gain});
    }
  }


});
