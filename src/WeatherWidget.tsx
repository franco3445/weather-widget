import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeatherWidget () {
    const [currentData, setCurrentData] = React.useState({});
    const [hourlyData, setHourlyData] = React.useState([]);

    const getWeatherData = React.useCallback(async () => {
        console.log('Getting WeatherData');

        const data = {
            "current": {
                "time": "2022-01-01T15:00",
                "temperature_2m": 2.4,
                "wind_speed_10m": 11.9,
            },
            "hourly": {
                "time": ["2022-07-01T00:00","2022-07-01T01:00"],
                "wind_speed_10m": [3.16,3.02,3.3,3.14,3.2,2.95],
                "temperature_2m": [13.7,13.3,12.8,12.3,11.8],
                "relative_humidity_2m": [82,83,86,85,88,88,84,76],
            }
        };
        setCurrentData(
            data.current
        )

        setHourlyData(
            data.hourly.time.map((time, index) => ({
                time: new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                temperature: data.hourly.temperature_2m[index],
                windSpeed: data.hourly.wind_speed_10m[index],
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
                        <p className="text-lg font-semibold">{currentData.temperature_2m}°C</p>
                        <p className="text-sm text-gray-600">Temperature</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{currentData.wind_speed_10m} m/s</p>
                        <p className="text-sm text-gray-600">Wind Speed</p>
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
