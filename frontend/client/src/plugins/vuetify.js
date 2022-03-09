import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import VueGoogleCharts from 'vue-google-charts'

Vue.use(VueGoogleCharts)
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#4EC1E0",
      }
    }
  },
});