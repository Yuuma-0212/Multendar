import cookies from "js-cookie";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp, connectFirestoreEmulator } from "firebase/firestore";
import { firebase } from "~/plugins/firebase";

let db = null;
const collUsers = "users";

export default () => {
    firebase().then(() => {
        db = getFirestore();
    });
}

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
        timestamp: serverTimestamp(),
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
})

export const getFcmToken = (async (uid) => {
    console.log("uid", uid);
    const userRef = doc(db, collUsers, uid);
    const userSnap = await getDoc(userRef);
    console.log('getFcmToken', userSnap.data().fcmToken.token);
    
    if (userSnap.exists()) {
        return userSnap.data().fcmToken.token;
    }
})

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