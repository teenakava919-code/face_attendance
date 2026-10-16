# import frappe
# import base64
# import cv2
# import numpy as np
# import json

# from frappe.utils.file_manager import save_file
# from frappe.utils import now_datetime

# from .recognition import app


# @frappe.whitelist()
# def register_face(employee, image):

#     if "," in image:
#         image = image.split(",")[1]

#     image_bytes = base64.b64decode(image)
#     np_array = np.frombuffer(image_bytes, np.uint8)
#     img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

#     if img is None:
#         return {"success": False, "message": "Invalid image data received"}

#     faces = app.get(img)

#     if len(faces) == 0:
#         return {"success": False, "message": "No face detected"}

#     if len(faces) > 1:
#         return {
#             "success": False,
#             "message": "Multiple faces detected. Please ensure only one person is in front of the camera."
#         }

#     embedding = faces[0].embedding.tolist()

#     existing = frappe.db.exists("Face Profile", {"employee": employee})

#     if existing:
#         doc = frappe.get_doc("Face Profile", existing)
#         doc.embedding = json.dumps(embedding)
#         doc.active = 1
#         doc.save(ignore_permissions=True)
#         message = "Face Updated Successfully"
#     else:
#         doc = frappe.get_doc({
#             "doctype": "Face Profile",
#             "employee": employee,
#             "embedding": json.dumps(embedding),
#             "active": 1
#         })
#         doc.insert(ignore_permissions=True)
#         message = "Face Registered Successfully"

#     photo_file = save_file(
#         f"{employee}.jpg",
#         base64.b64decode(image),
#         "Face Profile",
#         doc.name,
#         decode=False,
#         is_private=0
#     )

#     doc.photo = photo_file.file_url
#     doc.save(ignore_permissions=True)

#     frappe.db.commit()

#     return {
#         "success": True,
#         "message": message
#     }


# @frappe.whitelist()
# def verify_face(image):

#     if "," in image:
#         image = image.split(",")[1]

#     image_bytes = base64.b64decode(image)
#     np_array = np.frombuffer(image_bytes, np.uint8)
#     img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

#     if img is None:
#         return {"success": False, "message": "Invalid image data received"}

#     faces = app.get(img)

#     if len(faces) == 0:
#         return {"success": False, "message": "No face detected"}

#     if len(faces) > 1:
#         return {
#             "success": False,
#             "message": "Multiple faces detected. Please ensure only one person is in front of the camera."
#         }

#     live_embedding = np.array(faces[0].embedding)

#     # Age & Gender detection (InsightFace built-in genderage model)
#     detected_age = int(faces[0].age)
#     detected_gender = "Male" if faces[0].gender == 1 else "Female"

#     profiles = frappe.get_all("Face Profile", filters={"active": 1}, fields=["employee", "embedding"])

#     best_score = 0
#     best_employee = None

#     for pdoc in profiles:
#         stored = np.array(json.loads(pdoc.embedding))
#         score = np.dot(live_embedding, stored) / (
#             np.linalg.norm(live_embedding) * np.linalg.norm(stored)
#         )
#         if score > best_score:
#             best_score = score
#             best_employee = pdoc.employee

#     THRESHOLD = 0.60

#     if not best_employee or best_score < THRESHOLD:
#         return {
#             "success": False,
#             "message": "Face Not Recognized",
#             "score": round(float(best_score), 2),
#             "age": detected_age,
#             "gender": detected_gender
#         }

#     # last_log = frappe.db.get_value(
#     #     "Employee Checkin",
#     #     {"employee": best_employee},
#     #     "time",
#     #     order_by="time desc"
#     # )
#     # if last_log and (now_datetime() - last_log).seconds < 120:
#     #     return {"success": False, "message": f"Already marked recently ({best_employee})"}

#     # doc = frappe.get_doc({
#     #     "doctype": "Employee Checkin",
#     #     "employee": best_employee,
#     #     "time": now_datetime(),
#     #     "log_type": "IN"
#     # })
#     last_checkin = frappe.db.get_value(
#         "Employee Checkin",
#         {"employee": best_employee},
#         ["time", "log_type"],
#         order_by="time desc",
#         as_dict=True
#     )

