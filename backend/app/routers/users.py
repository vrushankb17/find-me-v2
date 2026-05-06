from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models.schemas import UserCreate, UserUpdate, UserResponse
from ..services.face_service import decode_base64_image, get_face_encoding
from ..database import get_db
import numpy as np
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    db = get_db()
    
    # Validation step: Process all 3 photos.
    encodings = []
    try:
        for idx, b64_photo in enumerate(user.photos):
            img_array = decode_base64_image(b64_photo)
            encoding = get_face_encoding(img_array)
            encodings.append(encoding.tolist())  # Store as simple list for MongoDB
    except ValueError as e:
        # e.g., "No face detected" or "Multiple faces detected"
        raise HTTPException(status_code=400, detail=f"Image {idx+1} Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image {idx+1}: {str(e)}")
        
    # Calculate the average encoding for robustness across the 3 photos
    avg_encoding = np.mean(encodings, axis=0).tolist()
    
    user_doc = {
        "emp_id": user.emp_id,
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "city": user.city,
        "phone": user.phone,
        "aadhar_number": user.aadhar_number,
        "emergency_contact_name": user.emergency_contact_name,
        "emergency_contact_phone": user.emergency_contact_phone,
        "blood_group": user.blood_group,
        "height_cm": user.height_cm,
        "weight_kg": user.weight_kg,
        "allergies": user.allergies,
        "chronic_conditions": user.chronic_conditions,
        "current_medications": user.current_medications,
        "past_surgeries": user.past_surgeries,
        "face_encoding": avg_encoding,
        "all_encodings": encodings
    }
    
    result = await db.users.insert_one(user_doc)
    
    return UserResponse(
        id=str(result.inserted_id),
        emp_id=user.emp_id,
        name=user.name,
        age=user.age,
        gender=user.gender,
        city=user.city,
        phone=user.phone,
        aadhar_number=user.aadhar_number,
        emergency_contact_name=user.emergency_contact_name,
        emergency_contact_phone=user.emergency_contact_phone,
        blood_group=user.blood_group,
        height_cm=user.height_cm,
        weight_kg=user.weight_kg,
        allergies=user.allergies,
        chronic_conditions=user.chronic_conditions,
        current_medications=user.current_medications,
        past_surgeries=user.past_surgeries
    )

@router.get("/", response_model=List[UserResponse])
async def get_all_users():
    db = get_db()
    cursor = db.users.find({}, {"face_encoding": 0, "all_encodings": 0})
    users = await cursor.to_list(length=1000)
    
    result = []
    for user_doc in users:
        result.append(UserResponse(
            id=str(user_doc["_id"]),
            emp_id=user_doc.get("emp_id", "N/A"),
            name=user_doc.get("name", "Unknown"),
            age=user_doc.get("age", 0),
            gender=user_doc.get("gender", "Unknown"),
            city=user_doc.get("city", "Unknown"),
            phone=user_doc.get("phone", "Unknown"),
            aadhar_number=user_doc.get("aadhar_number", "N/A"),
            emergency_contact_name=user_doc.get("emergency_contact_name"),
            emergency_contact_phone=user_doc.get("emergency_contact_phone"),
            blood_group=user_doc.get("blood_group"),
            height_cm=user_doc.get("height_cm"),
            weight_kg=user_doc.get("weight_kg"),
            allergies=user_doc.get("allergies"),
            chronic_conditions=user_doc.get("chronic_conditions"),
            current_medications=user_doc.get("current_medications"),
            past_surgeries=user_doc.get("past_surgeries")
        ))
    return result

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    # Using UserCreate for now, or we can use a specific UserUpdate schema
    db = get_db()
    
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    # We won't update photos/encodings in this basic update
    update_data = {
        "emp_id": user_update.emp_id,
        "name": user_update.name,
        "age": user_update.age,
        "gender": user_update.gender,
        "city": user_update.city,
        "phone": user_update.phone,
        "aadhar_number": user_update.aadhar_number,
        "emergency_contact_name": user_update.emergency_contact_name,
        "emergency_contact_phone": user_update.emergency_contact_phone,
        "blood_group": user_update.blood_group,
        "height_cm": user_update.height_cm,
        "weight_kg": user_update.weight_kg,
        "allergies": user_update.allergies,
        "chronic_conditions": user_update.chronic_conditions,
        "current_medications": user_update.current_medications,
        "past_surgeries": user_update.past_surgeries
    }
    
    # Remove None values so we don't overwrite with null unless intended (basic implementation)
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    result = await db.users.update_one(
        {"_id": obj_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    updated_user = await db.users.find_one({"_id": obj_id})
    
    return UserResponse(
        id=str(updated_user["_id"]),
        emp_id=updated_user.get("emp_id", "N/A"),
        name=updated_user.get("name", "Unknown"),
        age=updated_user.get("age", 0),
        gender=updated_user.get("gender", "Unknown"),
        city=updated_user.get("city", "Unknown"),
        phone=updated_user.get("phone", "Unknown"),
        aadhar_number=updated_user.get("aadhar_number", "N/A"),
        emergency_contact_name=updated_user.get("emergency_contact_name"),
        emergency_contact_phone=updated_user.get("emergency_contact_phone"),
        blood_group=updated_user.get("blood_group"),
        height_cm=updated_user.get("height_cm"),
        weight_kg=updated_user.get("weight_kg"),
        allergies=updated_user.get("allergies"),
        chronic_conditions=updated_user.get("chronic_conditions"),
        current_medications=updated_user.get("current_medications"),
        past_surgeries=updated_user.get("past_surgeries")
    )

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    db = get_db()
    
    try:
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    result = await db.users.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Also delete associated detections
    await db.detections.delete_many({"user_id": user_id})
        
    return {"message": "User and associated detections deleted successfully"}
