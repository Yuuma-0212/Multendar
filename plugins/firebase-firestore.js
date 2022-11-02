import cookie from "js-cookie";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "~/plugins/firebase";

export const checkUserDataExists = (async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("user exists");
        return true;
    }
    return false;
});

export const addUser = ((user, idToken) => {
    return new Promise((resolve, reject) => {
        try {
            const userData = {
                name: user.displayName,
                email: user.email,
                idToken: idToken,
                timestamp: serverTimestamp(),
            }
            const docRef = setDoc(doc(db, "users", user.uid), userData);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
});

export const updateEvent = (async (event) => {
    const user = JSON.parse(cookie.get("vuex"));
    const uid = user.uid;
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        events: arrayUnion(JSON.stringify(event)),
        timestamp: serverTimestamp()
    }).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const getEvent = (async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().events;
    }
});

export const eventExists = (async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().events === !undefined) {
        return true;
    }
    return false;
})