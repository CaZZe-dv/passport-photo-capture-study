from fastapi import FastAPI
from pydantic import BaseModel
import base64
import numpy as np
import cv2
from mediapipe import solutions

#Initialize FastAPI application (REST API entry point)
app = FastAPI()

#Initialize MediaPipe FaceMesh model for facial landmark detection
mp_face = solutions.face_mesh
face_mesh = mp_face.FaceMesh(
    static_image_mode=True,          #optimized for single images instead of video stream
    refine_landmarks=False,          #no additional refinement (faster processing)
    max_num_faces=1,                 #only one face expected (passport scenario)
    min_detection_confidence=0.5     #minimum confidence threshold for detection
)

#Data model for incoming request (Base64 encoded image)
class ImageData(BaseModel):
    image: str


#Decode Base64 image string into OpenCV format
def decode_image(base64_string):
    try:
        img_bytes = base64.b64decode(base64_string)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        #Return None if decoding fails (invalid input)
        return None


#Compute overall image brightness (mean grayscale intensity)
def compute_brightness(gray):
    return float(np.mean(gray))


#Compute face bounding box from normalized landmark coordinates
def compute_face_bbox(landmarks, w, h):

    xs = [lm.x for lm in landmarks]
    ys = [lm.y for lm in landmarks]

    #Clamp values between 0 and 1 (normalized coordinates)
    x_min = max(0.0, min(1.0, min(xs)))
    x_max = max(0.0, min(1.0, max(xs)))
    y_min = max(0.0, min(1.0, min(ys)))
    y_max = max(0.0, min(1.0, max(ys)))

    #Convert normalized values to pixel coordinates
    face_x = int(x_min * w)
    face_y = int(y_min * h)
    face_w = int((x_max - x_min) * w)
    face_h = int((y_max - y_min) * h)

    return x_min, y_min, x_max, y_max, face_x, face_y, face_w, face_h


#Compute brightness only within detected face region
def compute_face_brightness(gray, face_x, face_y, face_w, face_h):

    face_region = gray[face_y:face_y + face_h, face_x:face_x + face_w]

    if face_region.size > 0:
        return float(np.mean(face_region))

    #Return 0 if region is invalid
    return 0.0


#Compute brightness of the background (excluding face area)
def compute_background_brightness(gray, face_x, face_y, face_w, face_h, w, h):

    #Create mask for background extraction
    mask = np.ones(gray.shape, dtype=np.uint8)

    padding = int(face_w * 0.2)  #add padding around face to avoid edge influence

    x1 = max(0, face_x - padding)
    y1 = max(0, face_y - padding)
    x2 = min(w, face_x + face_w + padding)
    y2 = min(h, face_y + face_h + padding)

    #Mask out the face region
    cv2.rectangle(mask, (x1, y1), (x2, y2), 0, -1)

    background_pixels = gray[mask == 1]

    if background_pixels.size > 0:
        return float(np.mean(background_pixels))

    return 0.0


