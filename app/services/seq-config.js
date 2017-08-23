import Ember from 'ember';

export default Ember.Service.extend({
  colors: {
    uiPrimary: {
      accent: '#786D72',
      fill: '#7F878B',
      dark: '#231B24',
      light: '#F9F9F8',
      mediumDark: '#7F7C7C',
      mediumLight: '#7F878B',
    },
    uiSecondary: {
      accent: '',
      fill: '',
      dark: '',
      light: '',
      mediumDark: '',
      mediumLight: '',
    }
  }
});