#     if last_checkin and (now_datetime() - last_checkin.time).seconds < 120:
#         return {"success": False, "message": f"Already marked recently ({best_employee})"}

#     # Decide IN or OUT based on last log
#     if last_checkin and last_checkin.log_type == "IN":
#         next_log_type = "OUT"
#     else:
#         next_log_type = "IN"

#     doc = frappe.get_doc({
#         "doctype": "Employee Checkin",
#         "employee": best_employee,
#         "time": now_datetime(),
#         "log_type": next_log_type
#     })
#     doc.insert(ignore_permissions=True)
#     frappe.db.commit()

#     # return {
#     #     "success": True,
#     #     "message": f"Marked Present: {best_employee}",
#     #     "employee": best_employee,
#     #     "score": round(float(best_score), 2)
#     # }
#     return {
#         "success": True,
#         "message": f"Marked {next_log_type}: {best_employee}",
#         "employee": best_employee,
#         "score": round(float(best_score), 2),
#         "age": detected_age,
#         "gender": detected_gender
#     }
# @frappe.whitelist()
# def get_average_age_gender(images):
#     import json as _json

#     if isinstance(images, str):
#         images = _json.loads(images)

#     ages = []
#     genders = []

#     for image in images:
#         if "," in image:
#             image = image.split(",")[1]

#         image_bytes = base64.b64decode(image)
#         np_array = np.frombuffer(image_bytes, np.uint8)
#         img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

#         if img is None:
#             continue

#         faces = app.get(img)

#         if len(faces) != 1:
#             continue

#         ages.append(int(faces[0].age))
#         genders.append("Male" if faces[0].gender == 1 else "Female")

#     if not ages:
#         return {"success": False, "message": "Could not read frames"}

#     avg_age = round(sum(ages) / len(ages))
#     final_gender = max(set(genders), key=genders.count)

#     return {
#         "success": True,
#         "age": avg_age,
#         "gender": final_gender
#     }




#square
import frappe
import base64
import cv2
import numpy as np
import json

from frappe.utils.file_manager import save_file
from frappe.utils import now_datetime

from .recognition import app


def _bbox(face):
    return [round(float(v), 1) for v in face.bbox[:4]]


@frappe.whitelist()
def register_face(employee, image):

    if "," in image:
        image = image.split(",")[1]

    image_bytes = base64.b64decode(image)
    np_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if img is None:
        return {"success": False, "message": "Invalid image data received"}

    faces = app.get(img)

    if len(faces) == 0:
        return {"success": False, "message": "No face detected"}

    if len(faces) > 1:
        return {
            "success": False,
            "message": "Multiple faces detected. Please ensure only one person is in front of the camera."
        }

    embedding = faces[0].embedding.tolist()

    existing = frappe.db.exists("Face Profile", {"employee": employee})

    if existing:
        doc = frappe.get_doc("Face Profile", existing)
        doc.embedding = json.dumps(embedding)
        doc.active = 1
        doc.save(ignore_permissions=True)
        message = "Face Updated Successfully"
    else:
        doc = frappe.get_doc({
            "doctype": "Face Profile",
            "employee": employee,
            "embedding": json.dumps(embedding),
            "active": 1
        })
        doc.insert(ignore_permissions=True)
        message = "Face Registered Successfully"

    photo_file = save_file(
        f"{employee}.jpg",
        base64.b64decode(image),
        "Face Profile",
        doc.name,
        decode=False,
        is_private=0
    )

    doc.photo = photo_file.file_url
    doc.save(ignore_permissions=True)

    frappe.db.commit()

    return {
        "success": True,
        "message": message
    }


