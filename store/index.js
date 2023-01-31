export const strict = false; // falseにしないとstateのeventsにpushできない？
import Cookie from "cookie";

export const state = () => ({
  idToken: "",
  uid: "",
  fcmToken: "",
  selectedArea: {},
  events: [],
  isLogin: false,
});

export const mutations = {
  setUid(state, uid) {
    state.uid = uid;
  },

  setIdToken(state, idToken) {
    state.idToken = idToken;
  },

  setFcmToken(state, fcmToken) {
    state.fcmToken = fcmToken;
  },

  setEvents(state, events) {
    state.events.splice(0);
    events.forEach((event) => {
      state.events.push(event);
    });
  },

  setSelectedArea(state, selectedArea) {
    state.selectedArea = selectedArea;
  },

  setIsLogin(state, isLogin) {
    state.isLogin = isLogin;
  },
};

export const actions = {
  async nuxtServerInit({ state, dispatch }, { app, req, res, redirect }) {
    let selectedArea = {};
    let cookie = null;

    // クッキーからデータを取得してストアに保持
    if (req.headers.cookie) {
      cookie = Cookie.parse(req.headers.cookie);
      if (cookie.selectedArea != undefined) {
        selectedArea = JSON.parse(cookie.selectedArea);
      }
      const auth = {
        uid: cookie.uid,
        idToken: cookie.idToken,
      };
      
      if (auth.idToken) {
        dispatch("setIdToken", auth.idToken);
        dispatch("setUid", auth.uid);
      }
    }

    // ログイン済みの場合は/calendarへリダイレクト
    if (cookie != null && cookie.isLogin) {
      dispatch("setSelectedArea", selectedArea);
      redirect("/calendar");
    } else {
      redirect("/");
    }
  },

  setIdToken({ commit }, idToken) {
    commit("setIdToken", idToken);
  },

  setUid({ commit }, uid) {
    commit("setUid", uid);
  },

  setFcmToken({ commit }, fcmToken) {
    commit("setFcmToken", fcmToken);
  },

  setEvents({ commit }, events) {
    commit("setEvents", events);
  },

  setSelectedArea({ commit }, selectedArea) {
    commit("setSelectedArea", selectedArea);
  },

  setIsLogin({ commit }, isLogin) {
    commit("setIsLogin", isLogin);
  },
};

export const getters = {
  getUid(state) {
    return state.uid;
  },

  getIdToken(state) {
    return state.idToken;
  },

  getFcmToken(state) {
    return state.fcmToken;
  },

  getEvents(state) {
    return state.events;
  },

  getSelectedArea(state) {
    return state.selectedArea;
  },

  getIsLogin(state) {
    return state.isLogin;
  },
};
