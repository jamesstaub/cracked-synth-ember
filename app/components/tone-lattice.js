import Ember from 'ember';

const {
  get,
  set,
  computed,
} = Ember;

export default Ember.Component.extend({
  classNames: ['tone-lattice', 'normal-font'],

  oscCount: 4, //number of oscillators

  loopInterval: computed({
    set(key, val) {
      let interval = parseInt(val);

      if (interval) {
        __.loop(interval);

        if (get(this, 'domReady')){
          // add css animation
          this.$().find('.toneCell').css('transition', `background-color ${val * .75}ms ease-in-out`)
        }

        return interval;
      }

    }
  }),


  init() {
    this._super(...arguments);
    set(this, 'loopInterval', 1000);

    set(this, 'toneLattice', this._generateToneLattice());
  },

  didInsertElement() {
    set(this, 'domReady', true);
    let oscCount = get(this, 'oscCount');

    __().compressor().dac();

    // ADSR is in seconds
    let attack = 0;
    let decay = get(this, 'loopInterval') / 4000;
    let sustain = .7;
    let hold = get(this, 'loopInterval') / 3000;
    let release = get(this, 'loopInterval') / 8000;

    //create sinewaves in loop
    for(var i=0; i < oscCount ;i++){
      __().
      sine({frequency: 60, id:i}).
      adsr([attack, decay, sustain, hold, release]).
      lowpass({frequency:9000, gain: -12}).
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
    // TODO: refactor to dynamically get ranges from generated matrix
    let initial = [__.random(1,7), __.random(1,7)];

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

  _generateToneLattice(rowLen = 12, colLen = 12, rowInterval = 7, colInterval = 4, minimum = 24) {
    const matrix = [];

    const range = (start, end) => Array.from({ length: (end - start) }, (v, k) => k + start);

    // range from lowest value to length of rows
    let rowRange = range(minimum, rowLen + minimum);

    // build matrix row by row
    for (let row = 0; row < colLen; row++ ) {
      matrix.push(rowRange
        .map((x, idx) => (x + ((rowInterval - 1) * idx)) + (colInterval * row)));
    }

    return matrix;
  },

  actions: {
    togglePlayOsc() {
      if (get(this, 'isPlayingOsc')){
        __.stop();
        __.loop("stop");
      } else {
        __.play();

        if (get(this, 'isLooping')) {
          __.loop("start");
        }
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
