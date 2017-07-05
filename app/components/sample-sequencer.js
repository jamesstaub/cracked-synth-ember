import Ember from 'ember';
import E from 'cracked-synth-ember/utils/euclidean';

const {
  get,
  computed,
} = Ember;

export default Ember.Component.extend({
  filepath: '/samples/Kurzweil_K2000/',

  componentClass: 'seq', // cracked class used on every node to allow for easy teardown of everything in this component

  samples: computed('filepath', {
    get() {
      const path = get(this, 'filepath');
      return {
        kick: `${path}kick.wav`,
        snare: `${path}snare3.wav`,
        hihat: `${path}hihat.wav`,
        clap: `${path}clap.wav`,
        gong: `${path}lo_gong.wav`,
      }
    }
  }),

  initSignalChain() {
    // create a compressor -> DAC node for other nodes to connect to
    __()
    .compressor({
      release:.1,
      class:get(this, 'componentClass'),
      id: 'master-compressor',
    })
    .dac(.7);
  },

  connectEffectsChains() {
    // in parallel connect samplers effects chains
    __('#hihat').ring()
      .highpass({frequency: 2000, q: 30})
      .gain(.2)
      .delay({damping:.9, delay:.11, feedback:.9, class:get(this, 'componentClass')})
      .connect('#master-compressor')

    __().lfo({frequency: 1, gain: 3000, modulates:'frequency'}).connect('highpass')
    __().lfo({type:"triangle", modulates:"delay", frequency:.001, gain:3}).connect("delay");
    __('#kick').gain(3).reverb({decay:50}).connect('#master-compressor');
  },

  buildSamplerNodes() {
    let samples = get(this, 'samples');
    let componentClass = get(this, 'componentClass');

    Object.keys(samples).forEach(function(sample){
      __()
      .sampler({
        id:sample,
        class: componentClass,
        path:samples[sample],
          })
        .connect('#master-compressor');
    });

  },

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

    __("#kick").bind("step", this.seqCBs.sampleNoteOn, E(7, 16));

    __("#snare").bind("step", this.seqCBs.loopPointRandom, E(5, 16));

    __("#clap").bind("step", this.seqCBs.sampleNoteOn, E(4, 16));

    __("#gong").bind("step", this.seqCBs.loopPointRandom, E(1, 64));

    __("#hihat").bind("step", this.seqCBs.sampleNoteOn, E(13, 16));

    // __("lfo").bind("step", this.seqCBs.loopPointRandom, E(3, 7));

    __.loop("start");
  },

  didInsertElement() {

    this.initSignalChain();
    this.connectEffectsChains();
    this.buildSamplerNodes();

    __().play();
    __.loop(250);

    this.bindSamplersToSequences();
  },

  willDestroyElement() {
    __.loop("stop");
    __(`.${get(this, 'componentClass')}`).remove();
  },


});
