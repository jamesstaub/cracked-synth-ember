import Ember from 'ember';

const {
  set
} = Ember;

export default Ember.Route.extend({
  model() {
    return this.store.findAll('sequence');
  },

  setupController(controller, model) {
    this._super(controller, model);

    set(this, 'controller.model', model);
  },
  tracks() {
    let path = '/samples/Kurzweil_K2000/';
    return [
      { id:1,
        fileName: `kick.wav`,
        filePath: path,
        eucParams: {
          hits: 2,
          steps: 8,
          offsetAmount: 0,
        },
      },
      { id:2,
        fileName: `snare3.wav`,
        filePath: path,
        eucParams: {
          hits: 2,
          steps: 8,
          offsetAmount: 0,
        },
      },
      { id:3,
        fileName: `hihat.wav`,
        filePath: path,
        eucParams: {
          hits: 2,
          steps: 8,
          offsetAmount: 0,
        },
      },
      { id:4,
        fileName: `tomshakr.wav`,
        filePath: path,
        eucParams: {
          hits: 2,
          steps: 8,
          offsetAmount: 0,
        },
      }
    ];
  },

});
