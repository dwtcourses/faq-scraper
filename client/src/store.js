import Vue from "vue";
import Vuex from "vuex";
const superagent = require("superagent");

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    resultsJson: null,
    configs: [],
    showNewConfigDialog: false,
    newConfigBase: null,
  },
  getters: {
    newConfigBase: (state) => {
      return state.newConfigBase;
    },
    resultsJson: (state) => {
      return state.resultsJson;
    },
    configs: (state) => {
      return state.configs;
    },
    showNewConfigDialog: (state) => {
      return state.showNewConfigDialog;
    },
  },
  mutations: {
    SET_ALL_CONFIGS(state, configs) {
      state.configs = configs;
    },
    SET_RESULTS_JSON(state, results) {
      state.resultsJson = results;
    },
    CLEAR_RESULTS_JSON(state) {
      state.resultsJson = null;
    },
    SHOW_NEW_CONFIG_DIALOG(state, newConfig = null) {
      state.newConfigBase = newConfig;
      state.showNewConfigDialog = true;
    },
    HIDE_NEW_CONFIG_DIALOG(state) {
      state.showNewConfigDialog = false;
    },
  },
  actions: {
    saveConfig(context, config) {
      superagent
        .post(process.env.VUE_APP_SERVER_URL + "/scrape")
        .send(config)
        .then(() => {
          context.dispatch("getAllConfigs");
        })
        .catch(console.error);
    },
    deleteConfig(context, config) {
      superagent
        .delete(
          process.env.VUE_APP_SERVER_URL +
            `/config/${config.parentKey}/${config.childKey}`
        )
        .then(() => {
          context.dispatch("getAllConfigs");
        })
        .catch(console.error);
    },
    getAllConfigs(context) {
      superagent
        .get(process.env.VUE_APP_SERVER_URL + "/all-configs")
        .then((results) => {
          context.commit("SET_ALL_CONFIGS", results.body);
        })
        .catch(console.error);
    },
    getTestConfigResults(context, config) {
      superagent
        .post(process.env.VUE_APP_SERVER_URL + "/test-scrape")
        .send(config)
        .then((results) => {
          context.commit("SET_RESULTS_JSON", results.body);
        })
        .catch(console.error);
    },
  },
});

export default store;
