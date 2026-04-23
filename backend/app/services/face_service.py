import numpy as np
import base64
import cv2

# Load OpenCV's pre-trained Haar cascades for face detection
# Using the default XML provided in cv2
face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decodes a base64 encoded image string into an OpenCV image array."""
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    
    img_data = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def get_face_encoding(image_array: np.ndarray) -> np.ndarray:
    """
    Since complex DeepLearning packages (dlib, deepface, insightface) failed to install
    on this Windows env without Visual Studio Build Tools, we will use an OpenCV Haar Cascade 
    to validate a face exists, and extract a basic color histogram or shape as our 'encoding'.
    This is for PROTOTYPE PURPOSES.
    """
    # Convert to grayscale for face detection
    gray = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
    
    faces = face_classifier.detectMultiScale(
        gray, scaleFactor=1.05, minNeighbors=3, minSize=(20, 20)
    )
    
    if len(faces) == 0:
        raise ValueError("No face detected in the image.")
    if len(faces) > 1:
        raise ValueError("Multiple faces detected. Please ensure only one face is in the picture.")
        
    (x, y, w, h) = faces[0]
    
    # Extract the face region
    face_roi = image_array[y:y+h, x:x+w]
    
    # Create a 3D color histogram as our "encoding" signature
    # This is a basic approach and not true facial recognition but sufficient for testing flow
    hist = cv2.calcHist([face_roi], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    cv2.normalize(hist, hist)
    
    # Flatten into a 1D array
    return hist.flatten()

def compare_faces(known_encoding: np.ndarray, unknown_encoding: np.ndarray, tolerance: float = 0.5) -> bool:
    """Compares the histograms using Bhattacharyya distance."""
    # For cv2.compareHist using HISTCMP_BHATTACHARYYA, 0 means perfect match, 1 is total mismatch
    # If the distance is less than our tolerance, we consider it a match
    distance = cv2.compareHist(
        np.array(known_encoding, dtype=np.float32), 
        np.array(unknown_encoding, dtype=np.float32), 
        cv2.HISTCMP_BHATTACHARYYA
    )
    return distance < tolerance
