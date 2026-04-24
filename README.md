# FindMe 🔍

**AI-Powered Person Identification System for Large Scale Events**

FindMe is a full-stack application built for large-scale events like Kumbh Mela, enabling real-time face-based person identification, registration, live case tracking, a weather widget, and an AI medical chatbot assistant.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | FastAPI (Python) |
| Database | MongoDB (local) |
| Face Detection | DeepFace / OpenCV |
| Styling | Vanilla CSS + Framer Motion |

---

## 📁 Project Structure

```
findme/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py        # App entrypoint, CORS, routers
│   │   ├── database.py    # MongoDB connection
│   │   ├── models/        # Pydantic models
│   │   └── routers/
│   │       ├── users.py   # User registration & management
│   │       ├── detect.py  # Face detection endpoint
│   │       ├── admin.py   # Admin auth
│   │       ├── weather.py # Weather data endpoint
│   │       └── chatbot.py # AI chatbot endpoint
│   └── requirements.txt
│
└── frontend/              # React frontend
    ├── public/
    └── src/
        ├── App.js         # Main app with routing
        ├── App.css        # Global styles
        ├── config/
        │   └── constants.js  # API base URL
        ├── components/
        │   ├── WeatherWidget.js   # Live weather card
        │   ├── ChatBot.js         # Floating AI chatbot
        │   ├── IndiaMap.js        # Live case map
        │   └── LiveTicker.js      # Real-time event feed
        └── pages/
            ├── CustomerRegister.js
            ├── AdminLogin.js
            └── AdminDashboard.js
```

---

## ⚙️ Prerequisites

Make sure you have the following installed before starting:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally on port `27017`)
- `pip` and `venv` (included with Python)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vrushankb17/find-me-v2.git
cd find-me-v2
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

The backend will run at: **http://localhost:8000**

> ✅ Make sure MongoDB is running locally at `mongodb://localhost:27017` before starting the backend.

---

### 3. Frontend Setup

Open a **new terminal** in the project root:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run at: **http://localhost:3000**

---

## 🖥️ Accessing the App

| URL | Description |
|---|---|
| `http://localhost:3000` | Main customer-facing dashboard |
| `http://localhost:3000/admin` | Admin login page (opens in new tab) |
| `http://localhost:8000/docs` | FastAPI Swagger API documentation |

---

## ✨ Features

- **Person Enrollment** — Register individuals with face photos and personal details
- **Live Face Detection** — Real-time webcam-based identification via camera feed
- **Kumbh Mela Statistics** — Live case counts and charts (missing vs reunited)
- **India Map** — Visual representation of case locations
- **Live Ticker** — Real-time event feed
- **🌤️ Weather Widget** — Environmental data (temperature, UV index, AQI, heat/pollution alerts)
- **🤖 AI Chatbot** — Floating medical assistant for emergency guidance and FAQs
- **Admin Dashboard** — Secure admin panel to manage users and monitor detections

---

## 🔧 Environment Variables (Optional)

If you want to connect the frontend to a remote backend, create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://your-backend-url/api
```

By default, the frontend connects to `http://localhost:8000/api`.

---

## 📜 License

This project is for educational and demonstration purposes.
