import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tone-lattice', 'Integration | Component | tone lattice', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tone-lattice}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tone-lattice}}
      template block text
    {{/tone-lattice}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
