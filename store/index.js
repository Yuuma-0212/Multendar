export const strict = false;    // falseにしないとstateのeventsにpushできない？
import Cookie from "cookie";
import { getEvents, hoge } from "~/plugins/firebase";

export const state = () => ({
    idToken: null,
    uid: null,
    selectedArea: null,
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
        let selectedArea = ""; 
        // クッキーからデータを取得してストアに保持
        if (req.headers.cookie) {
            const cookie = Cookie.parse(req.headers.cookie);
            //const vuex = JSON.parse(cookie.vuex);
            selectedArea = cookie.selectedArea;
            const vuex = {
                uid: cookie.uid,
                idToken: cookie.idToken,
            }

            await getEvents({ uid: vuex.uid }).then((result) => {
                // イベント取得
                if (result.data._fieldsProto.events === undefined) return;
                const events = result.data._fieldsProto.events.arrayValue.values.map((value) => {
                    return JSON.parse(value.stringValue);
                });

                dispatch("setEvents", events);
            }).catch((error) => {
                console.log(error);
            });

            if (vuex.idToken) {
                dispatch("setToken", vuex.idToken);
                dispatch("setUid", vuex.uid);
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