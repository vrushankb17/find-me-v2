from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import DetectionCreate, DetectionResponse
from ..services.face_service import decode_base64_image, get_face_encoding, compare_faces
from ..database import get_db
import numpy as np
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/camera-upload", status_code=201)
async def mock_camera_detection(detect_data: DetectionCreate):
    """
    Mock endpoint simulating a camera spotting someone and sending a picture.
    If a known face is found, it logs it in the detections collection.
    """
    db = get_db()
    
    try:
        img_array = decode_base64_image(detect_data.photo)
        unknown_encoding = get_face_encoding(img_array)
    except ValueError as e:
        # If no face is in the picture, it just ignores. In a real camera feed, many frames won't have faces.
        return {"message": f"Camera {detect_data.camera_id} - Skipped: {str(e)}"}
    
    # Fetch all known users (In real life, you'd use a faster index or caching mechanism like Annoy or FAISS)
    users = await db.users.find().to_list(1000)
    
    match_found = None
    
    for user in users:
        # Load user's average face encoding from the database
        known_encoding = np.array(user["face_encoding"])
        
        # We compare the faces with our strict 0.6 tolerance
        is_match = compare_faces(known_encoding, unknown_encoding)
        if is_match:
            match_found = user
            break
            
    if match_found:
        detection_log = {
            "user_id": str(match_found["_id"]),
            "camera_id": detect_data.camera_id,
            "location": detect_data.location,
            "timestamp": datetime.utcnow()
        }
        await db.detections.insert_one(detection_log)
        return {"matched": True, "emp_id": match_found["emp_id"]}
        
    return {"matched": False}

@router.get("/find/{emp_id}")
async def find_user_by_emp_id(emp_id: str):
    """
    Admin Endpoint: Search for a user's latest detections to see their last known location.
    """
    db = get_db()
    
    user = await db.users.find_one({"emp_id": emp_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_id_str = str(user["_id"])
    
    # Sort detections by latest timestamp
    latest_detections = await db.detections.find({"user_id": user_id_str}).sort("timestamp", -1).to_list(10)
    
    # Format response
    formatted_logs = []
    for d in latest_detections:
        d["id"] = str(d.pop("_id"))
        formatted_logs.append(d)
        
    return {
        "user": {
            "name": user["name"],
            "emp_id": user["emp_id"],
            "gender": user["gender"]
        },
        "last_known_locations": formatted_logs
    }
