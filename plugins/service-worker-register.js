// fcmのswを登録する
export let swReg = null;

export default (async () => {
    if ("serviceWorker" in navigator) {
        const sw = await navigator.serviceWorker
            .register("../static/sw.js")
            .then(function (registration) {
                console.log("Registration successful, scope is:", registration.scope);
                return registration;
            })
            .catch(function (error) {
                console.log("Service worker registration failed, error:", error);
            });

        swReg = sw;
    }
});