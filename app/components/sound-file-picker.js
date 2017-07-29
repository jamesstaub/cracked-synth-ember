import Ember from 'ember';

const {
  get,
  set
} = Ember;

export default Ember.Component.extend({

  filePath: '/samples/Kurzweil_K2000/',

  fileNames:[
    'lo_gong.wav',
    'orchdrum.wav',
    'hicymbal.wav',
    'locymbal.wav',
    'drumx.wav',
    'snare3.wav',
    'spacetom.wav',
    'hitriang.wav',
    'spacesnr.wav',
    'snare.wav',
    'kick.wav',
    'snare2.wav',
    'lotom.wav',
    'clap.wav',
    'tomshakr.wav',
    'hitom.wav',
    'cowbell.wav',
    'hihat2.wav',
    'rattle.wav',
    'shaker.wav',
    'hihat.wav'
  ],

  actions: {
    setValue(evt) {
      set(this, 'fileName', evt.target.value);
      // let filePath = `${get(this, 'filePath')}${get(this, 'fileName')}`
      get(this, 'onSetValue')(get(this, 'filePath'), get(this, 'fileName'));
    }
  }

});
