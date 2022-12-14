import { writeFileSync } from "fs";

const path = "./static/sw-env.js";
const data = `
        const swEnv = {
            messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}'
        }
    `;

writeFileSync(path, data);