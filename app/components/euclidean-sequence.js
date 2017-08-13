import Ember from 'ember';
import E from 'cracked-synth-ember/utils/euclidean';

const {
  get,
  set,
  run: {next},
} = Ember;

Array.prototype.rotate = (function() {
  // save references to array functions to make lookup faster
  var push = Array.prototype.push,
    splice = Array.prototype.splice;

  return function(count) {
    var len = this.length >>> 0; // convert to uint
    count = count >> 0; // convert to int

    // convert count to value in range [0, len)
    count = ((count % len) + len) % len;

    // use splice.call() instead of this.splice() to make function generic
    push.apply(this, splice.call(this, 0, count));
    return this;
  };
})();

export default Ember.Component.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    // using next instead of fixing double update is kind of a hack
    next(()=>{
      this.calculateSequence();
    })
  },

  _offsetSeq(seq, amount) {
    return seq.push(seq.slice(amount));
  },

  calculateSequence() {
    let [hits, steps] = this._sortParameters(
      get(this, 'hits'), get(this, 'steps')
    );

    let seq = E(hits, steps)
      .rotate(get(this, 'offsetAmount'));

    get(this, 'onSetSeq')(seq);
  },

  _sortParameters(hits, steps) {
    //for euclidean algorithm hits must always be lower than steps
    let params = [hits, steps].sort((a, b)=>{
      // method to sort by value, not alpha
      return a - b;
    });

    set(this, 'hits', params[0]);
    set(this, 'steps', params[1]);

    return params;
  },

  actions: {
    setValue(evt) {
      set(this, evt.target.name, parseInt(evt.target.value));
      this.calculateSequence();
    }
  }


});
