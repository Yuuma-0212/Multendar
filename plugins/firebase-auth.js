import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth";
import { addUser, checkUserExists } from "~/plugins/firebase-firestore";
import { firebase } from "~/plugins/firebase";

let auth = null;

export default async () => {
    return await firebase().then((services) => {
        console.log("services auth", services.auth);
        auth = services.auth;
    });
}

export const login = () => {
    const provider = new GoogleAuthProvider();
    const signInResult = signInWithPopup(auth, provider)
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

            await checkUserExists(user.uid).then((isUserExists) => {
                if (!isUserExists) {
                    addUser(result.user, user.idToken).then(() => {
                        return;
                    }).catch((error) => {
                        throw new Error(error);
                    });
                }
            });

            return user;
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            throw new Error(error);
        });

    return signInResult;
}

export const logout = async () => {
    const logoutResult = await signOut(auth).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });

    return logoutResult;
}
