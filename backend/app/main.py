from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users, detect, admin

from .database import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Find Me Backend", version="1.0.0")

@app.on_event("startup")
async def startup_db_client():
    connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    close_mongo_connection()

# Configure CORS for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(detect.router, prefix="/api/detect", tags=["Detection"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Find Me API"}
