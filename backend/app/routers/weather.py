from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/current")
def get_current_weather():
    """Returns mock weather data for Kumbh Mela"""
    return {
        "temperature": random.randint(32, 40),
        "feelsLike": random.randint(34, 45),
        "humidity": random.randint(40, 80),
        "pressure": 1012,
        "description": "sunny with haze",
        "icon": "01d",
        "windSpeed": random.randint(5, 15),
        "windDeg": 180,
        "visibility": 5,
        "clouds": 10,
        "uvIndex": random.randint(6, 11),
        "aqi": random.randint(2, 5),
        "location": "Prayagraj Kumbh Mela",
        "cached": True
    }
