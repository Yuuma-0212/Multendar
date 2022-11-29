import cookie from "js-cookie";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
//import { db, callCheckUserExists, callAddUser, callAddEvent, callGetEvents } from "~/plugins/firebase";
import { firebase } from "~/plugins/firebase";

let db = null;
const queryDocUsers = "users";

firebase().then(() => {
    db = getFirestore();
})


export const checkUserExists = (async (uid) => {
    const docRef = doc(db, queryDocUsers, uid);
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
            const docRef = setDoc(doc(db, queryDocUsers, user.uid), userData);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
});

export const addEvent = (async (event) => {
    const uid = cookie.get("uid");
    const userRef = doc(db, queryDocUsers, uid);

    await updateDoc(userRef, {
        events: arrayUnion(JSON.stringify(event)),
        timestamp: serverTimestamp()
    }).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const getEvents = (async (uid) => {
    const userRef = doc(db, queryDocUsers, uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().events;
    }
});

/*
export const checkUserExists = ((uid) => {
    const isUserExists = callCheckUserExists(uid).then((res) => {
        const resIsUserExists = res.data;
        if (resIsUserExists) return true;
        return false;
    });

    return isUserExists;
});

export const addUser = (async (user, idToken) => {
    const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        idToken: idToken,
    }

    await callAddUser(userData);
});

export const addEvent = (async (event) => {
    const data = {
        uid: cookie.get("uid"),
        event: event
    }

    await callAddEvent(data).then(() => {
        return;
    }).catch((error) => {
        throw new Error(error);
    });
});

export const getEvents = ((uid) => {
    const events = callGetEvents(uid).then((events) => {
        const eventCount = events.length;

        if (eventCount == undefined) return;

        // イベント取得
        const formatEvents = events.data.map((event) => {
            return JSON.parse(event);
        });

        return formatEvents;
    }).catch((error) => {
        throw new Error(error);
    });
    
    return events;
});

export const eventExists = (async (uid) => {
    const userRef = doc(db, "users", uid);

    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().events === !undefined) {
        return true;
    }   
    
    return false;
})
*/