#Check whether the background fulfills passport photo requirements
def check_passport_background(img, face_x, face_y, face_w, face_h):

    h, w = img.shape[:2]

    #Convert to HSV for color/saturation analysis
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #Define sampling patch size and margins
    patch = int(min(w, h) * 0.06)
    margin = int(min(w, h) * 0.02)

    #Sampling regions (avoid lower part of image -> body/clothes)
    regions = [
        (margin, margin),                        # top left
        (w//2 - patch//2, margin),               # top center
        (w - patch - margin, margin),            # top right
        (margin, h//4 - patch//2),               # upper left
        (w - patch - margin, h//4 - patch//2),   # upper right
        (margin, h//2 - patch//2),               # mid left
        (w - patch - margin, h//2 - patch//2),   # mid right
    ]

    brightness_vals = []
    saturation_vals = []
    color_vals = []
    texture_vals = []

    for rx, ry in regions:

        x = int(np.clip(rx, 0, w-1))
        y = int(np.clip(ry, 0, h-1))

        #Skip patches overlapping with face region
        if (x > face_x - patch and x < face_x + face_w + patch and
            y > face_y - patch and y < face_y + face_h + patch):
            continue

        patch_gray = gray[y:y+patch, x:x+patch]
        patch_hsv = hsv[y:y+patch, x:x+patch]
        patch_color = img[y:y+patch, x:x+patch]

        if patch_gray.size == 0:
            continue

        #Collect statistical features
        brightness_vals.append(np.mean(patch_gray))
        saturation_vals.append(np.mean(patch_hsv[:,:,1]))
        color_vals.append(np.mean(patch_color.reshape(-1,3), axis=0))
        texture_vals.append(np.std(patch_gray))

    #Ensure enough valid samples
    if len(brightness_vals) < 3:
        return False

    #Compute averages and deviations
    avg_brightness = np.mean(brightness_vals)
    avg_saturation = np.mean(saturation_vals)
    brightness_std = np.std(brightness_vals)
    color_std = np.std(color_vals, axis=0).mean()
    texture = np.mean(texture_vals)

    #Heuristic thresholds for passport compliance
    if avg_brightness < 130:   #background too dark
        return False

    if avg_saturation > 85:    #too colorful
        return False

    if brightness_std > 55:    #uneven lighting
        return False

    if color_std > 80:         #color inconsistency
        return False

    if texture > 30:           #textured background
        return False

    return True


#Compute midpoint between both eyes (used for alignment)
def compute_eye_midpoint(landmarks):

    left_eye = landmarks[33]
    right_eye = landmarks[263]

    eye_mid_x = (left_eye.x + right_eye.x) / 2
    eye_mid_y = (left_eye.y + right_eye.y) / 2

    return eye_mid_x, eye_mid_y


#Determine whether eyes are open based on vertical landmark distance
def compute_eye_openness(landmarks):

    left_eye_open = bool(abs(
        landmarks[159].y - landmarks[145].y
    ) > 0.01)

    right_eye_open = bool(abs(
        landmarks[386].y - landmarks[374].y
    ) > 0.01)

    return left_eye_open, right_eye_open


#Check if mouth is open
def compute_mouth_open(landmarks):

    return bool(abs(
        landmarks[13].y - landmarks[14].y
    ) > 0.02)


#Estimate head rotation (yaw and roll)
def compute_head_rotation(landmarks):
    left_eye = landmarks[33]
    right_eye = landmarks[263]
    nose = landmarks[1]

    #Yaw: horizontal deviation of nose from eye center
    yaw = (nose.x - (left_eye.x + right_eye.x) / 2) * 100

    #Roll: vertical difference between eyes
    roll = (right_eye.y - left_eye.y) * 100

    return yaw, roll


#Main API endpoint for face detection and analysis
@app.post("/detect")
def detect(data: ImageData):

    try:

        img = decode_image(data.image)

        if img is None:
            return {"error": "Invalid image"}

        h, w = img.shape[:2]

        #Convert image to required formats
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (11, 11), 0)  # smooth noise

        brightness = compute_brightness(gray)

        #Run face landmark detection
        results = face_mesh.process(rgb)

        #No face detected
        if not results.multi_face_landmarks:
            return {
                "faceCount": 0,
                "brightness": brightness,
                "faceBrightness": 0,
                "backgroundBrightness": 0,
                "backgroundVariance": 0,
                "backgroundNeutral": True,
                "faces": []
            }

        faces = []

        face_brightness = 0.0
        background_brightness = 0.0
        background_ok = False

        for face_landmarks in results.multi_face_landmarks:

            landmarks = face_landmarks.landmark

            #Compute bounding box of face
            x_min, y_min, x_max, y_max, face_x, face_y, face_w, face_h = \
                compute_face_bbox(landmarks, w, h)

            #Compute brightness values
            face_brightness = compute_face_brightness(
                gray, face_x, face_y, face_w, face_h
            )

            background_brightness = compute_background_brightness(
                gray, face_x, face_y, face_w, face_h, w, h
            )

            #Validate background
            background_ok = check_passport_background(img, face_x, face_y, face_w, face_h)

            #Facial feature analysis
            eye_mid_x, eye_mid_y = compute_eye_midpoint(landmarks)
            left_eye_open, right_eye_open = compute_eye_openness(landmarks)
            mouth_open = compute_mouth_open(landmarks)

            head_height_ratio = (y_max - y_min)

            yaw, roll = compute_head_rotation(landmarks)

            #Collect face information
            faces.append({
                "boundingBox": {
                    "x": x_min,
                    "y": y_min,
                    "width": x_max - x_min,
                    "height": y_max - y_min
                },
                "eyeMidpoint": {
                    "x": eye_mid_x,
                    "y": eye_mid_y
                },
                "headHeightRatio": head_height_ratio,
                "leftEyeOpen": left_eye_open,
                "rightEyeOpen": right_eye_open,
                "mouthOpen": mouth_open,
            })

        #Final API response
        return {
            "faceCount": len(faces),
            "faces": faces,
            "brightness": brightness,
            "faceBrightness": face_brightness,
            "backgroundBrightness": background_brightness,
            "backgroundOk": background_ok,
            "yaw": yaw,
            "roll": roll,
        }

    except Exception as e:
        #Catch unexpected runtime errors
        return {
            "error": str(e)
        }