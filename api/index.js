import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
//const express = require("express");
//const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// YYYY-MM-DDにフォーマット
app.get("/formatDate", (req, res) => {
    const date = new Date(req.query.date);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    res.send(`${date.getFullYear()}-${month}-${day}`);
});

// 天気予報を取得
app.get("/getForecast", async (req, res) => {
    const openWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${req.query.lat}&lon=${req.query.lon}&units=metric&lang=ja&exclude=minutely,alerts,current&appid=e55dace96a6165e3793d081519253b8d`
    );

    // １週間の予報を取得
    let forecastWeek = {};
    const forecastWeekL = openWeather.data.daily.length;

    for (let i = 0; i < forecastWeekL; i++) {
        const dt = openWeather.data.daily[i].dt * 1000; // sからmsに変換
        const date = new Date(dt);
        const fDate = await axios.get(
            "http://localhost:3000/api/formatDate",
            {
                params: {
                    date: date,
                },
            }
        );

        const icon = openWeather.data.daily[i].weather[0].icon;
        const tempMin = openWeather.data.daily[i].temp.min;
        const tempMax = openWeather.data.daily[i].temp.max;

        forecastWeek[fDate.data] = {
            date: fDate.data,
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
        const fDate = await axios.get(
            "http://localhost:3000/api/formatDate",
            {
                params: {
                    date: date,
                },
            }
        );
        const hour = date.getHours();
        const icon = openWeather.data.hourly[i].weather[0].icon;
        const temp = openWeather.data.hourly[i].temp;
        forecastHour[fDate.data + "-" + hour] = {
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

module.exports = {
    path: "/api",
    handler: app
}