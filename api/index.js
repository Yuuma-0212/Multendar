import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
//const express = require("express");
//const bodyParser = require("body-parser");
const app = express();

// YYYY-MM-DDにフォーマット
const formatDate = (date) => {
    //const date = new Date(req.query.date);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const fDate = `${date.getFullYear()}-${month}-${day}`;
    return fDate;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/hello", (req, res) => {
    res.send("hello express");
})

// YYYY-MM-DDにフォーマット
/*
app.get("/formatDate", (req, res) => {
    const date = new Date(req.query.date);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    res.send(`${date.getFullYear()}-${month}-${day}`);
});
*/

// 天気予報を取得
app.get("/getForecast", async (req, res) => {
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${req.query.lat}&lon=${req.query.lon}&units=metric&lang=ja&exclude=minutely,alerts,current&appid=e55dace96a6165e3793d081519253b8d`;
    const openWeather = await axios.get(openWeatherUrl);

    // １週間の予報を取得
    let forecastWeek = {};
    const forecastWeekL = openWeather.data.daily.length;

    for (let i = 0; i < forecastWeekL; i++) {
        const dt = openWeather.data.daily[i].dt * 1000; // sからmsに変換
        const date = new Date(dt);
        const fDate = formatDate(date);
        /*
        const fDate = await axios.get(
            "http://localhost:3000/api/formatDate",
            {
                params: {
                    date: date,
                },
            }
        );
        */

        const icon = openWeather.data.daily[i].weather[0].icon;
        const tempMin = openWeather.data.daily[i].temp.min;
        const tempMax = openWeather.data.daily[i].temp.max;

        forecastWeek[fDate] = {
            date: fDate,
            icon: `/img/weather_icon/${icon}.png`,
            tempMin: tempMin,
            tempMax: tempMax,
        };
    }

    // ２日間の毎時予報を取得
    let forecastHour = {};
    const forecastHourL = openWeather.data.hourly.length;

    for (let i = 0; i < forecastHourL; i++) {
        const dt = openWeather.data.hourly[i].dt * 1000;
        const date = new Date(dt);
        const fDate = formatDate(date);
        /*
        const fDate = await axios.get(
            "http://localhost:3000/api/formatDate",
            {
                params: {
                    date: date,
                },
            }
        );
        */

        const hour = date.getHours();
        const icon = openWeather.data.hourly[i].weather[0].icon;
        const temp = openWeather.data.hourly[i].temp;
        forecastHour[fDate + "-" + hour] = {
            icon: `/img/weather_icon/${icon}.png`,
            temp: temp,
        };
    }

    const forecast = {
        week: forecastWeek,
        hour: forecastHour
    }

    res.send(forecast);
});

app.get("/getFirebaseEnv", (req, res) => {
    const firebaseConfig = {
        API_KEY: process.env.FIREBASE_API_KEY,
        AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        APP_ID: process.env.FIREBASE_APP_ID,
        MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    }

    res.send(firebaseConfig);
});

app.get("/getFirebaseAdminServiceAccount", (req, res) => {
    const serviceAccount = {
        type: process.env.FIREBASE_ADMIN_TYPE,
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
        token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL
    }

    res.send(serviceAccount);
});

app.get("/getVapidKey", (req, res) => {
    const vapidKey = process.env.FIREBASE_PUBLIC_VAPID_KEY;
    res.send(vapidKey);
});

app.get("/getGmapKey", (req, res) => {
    const mapsApiKey = process.env.GMAP_MAPS_API_KEY;
    res.send(mapsApiKey);
});

module.exports = {
    path: "/api",
    handler: app
}