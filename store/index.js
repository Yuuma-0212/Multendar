export const strict = false;    // falseにしないとstateのeventsにpushできない？
import Cookie from "cookie";
import { httpsCallable } from 'firebase/functions';
import { firebase } from "~/plugins/firebase";
import { getEvents } from "~/plugins/firebase-firestore";

export const state = () => ({
    idToken: null,
    uid: null,
    selectedArea: {},
    events: [],
    isLogin: false
});

export const mutations = {
    setUid(state, uid) {
        state.uid = uid;
    },

    setToken(state, idToken) {
        state.idToken = idToken;
    },

    setEvents(state, events) {
        state.events.splice(0);
        events.forEach(event => {
            state.events.push(event);
        });
    },

    setSelectedArea(state, selectedArea) {
        state.selectedArea = selectedArea;
    },

    setIsLogin(state, isLogin) {
        state.isLogin = isLogin;
    }
}

export const actions = {
    async nuxtServerInit({ state, dispatch }, { app, req, res, redirect }) {
        let selectedArea = {};

        // クッキーからデータを取得してストアに保持
        if (req.headers.cookie) {
            const cookie = Cookie.parse(req.headers.cookie);
            if (cookie.selectedArea != undefined) {
                selectedArea = JSON.parse(cookie.selectedArea);
            }
            const auth = {
                uid: cookie.uid,
                idToken: cookie.idToken,
            }

            await firebase().then(async (services) => {
                const functions = services.functions;
                //const getEvents = httpsCallable(functions, "getEvents");

                await getEvents(auth.uid).then((events) => {
                    if (events != undefined) dispatch("setEvents", events);
                }).catch((error) => {
                    console.log("getEvents Error", error);
                });
            });

            if (auth.idToken) {
                dispatch("setToken", auth.idToken);
                dispatch("setUid", auth.uid);
            }
        }

        // ログイン済みの場合は/calendarへリダイレクト
        if (state.idToken) {
            const isLogin = true;
            dispatch("setIsLogin", isLogin);
            dispatch("setSelectedArea", selectedArea);
            redirect("/calendar");
        } else {
            redirect("/");
        }
    },

    setToken({ commit }, idToken) {
        commit("setToken", idToken);
    },

    setUid({ commit }, uid) {
        commit("setUid", uid);
    },

    setEvents({ commit }, events) {
        commit("setEvents", events);
    },

    setSelectedArea({ commit }, selectedArea) {
        commit("setSelectedArea", selectedArea);
    },

    setIsLogin({ commit }, isLogin) {
        commit("setIsLogin", isLogin);
    }
}

export const getters = {
    getUid(state) {
        return state.uid;
    },

    getIdToken(state) {
        return state.idToken;
    },

    getEvents(state) {
        return state.events;
    },

    getSelectedArea(state) {
        return state.selectedArea;
    },

    getIsLogin(state) {
        return state.isLogin;
    }
}