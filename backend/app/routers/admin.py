from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import AdminCreate, AdminLogin, AdminResponse
from ..database import get_db
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=AdminResponse)
async def register_admin(admin: AdminCreate):
    db = get_db()
    
    # Check if admin already exists
    existing_admin = await db.admins.find_one({"username": admin.username})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin username already registered")
        
    admin_doc = {
        "username": admin.username,
        "password": admin.password # In production, this should be hashed
    }
    
    result = await db.admins.insert_one(admin_doc)
    
    return AdminResponse(
        id=str(result.inserted_id),
        username=admin.username
    )

@router.post("/login")
async def login_admin(admin: AdminLogin):
    db = get_db()
    
    admin_doc = await db.admins.find_one({"username": admin.username})
    if not admin_doc:
        raise HTTPException(status_code=401, detail="Invalid username or password")
        
    if admin_doc["password"] != admin.password: # In production, verify hash
        raise HTTPException(status_code=401, detail="Invalid username or password")
        
    return {
        "message": "Login successful",
        "username": admin_doc["username"]
    }
