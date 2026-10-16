import json
import frappe

# doc = frappe.get_doc({
#     "doctype": "Face Profile",
#     "employee": employee,
#     "embedding": json.dumps(embedding),
#     "active": 1
# })

# doc.insert(ignore_permissions=True)
# frappe.db.commit()


# @frappe.whitelist()
# def register_face(employee, image):

#     image_bytes = base64.b64decode(image)

#     np_array = np.frombuffer(image_bytes, np.uint8)

#     img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

#     faces = app.get(img)

#     if not faces:
#         return {
#             "success": False,
#             "message": "No face detected"
#         }

#     embedding = faces[0].embedding.tolist()

#     doc = frappe.get_doc({
#         "doctype": "Face Profile",
#         "employee": employee,
#         "embedding": json.dumps(embedding),
#         "active": 1
#     })

#     doc.insert(ignore_permissions=True)
#     frappe.db.commit()

#     return {
#         "success": True,
#         "message": "Face Registered Successfully"
#     }


import frappe

def get_context(context):
    context.no_cache = 1