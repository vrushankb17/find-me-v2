from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

@router.post("/message")
def chat_message(request: ChatRequest):
    """Returns a simple mock response for the chatbot"""
    user_msg = request.message.lower()
    
    response_text = "I'm a virtual medical assistant. For emergencies, please call 108 or find the nearest medical camp."
    
    if "emergency" in user_msg or "help" in user_msg:
        response_text = "🚨 Please call 108 immediately for medical emergencies. The nearest medical camp is Sector 4 Main Hospital."
    elif "hospital" in user_msg:
        response_text = "There are 3 main hospitals: Sector 4 (Main), Sector 12, and Sector 1. There are also smaller medical camps in every sector."
    elif "heat" in user_msg or "dizzy" in user_msg:
        response_text = "It sounds like you might be experiencing heat exhaustion. Please find shade immediately, drink water, and seek help from a nearby volunteer."
    elif "register" in user_msg or "enroll" in user_msg:
        response_text = "You can enroll a person by clicking 'Enroll Person' on the home dashboard. Make sure you have a clear photo of their face."
        
    return {"response": response_text}
