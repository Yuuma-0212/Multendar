import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth";
import { addUser, checkUserDataExists } from "~/plugins/firebase-firestore";
import { hoge } from "~/plugins/firebase";
import axios from "axios";

export const login = () => {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                //const credential = GoogleAuthProvider.credentialFromResult(result);
                //const token = credential.accessToken;

                let user = null;

                await result.user.getIdToken(true)
                    .then(async (idToken) => {
                        user = {
                            uid: result.user.uid,
                            idToken: idToken
                        }
                    });

                checkUserDataExists(user.uid).then((existsData) => {
                    if (!existsData) {
                        addUser(result.user, user.idToken);
                    }
                });

                resolve(user);
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                reject(error);
            });
    });
}

export const logout = async () => {
    const auth = getAuth();
    await signOut(auth).then(() => {
        return;
    }).catch((error) => {
        return "エラー: " + error;
    });
}
