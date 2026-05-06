from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    age: int
    gender: str
    city: str
    phone: str
    aadhar_number: str = Field(..., min_length=12, max_length=12, description="12-digit Aadhar Card Number")
    
    # New medical and emergency fields
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    blood_group: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    current_medications: Optional[str] = None
    past_surgeries: Optional[str] = None

    # These will be base64 encoded strings
    photos: List[str] = Field(..., min_length=3, max_length=3, description="List of 3 base64 encoded images")
    emp_id: Optional[str] = Field(default=None, description="Auto-generated Employee ID or unique identifier")

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    aadhar_number: Optional[str] = Field(default=None, min_length=12, max_length=12)
    emp_id: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    blood_group: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    current_medications: Optional[str] = None
    past_surgeries: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    emp_id: str
    name: str
    age: int
    gender: str
    city: str
    phone: str
    aadhar_number: str
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    blood_group: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    current_medications: Optional[str] = None
    past_surgeries: Optional[str] = None

class DetectionCreate(BaseModel):
    camera_id: str
    location: str
    photo: str = Field(..., description="Base64 encoded image captured by the camera")

class DetectionResponse(BaseModel):
    id: str
    user_id: str
    camera_id: str
    location: str
    timestamp: datetime

class AdminCreate(BaseModel):
    username: str
    password: str

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
