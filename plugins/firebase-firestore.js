import cookies from "js-cookie";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "~/plugins/firebase";

const collUsers = "users";

export const checkUserExists = (async (uid) => {
    const docRef = doc(db, collUsers, uid);
    const userExists = await getDoc(docRef).then((userSnap) => {
        return userSnap.exists();
    });

    return userExists;
});

export const addUser = ((user, idToken) => {
    const userRef = doc(db, collUsers, user.uid);
    const userData = {
        name: user.displayName,
        email: user.email,
        idToken: idToken,
        createAt: serverTimestamp(),
    }
    setDoc(userRef, userData).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const addEvent = (async (event) => {
    const uid = cookies.get("uid");
    const userRef = doc(db, collUsers, uid);
    const eventData = {
        events: arrayUnion(event),
        timestamp: serverTimestamp()
    }

    await updateDoc(userRef, eventData).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const getEvents = (async (uid) => {
    const userRef = doc(db, collUsers, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return userSnap.data().events;
    }
});

export const setFcmToken = (async (fcmToken) => {
    const uid = cookies.get("uid");
    const userRef = doc(db, collUsers, uid);
    console.log("setFcmToken", fcmToken);

    await updateDoc(userRef, {
        fcmToken: {
            token: fcmToken,
            timestamp: serverTimestamp()
        }
    }).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const getFcmToken = (async (uid) => {
    console.log("uid", uid);
    const userRef = doc(db, collUsers, uid);
    const userSnap = await getDoc(userRef);
    console.log('getFcmToken', userSnap.data().fcmToken.token);

    if (userSnap.exists()) {
        return userSnap.data().fcmToken.token;
    }
});

export const setTest = (() => {
    const uid = cookies.get("uid");
    const userRef = doc(db, collUsers, uid);

    updateDoc(userRef, {
        BeforeUnload: true
    });
});