@frappe.whitelist()
def verify_face(image):

    if "," in image:
        image = image.split(",")[1]

    image_bytes = base64.b64decode(image)
    np_array = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if img is None:
        return {"success": False, "message": "Invalid image data received"}

    # camera frame size (face box ne screen par map karva mate)
    frame = {"frame_w": int(img.shape[1]), "frame_h": int(img.shape[0])}

    faces = app.get(img)

    if len(faces) == 0:
        return {"success": False, "message": "No face detected", **frame}

    if len(faces) > 1:
        return {
            "success": False,
            "message": "Multiple faces detected. Please ensure only one person is in front of the camera.",
            "boxes": [_bbox(f) for f in faces],
            **frame
        }

    face = faces[0]
    live_embedding = np.array(face.embedding)

    # Age & Gender detection (InsightFace built-in genderage model)
    detected_age = int(face.age) if face.age is not None else None
    detected_gender = None if face.gender is None else ("Male" if face.gender == 1 else "Female")

    # Darek response ma jaay: face box + age/gender + frame size
    extra = {
        "box": _bbox(face),
        "age": detected_age,
        "gender": detected_gender,
        **frame
    }

    profiles = frappe.get_all("Face Profile", filters={"active": 1}, fields=["employee", "embedding"])

    best_score = 0
    best_employee = None

    for pdoc in profiles:
        stored = np.array(json.loads(pdoc.embedding))
        score = np.dot(live_embedding, stored) / (
            np.linalg.norm(live_embedding) * np.linalg.norm(stored)
        )
        if score > best_score:
            best_score = score
            best_employee = pdoc.employee

    THRESHOLD = 0.60

    if not best_employee or best_score < THRESHOLD:
        return {
            "success": False,
            "message": "Face Not Recognized",
            "score": round(float(best_score), 2),
            **extra
        }

    last_checkin = frappe.db.get_value(
        "Employee Checkin",
        {"employee": best_employee},
        ["time", "log_type"],
        order_by="time desc",
        as_dict=True
    )

    if last_checkin and (now_datetime() - last_checkin.time).total_seconds() < 120:
        return {
            "success": False,
            "message": f"Already marked recently ({best_employee})",
            "employee": best_employee,
            "score": round(float(best_score), 2),
            **extra
        }

    # Decide IN or OUT based on last log
    if last_checkin and last_checkin.log_type == "IN":
        next_log_type = "OUT"
    else:
        next_log_type = "IN"

    doc = frappe.get_doc({
        "doctype": "Employee Checkin",
        "employee": best_employee,
        "time": now_datetime(),
        "log_type": next_log_type
    })
    doc.insert(ignore_permissions=True)
    frappe.db.commit()

    return {
        "success": True,
        "message": f"Marked {next_log_type}: {best_employee}",
        "employee": best_employee,
        "score": round(float(best_score), 2),
        **extra
    }


@frappe.whitelist()
def get_average_age_gender(images):
    import json as _json

    if isinstance(images, str):
        images = _json.loads(images)

    ages = []
    genders = []

    for image in images:
        if "," in image:
            image = image.split(",")[1]

        image_bytes = base64.b64decode(image)
        np_array = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if img is None:
            continue

        faces = app.get(img)

        if len(faces) != 1:
            continue

        ages.append(int(faces[0].age))
        genders.append("Male" if faces[0].gender == 1 else "Female")

    if not ages:
        return {"success": False, "message": "Could not read frames"}

    avg_age = round(sum(ages) / len(ages))
    final_gender = max(set(genders), key=genders.count)

    return {
        "success": True,
        "age": avg_age,
        "gender": final_gender
    }
    
@frappe.whitelist()
def track_face(image):
    if "," in image:
        image = image.split(",")[1]

    img = cv2.imdecode(np.frombuffer(base64.b64decode(image), np.uint8), cv2.IMREAD_COLOR)

    if img is None:
        return {"boxes": []}

    frame = {"frame_w": int(img.shape[1]), "frame_h": int(img.shape[0])}

    try:
        # sirf detection (fast): recognition/age nahi
        bboxes, _ = app.det_model.detect(img, max_num=0, metric="default")
        boxes = [] if bboxes is None else [[round(float(v), 1) for v in b[:4]] for b in bboxes]
    except Exception:
        # fallback: upar no method na chale to full pipeline
        boxes = [_bbox(f) for f in app.get(img)]

    return {"boxes": boxes[:5], **frame}