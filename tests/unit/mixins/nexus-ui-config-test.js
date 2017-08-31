import Ember from 'ember';
import NexusUiConfigMixin from 'cracked-synth-ember/mixins/nexus-ui-config';
import { module, test } from 'qunit';

module('Unit | Mixin | nexus ui config');

// Replace this with your real tests.
test('it works', function(assert) {
  let NexusUiConfigObject = Ember.Object.extend(NexusUiConfigMixin);
  let subject = NexusUiConfigObject.create();
  assert.ok(subject);
});
