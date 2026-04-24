import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, AlertTriangle, Thermometer, Loader2 } from 'lucide-react';
import API_BASE_URL from '../config/constants';
import './WeatherWidget.css';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/weather/current`);
            if (!response.ok) throw new Error('Failed to fetch weather');
            const data = await response.json();
            setWeather(data);
            setError(null);
        } catch (err) {
            console.error('Weather fetch error:', err);
            setError('Unable to load weather data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(fetchWeather, 5 * 60 * 1000); // 5 min
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="weather-widget loading">
                <Loader2 className="spinner icon" />
                <span>Loading weather...</span>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="weather-widget error">
                <Cloud className="icon" />
                <span>Weather data unavailable</span>
                <button onClick={fetchWeather} style={{marginLeft: 'auto', padding: '4px 8px', borderRadius: '4px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer'}}>Retry</button>
            </div>
        );
    }

    const aqiLabels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiColors = ['bg-green', 'bg-yellow', 'bg-orange', 'bg-red', 'bg-purple'];
    
    const aqiIndex = Math.max(0, Math.min(weather.aqi - 1, 4));
    const aqiLabel = aqiLabels[aqiIndex];
    const aqiColor = aqiColors[aqiIndex];

    const uvLabels = ['Low', 'Low', 'Moderate', 'Moderate', 'High', 'High', 'Very High', 'Very High', 'Extreme', 'Extreme', 'Extreme'];
    const uvColors = ['bg-green', 'bg-green', 'bg-yellow', 'bg-yellow', 'bg-orange', 'bg-orange', 'bg-red', 'bg-red', 'bg-purple', 'bg-purple', 'bg-purple'];
    
    const uvIndexNum = weather.uvIndex !== undefined ? Math.min(weather.uvIndex, 10) : 5;
    const uvLabel = uvLabels[uvIndexNum];
    const uvColor = uvColors[uvIndexNum];

    return (
        <div className="weather-widget container">
            <div className="bg-animation"></div>
            <div className="bg-animation delay"></div>

            <div className="content-relative">
                {/* Header */}
                <div className="header">
                    <div className="title-group">
                        <div className="icon-wrapper">
                            <Cloud className="icon white" />
                        </div>
                        <h3>Current Weather</h3>
                    </div>
                    <div className="location-badge">
                        <span>{weather.location}</span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="hero-section">
                    <div className="temp-group">
                        <div className="temp-icon-wrapper">
                            <Thermometer className="icon white large" />
                        </div>
                        <div>
                            <div className="temp-text">{weather.temperature}°C</div>
                            <div className="feels-like">Feels like: <strong>{weather.feelsLike}°C</strong></div>
                        </div>
                    </div>
                    <div className="icon-center">
                        {weather.icon && (
                            <img src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} alt={weather.description} className="weather-img" />
                        )}
                        <div className="description">{weather.description}</div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-header">
                            <Droplets className="icon small cyan" />
                            <span>Humidity</span>
                        </div>
                        <div className="metric-value">{weather.humidity}%</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <Wind className="icon small green" />
                            <span>Air Quality</span>
                        </div>
                        <div className={`metric-badge ${aqiColor}`}>{aqiLabel}</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <Thermometer className="icon small orange" />
                            <span>UV Index</span>
                        </div>
                        <div className={`metric-badge ${uvColor}`}>{weather.uvIndex} - {uvLabel}</div>
                    </div>
                    
                    <div className="metric-card">
                        <div className="metric-header">
                            <Wind className="icon small blue" />
                            <span>Wind</span>
                        </div>
                        <div className="metric-value">{weather.windSpeed !== undefined ? `${weather.windSpeed} km/h` : '--'}</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <Cloud className="icon small gray" />
                            <span>Visibility</span>
                        </div>
                        <div className="metric-value">{weather.visibility !== undefined ? `${weather.visibility} km` : '--'}</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-header">
                            <AlertTriangle className="icon small purple" />
                            <span>Pressure</span>
                        </div>
                        <div className="metric-value">{weather.pressure !== undefined ? `${weather.pressure} hPa` : '--'}</div>
                    </div>
                </div>

                {/* Warnings */}
                {weather.uvIndex !== undefined && weather.uvIndex >= 6 && (
                    <div className={`warning-box ${weather.uvIndex >= 8 ? 'bg-red-alert' : 'bg-orange-alert'}`}>
                        <AlertTriangle className="icon white flex-shrink" />
                        <div className="warning-text">
                            <strong>⚠️ UV Warning!</strong> Apply sunscreen and wear a hat.
                        </div>
                    </div>
                )}

                {(weather.temperature >= 35 || weather.feelsLike >= 35) && (
                    <div className="warning-box bg-orange-alert">
                        <AlertTriangle className="icon white flex-shrink" />
                        <div className="warning-text">
                            <strong>🔥 Heat Warning!</strong> Stay hydrated and limit outdoor activities.
                        </div>
                    </div>
                )}

                {/* Pollution Warning */}
                {weather.aqi >= 3 && (
                    <div className={`warning-box ${weather.aqi >= 4 ? 'bg-red-alert' : 'bg-orange-alert'}`}>
                        <AlertTriangle className="icon white flex-shrink" />
                        <div className="warning-text">
                            <strong>😷 Pollution Alert!</strong> Wear a mask when outdoors.
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="footer">
                    <div className="pulse-dot"></div>
                    {weather.cached && 'Cached •'} Updates every 5 min
                </div>
            </div>
        </div>
    );
}
