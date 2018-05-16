import Ember from 'ember';

const { get, set, getOwner } = Ember;

export default Ember.Component.extend({
  tagName: 'nav',

  didRender() {
    let currentRoute = getOwner(this).lookup('controller:application')
      .currentPath;

    get(this, 'routes').map(route => {
      let isCurrent = route.route == currentRoute;
      set(route, 'isCurrent', isCurrent);
      return route;
    });
  },

  routes: [
    { route: 'index', display: 'home' },
    { route: 'doodles.tone-lattice', display: 'tone lattice' }
  ]
});
