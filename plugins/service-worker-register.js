// fcmのswを登録する
export default async () => {
  if ("serviceWorker" in navigator) {
    return await navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("Registration successful, scope is:", registration.scope);
        return registration;
      })
      .catch(function (error) {
        console.log("Service worker registration failed, error:", error);
      });
  }
};
