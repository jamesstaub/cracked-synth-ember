import Ember from 'ember';

const {
  get,
  set,
  computed,
  computed: {
    toggleProperty,
  },
} = Ember;

export default Ember.Component.extend({
  classNames: ['tone-lattice', 'normal-font'],

  toneLattice:[
    [12, 19, 26, 33, 40, 47, 54, 61, 68, 75, 82, 89],
    [24, 31, 38, 45, 52, 59, 66, 73, 80, 87, 94, 101],
    [36, 43, 50, 57, 64, 71, 78, 85, 92, 99, 106, 113],
    [48, 55, 62, 69, 76, 83, 90, 97, 104, 111, 118, 125],
    [60, 67, 74, 81, 88, 95, 102, 109, 116, 123, 130, 137],
    [72, 79, 86, 93, 100, 107, 114, 121, 128, 135, 142, 149]],

  oscCount: 6, //number of oscillators

  loopInterval: computed({
    set(key, val) {
      let interval = parseInt(val);
      if (interval) {
        __.loop(interval);

        return interval;
      }
    }
  }),

  init() {
    this._super(...arguments);
    set(this, 'loopInterval', 1000);
  },

  didInsertElement() {

    let oscCount = get(this, 'oscCount');

    __().compressor().dac();

    // ADSR is in seconds
    let attack = 0;
    let decay = get(this, 'loopInterval') / 4000;
    let sustain = .7;
    let hold = get(this, 'loopInterval') / 2000;
    let release = get(this, 'loopInterval') / 4;

    //create sinewaves in loop
    for(var i=0; i < oscCount ;i++){
      __().
      sine({frequency: 60, id:i}).
      adsr([attack, decay, sustain, hold, release]).
      lowpass({frequency:2000, gain: -36}).
      gain(0.5/get(this, 'oscCount')).
      panner({id: 'pan'+i}).
      reverb({decay:3, seconds:3, reverse:true}).
      connect("compressor");

      __().lfo({type:"sine",gain:2, frequency: 2, modulates:'pan', id:'lfo'+i}).connect('panner');
      __().lfo({type:"sine",gain:2, frequency: 2, modulates:'threshold', id:'gainLfo'+i}).connect('gain');
    }

    //initial trigger on script load
    __("adsr").adsr("trigger");


    // TODO: refactor these and toggle actions into set method
    // of computed property, so there's only one source of the propery + function call
    __.play()
    __.loop(get(this, 'loopInterval'));
    set(this, 'isLooping', true);
    set(this, 'isPlayingOsc', true);

    // bind nodes to loop
    __("sine,square,saw,adsr,panner,lfo").bind("step", (index,data, /*array*/) => {
      // execute every loop interval
      this._onLoopStep(index, data,);
    },
    [2, 3, 4, .5, 2, 1.3, 1.5] // data array iterated on each loop step
    ); //array

      __.loop("start");
  },

  _onLoopStep(index, data) {
    let oscCount = get(this, 'oscCount');
    let notes = this._neighbors();

    // loop over each sine and assign it a frequency
    for(var i=0; i < oscCount; i++){

      let f = __.pitch2freq(notes[i]);
      __("#"+i).attr({frequency:f})
      __("#"+i).attr({detune:data * 20})

      __("#lfo"+i).attr({frequency:data})
      __("#gainLfo"+i).frequency(__.random(.125, 3))
    }

  __("adsr").adsr("trigger");
  },

  _neighbors() {
    let oscCount = get(this, 'oscCount');

    let notes = []; // notes randomly pulled from tone lattice
    let activeTones = []; //2d array of coordinates for random tones selected by this function

    // go to random intial point in tonnetz matrix
    let initial = [__.random(1,3), __.random(1,5)];

    activeTones.push(initial);

    //randomly select notes adjacent to initial note in the matrix on X and Y axis
    for(let i=0; i < oscCount ;i++){
        // random coordinates within 1 step in either direction
      let randomRow = initial[0] + __.random(-1,1);
      let randomCol = initial[1] + __.random(-1,1);
      notes.push(get(this, 'toneLattice')[randomRow][randomCol]);

      activeTones.push([randomCol,randomRow]);
    }

    this._highlightActiveTones(activeTones);

    return notes;
  },

  _highlightActiveTones(activeTones) {
    this.$().find('td').removeClass('active');
    activeTones.forEach((coord)=>{
      let $element = this.$().find(`[data-tone-row="${coord[0]}"][data-tone-col="${coord[1]}"]`);
      $element.addClass('active');
    })
  },

  actions: {
    togglePlayOsc() {
      if (get(this, 'isPlayingOsc')){
        __.stop();
        __.loop("stop");
      } else {
        __.play();
        __.loop("start");
      }
      this.toggleProperty('isPlayingOsc');
    },

    toggleLoop() {
      if (get(this, 'isLooping')){
        __.loop("stop");
      } else {
        __.loop("start");
      }
      this.toggleProperty('isLooping');
    },
  }

});
