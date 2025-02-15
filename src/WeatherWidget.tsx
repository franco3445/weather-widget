import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { fetchWeatherApi } from 'openmeteo';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import './index.css';

export default function WeatherWidget () {
    const [currentData, setCurrentData] = React.useState({});
    const [hourlyData, setHourlyData] = React.useState([]);

    const getWeatherData = React.useCallback(async () => {
        console.log('Getting WeatherData');
        const params = {
            "latitude": 30,
            "longitude": -90,
            "current": ["temperature_2m", "wind_speed_10m"],
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m"]
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);


        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();

        const current = response.current()!;
        const hourly = response.hourly()!;

        const weatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0)!.value(),
                windSpeed10m: current.variables(1)!.value(),
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
                windSpeed10m: hourly.variables(2)!.valuesArray()!,
            },
        };

        setCurrentData(
            weatherData.current
        )

        setHourlyData(
            weatherData.hourly.time.map((time, index) => ({
                time: new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                temperature: weatherData.hourly.temperature2m[index],
                windSpeed: weatherData.hourly.windSpeed10m[index],
            }))
        );
    },[]);

    React.useEffect(() => {
        const weatherData = getWeatherData();
    }, [
        getWeatherData,
    ]);

    return (
        <Card className="p-4 max-w-sm mx-auto">
            <CardContent>
                <h2 className="text-xl font-bold text-center">Current Weather</h2>
                <p className="text-center text-lg">{new Date(currentData.time).toLocaleString()}</p>
                <div className="flex justify-between mt-4">
                    <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-lg font-semibold">{currentData.temperature2m}°C</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Wind Speed</p>
                        <p className="text-lg font-semibold">{currentData.windSpeed10m} m/s</p>
                    </div>
                </div>
                <h3 className="text-md font-semibold mt-6">Hourly Forecast</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={hourlyData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={2} />
                        <Line type="monotone" dataKey="windSpeed" stroke="#0088FE" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
