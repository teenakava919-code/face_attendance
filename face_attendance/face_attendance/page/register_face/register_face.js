// frappe.pages['register_face'].on_page_load = function(wrapper) {
// 	var page = frappe.ui.make_app_page({
// 		parent: wrapper,
// 		title: 'REGISTER FACE',
// 		single_column: true
// 	});
// }
///////////////////////////////////////////
// console.log("Register Face JS Loaded");

// frappe.pages['register_face'].on_page_load = function (wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: "Register Face",
//         single_column: true
//     });

//     // page.main.html(`
//     //     <div style="text-align:center">
//     //         <video id="video" width="500" autoplay></video>

//     //         <br><br>

//     //         <button class="btn btn-primary" id="capture">
//     //             Register Face
//     //         </button>

//     //         <canvas id="canvas" style="display:none;"></canvas>
//     //     </div>
//     // `);
//     page.main.html(`
//         <div style="max-width:500px;margin:auto;text-align:center">

//         <div id="employee_link"></div>

//         <br>

//         <video
//             id="video"
//             autoplay
//             playsinline
//             style="width:100%;max-width:450px;border:1px solid #ccc;border-radius:8px;">
//         </video>

//         <br><br>

//         <button id="capture" class="btn btn-primary btn-lg">
//             Register Face
//         </button>

//         <canvas id="canvas" style="display:none;"></canvas>

//     </div>
// `);

//     let employee_control = frappe.ui.form.make_control({
//     parent: document.getElementById("employee_link"),
//     df: {
//         fieldtype: "Link",
//         options: "Employee",
//         label: "Employee",
//         fieldname: "employee",
//         reqd: 1
//     },
//     render_input: true
// });

//     // navigator.mediaDevices.getUserMedia({video:true})
//     // .then(function(stream){

//     //     document.getElementById("video").srcObject = stream;

//     // });
//     navigator.mediaDevices.getUserMedia({ video: true })
//         .then(function(stream) {
//             document.getElementById("video").srcObject = stream;
//     })
//     .catch(function(err) {
//         console.error(err);
//         frappe.msgprint("Camera Error: " + err.message);
//    });

// //     document.getElementById("capture").onclick=function(){

// //         let video=document.getElementById("video");
// //         let canvas=document.getElementById("canvas");

// //         canvas.width=video.videoWidth;
// //         canvas.height=video.videoHeight;

// //         let ctx=canvas.getContext("2d");
// //         ctx.drawImage(video,0,0);

// //         // let base64Image=canvas.toDataURL("image/jpeg")
// //         //     .replace("data:image/jpeg;base64,","");

// //         // frappe.call({

// //         //     method:"face_attendance.api.register_face",

// //             // args:{
// //             //     employee:"HR-EMP-00001",
// //             //     image:base64Image
// //             // },
// //        let employee = employee_control.get_value();

// //             frappe.call({
// //             method: "face_attendance.api.register_face",
// //             args: {
// //             employee: employee,
// //             image: base64Image
// //         },
// //     callback: function(r) {
// //         frappe.msgprint(r.message.message);
// //     }
// // });

//     document.getElementById("capture").onclick = function () {

//         console.log("Register button clicked");
//         frappe.msgprint("Button Clicked");

//         let video = document.getElementById("video");
//         let canvas = document.getElementById("canvas");

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         let ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0);

//         let base64Image = canvas.toDataURL("image/jpeg")
//         .replace("data:image/jpeg;base64,", "");

//     console.log("Calling Python API");

//     frappe.call({
//         method: "face_attendance.api.register_face",
//         args: {
//             employee: "HR-EMP-00001",
//             image: base64Image
//         },
//         callback: function (r) {
//             console.log(r);
//             frappe.msgprint(JSON.stringify(r.message));
//         }
//     });

// };





//         //     callback:function(r){

//         //         frappe.msgprint(r.message.message);

//         //     }

//         // });

// //     };

// // };

/////////////////////////////////////////////////////////////////////

console.log("Register Face JS Loaded");

frappe.pages["register_face"].on_page_load = function (wrapper) {

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Register Face",
        single_column: true
    });

    page.main.html(`
        <div style="max-width:500px;margin:auto;text-align:center">

            <div id="employee_link"></div>

            <br>

            <video
                id="video"
                autoplay
                playsinline
                style="width:100%;max-width:450px;border:1px solid #ccc;border-radius:8px;">
            </video>

            <br><br>

            <button id="capture" class="btn btn-primary btn-lg">
                Register Face
            </button>

            <canvas id="canvas" style="display:none;"></canvas>

        </div>
    `);

    // Employee Link Field
    let employee_control = frappe.ui.form.make_control({
        parent: $("#employee_link"),
        df: {
            fieldname: "employee",
            label: "Employee",
            fieldtype: "Link",
            options: "Employee",
            reqd: 1
        },
        render_input: true
    });

    employee_control.refresh();

    // Camera
    navigator.mediaDevices.getUserMedia({
        video: true
    }).then((stream) => {

        document.getElementById("video").srcObject = stream;

    }).catch((err) => {

        frappe.msgprint(err.message);

    });

    // Register Button
    $("#capture").on("click", function () {

        let employee = employee_control.get_value();

        if (!employee) {
            frappe.msgprint("Please select Employee");
            return;
        }

        let video = document.getElementById("video");
        let canvas = document.getElementById("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        let base64Image = canvas
            .toDataURL("image/jpeg")
            .replace(/^data:image\/jpeg;base64,/, "");

        frappe.call({
            method: "face_attendance.api.register_face",
            freeze: true,
            args: {
                employee: employee,
                image: base64Image
            },
            callback: function (r) {

                if (r.message) {
                    frappe.msgprint(r.message.message || "Face Registered");
                }

            }
        });

    });

};