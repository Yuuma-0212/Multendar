import createPersistedState from "vuex-persistedstate";
import * as cookie from "js-cookie";

export default ({ store }) => {
    createPersistedState({
        storage: {
            getItem: (key) => cookie.get(key),
            // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
            setItem: (key, value) => 
                cookie.set(key, value, { expires: 3, secure: false }),
            removeItem: (key) => cookie.remove(key),
        },
        paths: ["idToken", "uid", "selectedArea"]
    })(store);
}