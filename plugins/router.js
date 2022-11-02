import vue from "vue";
import router from "vue-router";
import store from "~/store";

vue.use(router);

const foo = {
    beforeRouteLeave(to, from, next) {
        console.log("to => " + to.path + "from => " + from.path);
        next();
    }
}