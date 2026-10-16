// frappe.pages['live-attendance'].on_page_load = function (wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Live Attendance',
//         single_column: true
//     });

//     page.main.html(`
//         <div style="max-width:500px;margin:auto;text-align:center">

//             <video
//                 id="live_video"
//                 autoplay
//                 playsinline
//                 style="width:100%;max-width:450px;border:1px solid #ccc;border-radius:8px;">
//             </video>

//             <br><br>

//             <div id="result_box" style="font-size:20px;font-weight:bold;padding:10px;">
//                 Scanning...
//             </div>

//             <canvas id="live_canvas" style="display:none;"></canvas>

//         </div>
//     `);

//     let video = document.getElementById("live_video");
//     let canvas = document.getElementById("live_canvas");
//     let resultBox = document.getElementById("result_box");
//     let isProcessing = false;

//     navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//             video.srcObject = stream;
//         })
//         .catch((err) => {
//             frappe.msgprint("Camera Error: " + err.message);
//         });

//     setInterval(function () {

//         if (isProcessing) return;
//         if (video.videoWidth === 0) return;

//         isProcessing = true;

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         let ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0);

//         let base64Image = canvas
//             .toDataURL("image/jpeg")
//             .replace(/^data:image\/jpeg;base64,/, "");

//         frappe.call({
//             method: "face_attendance.api.verify_face",
//             args: { image: base64Image },
//             callback: function (r) {
//                 isProcessing = false;

//                 if (!r.message) return;

//                 let res = r.message;

//                 if (res.success) {
//                     resultBox.innerHTML = `✅ ${res.message} (score: ${res.score})`;
//                     resultBox.style.color = "green";
//                 } else {
//                     resultBox.innerHTML = `⚠️ ${res.message}`;
//                     resultBox.style.color = "orange";
//                 }
//             },
//             error: function () {
//                 isProcessing = false;
//             }
//         });

//     }, 1500);

// };



//2nd code
// frappe.pages['live-attendance'].on_page_load = function (wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: 'Live Attendance',
//         single_column: true
//     });

//     page.main.html(`
//         <style>
//             .fa-wrapper {
//                 max-width: 480px;
//                 margin: 24px auto;
//                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//             }
//             .fa-card {
//                 background: #fff;
//                 border-radius: 16px;
//                 box-shadow: 0 2px 12px rgba(0,0,0,0.08);
//                 overflow: hidden;
//                 border: 1px solid #eee;
//             }
//             .fa-video-wrap {
//                 position: relative;
//                 background: #000;
//                 aspect-ratio: 4/3;
//             }
//             .fa-video-wrap video {
//                 width: 100%;
//                 height: 100%;
//                 object-fit: cover;
//                 display: block;
//             }
//             .fa-ring {
//                 position: absolute;
//                 top: 12px; right: 12px;
//                 width: 12px; height: 12px;
//                 border-radius: 50%;
//                 background: #4caf50;
//                 box-shadow: 0 0 0 4px rgba(76,175,80,0.25);
//                 animation: fa-pulse 1.5s infinite;
//             }
//             @keyframes fa-pulse {
//                 0% { box-shadow: 0 0 0 0 rgba(76,175,80,0.4); }
//                 70% { box-shadow: 0 0 0 8px rgba(76,175,80,0); }
//                 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0); }
//             }
//             .fa-status {
//                 padding: 20px 24px;
//                 display: flex;
//                 align-items: center;
//                 gap: 14px;
//                 border-top: 1px solid #eee;
//                 transition: background 0.3s ease;
//             }
//             .fa-status-icon {
//                 font-size: 28px;
//                 line-height: 1;
//                 flex-shrink: 0;
//             }
//             .fa-status-text {
//                 flex: 1;
//             }
//             .fa-status-title {
//                 font-size: 17px;
//                 font-weight: 600;
//                 margin: 0;
//                 line-height: 1.3;
//             }
//             .fa-status-sub {
//                 font-size: 13px;
//                 color: #888;
//                 margin: 2px 0 0;
//             }
//             .fa-clock {
//                 text-align: center;
//                 font-size: 13px;
//                 color: #999;
//                 margin-top: 14px;
//             }
//         </style>

//         <div class="fa-wrapper">
//             <div class="fa-card">
//                 <div class="fa-video-wrap">
//                     <video id="live_video" autoplay playsinline></video>
//                     <div class="fa-ring"></div>
//                 </div>
//                 <div class="fa-status" id="status_row" style="background:#f7f7f7;">
//                     <div class="fa-status-icon" id="status_icon">🔍</div>
//                     <div class="fa-status-text">
//                         <p class="fa-status-title" id="status_title" style="color:#555;">Scanning for face...</p>
//                         <p class="fa-status-sub" id="status_sub">Position your face in the frame</p>
//                     </div>
//                 </div>
//             </div>
//             <div class="fa-clock" id="fa_clock"></div>
//         </div>
//     `);

//     let video = document.getElementById("live_video");
//     let statusRow = document.getElementById("status_row");
//     let statusIcon = document.getElementById("status_icon");
//     let statusTitle = document.getElementById("status_title");
//     let statusSub = document.getElementById("status_sub");
//     let clockEl = document.getElementById("fa_clock");

//     let canvas = document.createElement("canvas");
//     let isPaused = false;

//     function updateClock() {
//         let now = new Date();
//         clockEl.innerText = now.toLocaleTimeString();
//     }
//     updateClock();
//     setInterval(updateClock, 1000);

//     navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//             video.srcObject = stream;
//         })
//         .catch((err) => {
//             setStatus("error", "Camera unavailable", err.message);
//         });

//     function setStatus(type, title, sub) {
//         statusSub.innerText = sub || "";
//         statusTitle.innerText = title;

//         const styles = {
//             scanning: { bg: "#f7f7f7", color: "#555", icon: "🔍" },
//             in: { bg: "#e8f5e9", color: "#2e7d32", icon: "✅" },
//             out: { bg: "#e3f2fd", color: "#1565c0", icon: "🚪" },
//             warning: { bg: "#fff8e1", color: "#f9a825", icon: "⏳" },
//             error: { bg: "#ffebee", color: "#c62828", icon: "❌" }
//         };

//         let s = styles[type] || styles.scanning;
//         statusRow.style.background = s.bg;
//         statusTitle.style.color = s.color;
//         statusIcon.innerText = s.icon;
//     }
//     function captureMultipleFrames(count, callback) {
//         let frames = [];
//         let taken = 0;

//         let captureTimer = setInterval(function () {
//             if (video.videoWidth === 0) return;

//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             let ctx = canvas.getContext("2d");
//             ctx.drawImage(video, 0, 0);

//             let frame = canvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
//             frames.push(frame);
//             taken++;

//             if (taken >= count) {
//                 clearInterval(captureTimer);

//                 frappe.call({
//                     method: "face_attendance.api.get_average_age_gender",
//                     args: { images: JSON.stringify(frames) },
//                     callback: function (r) {
//                         if (r.message && r.message.success) {
//                             callback(r.message.age, r.message.gender);
//                         }
//                     }
//                 });
//             }
//         }, 200);
//     }
//     setInterval(function () {

//         if (isPaused) return;
//         if (video.videoWidth === 0) return;

//         isPaused = true;

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         let ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0);

//         let base64Image = canvas
//             .toDataURL("image/jpeg")
//             .replace(/^data:image\/jpeg;base64,/, "");

//         frappe.call({
//             method: "face_attendance.api.verify_face",
//             args: { image: base64Image },
//             callback: function (r) {

//                 if (!r.message) {
//                     isPaused = false;
//                     return;
//                 }

//                 let res = r.message;
//                 let holdTime = 1000;

//                 // if (res.success) {
//                 //     let isOut = res.message.toUpperCase().includes("OUT");
//                 //     let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";
//                 //     setStatus(
//                 //         isOut ? "out" : "in",
//                 //         (isOut ? "Checked out — " : "Checked in — ") + empName,
//                 //         "Match confidence: " + Math.round(res.score * 100) + "%"
//                 //     );
//                 //     holdTime = 5000;
//                 // } 
//                 // //age -gender
//                 // if (res.success) {
//                 //     let isOut = res.message.toUpperCase().includes("OUT");
//                 //     let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";
//                 //     setStatus(
//                 //         isOut ? "out" : "in",
//                 //         (isOut ? "Checked out — " : "Checked in — ") + empName,
//                 //         "Match confidence: " + Math.round(res.score * 100) + "% | Age: " + res.age + " | Gender: " + res.gender
//                 //     );
//                 //     holdTime = 5000;
//                 // }
//                 if (res.success) {
//                     let isOut = res.message.toUpperCase().includes("OUT");
//                     let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";

//                     isPaused = true;
//                     holdTime = 999999;

//                     captureMultipleFrames(5, function (avgAge, avgGender) {
//                         setStatus(
//                             isOut ? "out" : "in",
//                             (isOut ? "Checked out — " : "Checked in — ") + empName,
//                             "Match confidence: " + Math.round(res.score * 100) + "% | Age: " + avgAge + " | Gender: " + avgGender
//                         );
//                         setTimeout(function () {
//                             isPaused = false;
//                             setStatus("scanning", "Scanning for face...", "Position your face in the frame");
//                         }, 5000);
//                     });
//                 }
//                 else if (res.message && res.message.includes("Already marked")) {
//                     setStatus("warning", "Already marked", "Please wait before scanning again");
//                     holdTime = 3000;
//                 } else if (res.message === "No face detected") {
//                     setStatus("scanning", "Scanning for face...", "Position your face in the frame");
//                     holdTime = 700;
//                 }
//                 else if (res.message === "Face Not Recognized") {
//                     setStatus("error", "Face not recognized", "This face isn't registered yet");
//                     holdTime = 2500;
//                 }

//                 else if (res.message && res.message.includes("Multiple faces")) {
//                     setStatus("warning", "Multiple faces detected", "Only one person at a time please");
//                     holdTime = 2000;
//                 } else {
//                     setStatus("warning", res.message, "");
//                     holdTime = 2000;
//                 }

//                 setTimeout(function () {
//                     isPaused = false;
//                     if (holdTime >= 2000) {
//                         setStatus("scanning", "Scanning for face...", "Position your face in the frame");
//                     }
//                 }, holdTime);
//             },
//             error: function () {
//                 isPaused = false;
//             }
//         });

//     }, 1200);

// };



frappe.pages['live-attendance'].on_page_load = function (wrapper) {

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Live Attendance',
        single_column: true
    });

    page.main.html(`
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

            .fa-kiosk {
                box-sizing: border-box;
                background: linear-gradient(180deg, #f7f9fc 0%, #eef2f8 100%);
                margin: 0 -24px;
                height: 100vh;                 /* JS (fitKiosk) exact height set karse */
                padding: 28px 24px 24px;
                font-family: 'Poppins', 'Segoe UI', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                overflow: hidden;
            }

            /* ---------- Header: logo + clock ---------- */
            .fa-brand {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-shrink: 0;
            }
            .fa-logo { height: 38px; width: auto; display: block; }
            .fa-wordmark { line-height: 1.15; }
            .fa-wm-title { font-size: 1.15rem; font-weight: 700; color: #144e78; }
            .fa-wm-sub   { font-size: 0.7rem; font-weight: 500; color: #4a5568; }

            .fa-clock-row { text-align: center; flex-shrink: 0; }
            .fa-clock {
                color: #0e2a52;
                font-size: 1.9rem;
                font-weight: 700;
                line-height: 1.1;
                letter-spacing: -0.01em;
                font-variant-numeric: tabular-nums;
            }
            .fa-date { color: #7a8599; font-size: 0.8rem; margin-top: 2px; }

            /* ---------- Camera (center, remaining space) ---------- */
            .fa-card {
                flex: 1 1 0;
                min-height: 0;
                aspect-ratio: 4 / 3;
                max-width: 100%;
                background: #0b0e14;
                border-radius: 16px;
                overflow: hidden;
                border: 1px solid #dde3ec;
                box-shadow: 0 12px 32px rgba(14, 42, 82, 0.14);
                position: relative;
            }
            .fa-video-wrap { position: absolute; inset: 0; }
            .fa-video-wrap video {
                width: 100%; height: 100%;
                object-fit: cover; display: block;
            }
            .fa-ring {
                position: absolute; top: 12px; right: 12px;
                width: 10px; height: 10px; border-radius: 50%;
                background: #4caf50;
                box-shadow: 0 0 0 4px rgba(76,175,80,0.28);
                animation: fa-pulse 1.6s infinite;
            }
            @keyframes fa-pulse {
                0%   { box-shadow: 0 0 0 0 rgba(76,175,80,0.4); }
                70%  { box-shadow: 0 0 0 9px rgba(76,175,80,0); }
                100% { box-shadow: 0 0 0 0 rgba(76,175,80,0); }
            }

            /*square*/
            /* ---------- Face box (square + employee ID) ---------- */
            .fa-facebox {
                position: absolute;
                box-sizing: border-box;
                border: 3px solid var(--fb, #fff);
                border-radius: 12px;
                box-shadow: 0 0 0 1px rgba(0,0,0,0.25), 0 6px 18px rgba(0,0,0,0.3);
                opacity: 0;
                pointer-events: none;
                z-index: 3;
                transition: left .28s linear, top .28s linear, width .28s linear, height .28s linear, opacity .2s ease;
            }
            .fa-facebox.show { opacity: 1; }
            .fa-facetag {
                position: absolute;
                left: -3px;
                bottom: calc(100% + 4px);
                padding: 3px 10px;
                border-radius: 6px;
                background: var(--fb, #fff);
                color: #fff;
                font-size: 0.72rem;
                font-weight: 600;
                letter-spacing: 0.02em;
                white-space: nowrap;
            }
            .fa-facetag.inside { bottom: 6px; left: 6px; }
            .fb-scan { --fb: #ffffff; }
            .fb-in   { --fb: #1f8a4c; }
            .fb-out  { --fb: #1d6fa5; }
            .fb-warn { --fb: #b8860b; }
            .fb-err  { --fb: #c0392b; }

            
            /* ---------- Status bar (Check-in / out) ---------- */
            .fa-status {
                width: 100%;
                max-width: 560px;
                flex-shrink: 0;
                padding: 12px 18px;
                border-radius: 12px;
                border: 1px solid #e2e6ed;
                border-left: 4px solid #cbd3e0;
                background: #fff;
                display: flex;
                align-items: center;
                gap: 14px;
                box-shadow: 0 4px 14px rgba(14,42,82,0.06);
                transition: background .25s ease, border-color .25s ease;
            }
            .fa-status-icon {
                width: 40px; height: 40px; flex-shrink: 0;
                border-radius: 10px; font-size: 19px;
                display: flex; align-items: center; justify-content: center;
                background: #eef1f6;
            }
            .fa-status-text { flex: 1; min-width: 0; }
            .fa-status-title {
                font-size: 1rem; font-weight: 600; margin: 0;
                line-height: 1.3; color: #1c2b3e;
            }
            .fa-status-sub { font-size: 0.8rem; margin: 2px 0 0; color: #7a8599; }
            /* Phone: camera nano, 4:3 box (tall nahi) */
            @media (max-width: 700px) {
                .fa-card {
                    flex: 0 0 auto;
                    width: 100%;
                    min-height: auto;
                    aspect-ratio: 4 / 3;
                }
            }
            /* Small laptop height */
            @media (max-height: 720px) {
                .fa-kiosk { gap: 8px; padding-top: 18px; }
                .fa-logo { height: 32px; }
                .fa-clock { font-size: 1.6rem; }
                .fa-status { padding: 9px 16px; }
            }
        </style>

        <div class="fa-kiosk">
            <div class="fa-brand">
                <img class="fa-logo" alt="GalaxyERP" src="data:image/png;base64,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">
                <div class="fa-wordmark">
                    <div class="fa-wm-title">GalaxyERP</div>
                    <div class="fa-wm-sub">Software Pvt. Ltd</div>
                </div>
            </div>

            <div class="fa-clock-row">
                <div class="fa-clock" id="fa_clock">--:--:--</div>
                <div class="fa-date" id="fa_date"></div>
            </div>

            <div class="fa-card">
                <div class="fa-video-wrap">
                    <video id="live_video" autoplay playsinline muted></video>
                    <div class="fa-ring"></div>
                </div>
            </div>

            <div class="fa-status" id="status_row" style="background:#fff; border-left-color:#cbd3e0;">
                <div class="fa-status-icon" id="status_icon" style="background:#eef1f6;">🔍</div>
                <div class="fa-status-text">
                    <p class="fa-status-title" id="status_title">Scanning for face...</p>
                    <p class="fa-status-sub" id="status_sub">Position your face in the frame</p>
                </div>
            </div>
        </div>
    `);

    // ---------- Exact height fit (top/bottom cut na thay) ----------
    function fitKiosk() {
        let kiosk = document.querySelector(".fa-kiosk");
        if (!kiosk) return;
        let top = kiosk.getBoundingClientRect().top;
        kiosk.style.height = (window.innerHeight - top) + "px";
    }
    fitKiosk();
    setTimeout(fitKiosk, 300);
    $(window).on("resize", fitKiosk);

    // Frappe nu niche nu extra padding / white strip kadhva
    $(wrapper).find(".layout-main-section").css({ "padding": "0", "margin": "0" });
    $(wrapper).find(".page-body").css({ "padding-bottom": "0", "margin-bottom": "0" });

    let video = document.getElementById("live_video");
    /*square*/
    let videoWrap = document.querySelector(".fa-video-wrap");
    let VIDEO_POS_Y = 0.3;
    video.style.objectPosition = "50% " + (VIDEO_POS_Y * 100) + "%";
    let statusRow = document.getElementById("status_row");
    let statusIcon = document.getElementById("status_icon");
    let statusTitle = document.getElementById("status_title");
    let statusSub = document.getElementById("status_sub");
    let clockEl = document.getElementById("fa_clock");
    let dateEl = document.getElementById("fa_date");

    let canvas = document.createElement("canvas");
    let isPaused = false;

    function updateClock() {
        let now = new Date();
        clockEl.innerText = now.toLocaleTimeString();
        dateEl.innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            setStatus("error", "Camera unavailable", err.message);
        });

    function setStatus(type, title, sub) {
        statusSub.innerText = sub || "";
        statusTitle.innerText = title;

        const styles = {
            scanning: { bg: "#fff", border: "#cbd3e0", icon_bg: "#eef1f6", icon: "🔍" },
            in: { bg: "#f1f9f4", border: "#1f8a4c", icon_bg: "#dcf0e3", icon: "✅" },
            out: { bg: "#eef6fb", border: "#1d6fa5", icon_bg: "#dcedf7", icon: "🚪" },
            warning: { bg: "#fdf6e8", border: "#b8860b", icon_bg: "#f8ead0", icon: "⏳" },
            error: { bg: "#fbeeec", border: "#c0392b", icon_bg: "#f6d9d3", icon: "❌" }
        };

        let s = styles[type] || styles.scanning;
        statusRow.style.background = s.bg;
        statusRow.style.borderLeftColor = s.border;
        statusIcon.style.background = s.icon_bg;
        statusIcon.innerText = s.icon;
    }
    /*square*/
    // ---------- Face box: square around face + employee ID ----------
    let faceBoxes = [];
    let boxExpireAt = 0;

    function boxEl(i) {
        if (!faceBoxes[i]) {
            let el = document.createElement("div");
            el.className = "fa-facebox";
            el.innerHTML = '<span class="fa-facetag"></span>';
            videoWrap.appendChild(el);
            faceBoxes[i] = el;
        }
        return faceBoxes[i];
    }

    function hideBoxes() {
        faceBoxes.forEach(function (el) { el.classList.remove("show"); });
        boxExpireAt = 0;
    }

    // items: [{ box: [x1,y1,x2,y2] (camera frame pixels), cls: "fb-in", label: "HR-EMP-00003" }]
    function showBoxes(items, fw, fh, ttl) {
        let cw = videoWrap.clientWidth, ch = videoWrap.clientHeight;
        if (!cw || !ch || !fw || !fh) return;

        // video object-fit: cover chhe, etle frame pixels ne screen pixels ma map karvana
        let scale = Math.max(cw / fw, ch / fh);
        let offX = (cw - fw * scale) / 2;
        // let offY = (ch - fh * scale) / 2;
        let offY = (ch - fh * scale) * VIDEO_POS_Y;
        items.forEach(function (it, i) {
            let b = it.box;
            let cx = ((b[0] + b[2]) / 2) * scale + offX;
            let cy = ((b[1] + b[3]) / 2) * scale + offY;
            let side = Math.min(Math.max(b[2] - b[0], b[3] - b[1]) * scale * 1.1, cw, ch);
            let left = Math.min(Math.max(cx - side / 2, 0), cw - side);
            let top = Math.min(Math.max(cy - side / 2, 0), ch - side);

            let el = boxEl(i);
            let wasShown = el.classList.contains("show");
            if (!wasShown) el.style.transition = "none";

            el.style.left = left + "px";
            el.style.top = top + "px";
            el.style.width = side + "px";
            el.style.height = side + "px";
            el.className = "fa-facebox show " + it.cls;

            let tag = el.firstChild;
            tag.textContent = it.label || "";
            tag.style.display = it.label ? "block" : "none";
            tag.className = "fa-facetag" + (top < 30 ? " inside" : "");

            if (!wasShown) {
                void el.offsetWidth;
                el.style.transition = "";
            }
        });

        for (let i = items.length; i < faceBoxes.length; i++) {
            faceBoxes[i].classList.remove("show");
        }
        boxExpireAt = Date.now() + ttl;
    }

    setInterval(function () {
        if (boxExpireAt && Date.now() > boxExpireAt) hideBoxes();
    }, 200);
    // ---------- Live tracking: the box always follows the face ----------
    // When recognition returns an employee ID, it is saved in "lbl".
    // The tracker keeps that ID attached to the same face.
    let lbl = null;            // { cls, label, until, nb }
    let lastFaceAt = 0;
    let trackCanvas = document.createElement("canvas");

    function labelFace(box, fw, fh, cls, label, ms) {
        lbl = {
            cls: cls,
            label: label,
            until: Date.now() + ms,
            nb: [box[0] / fw, box[1] / fh, box[2] / fw, box[3] / fh]
        };
    }

    function clearLabel() { lbl = null; }

    function grabSmall(maxW) {
        let s = Math.min(1, maxW / video.videoWidth);
        trackCanvas.width = Math.round(video.videoWidth * s);
        trackCanvas.height = Math.round(video.videoHeight * s);
        trackCanvas.getContext("2d").drawImage(video, 0, 0, trackCanvas.width, trackCanvas.height);
        return trackCanvas.toDataURL("image/jpeg", 0.6).replace(/^data:image\/jpeg;base64,/, "");
    }

    function trackLoop() {
        if (video.videoWidth === 0) { setTimeout(trackLoop, 500); return; }

        frappe.call({
            method: "face_attendance.api.track_face",
            args: { image: grabSmall(480) },
            no_spinner: true,
            callback: function (r) {
                let m = r.message;
                let has = !!(m && m.boxes && m.boxes.length);
                let now = Date.now();

                if (!has) {
                    hideBoxes();
                    if (lbl && now - lastFaceAt > 1200) lbl = null;   // face gayu = ID pan gayo
                } else {
                    lastFaceAt = now;

                    let items = m.boxes.map(function (b) {
                        return { box: b, cls: "fb-scan", label: "" };
                    });

                    if (lbl && now > lbl.until) lbl = null;

                    if (lbl) {
                        // ID wala juna box ni sauthi najik face = same vyakti
                        let ocx = (lbl.nb[0] + lbl.nb[2]) / 2;
                        let ocy = (lbl.nb[1] + lbl.nb[3]) / 2;
                        let osz = Math.max(lbl.nb[2] - lbl.nb[0], lbl.nb[3] - lbl.nb[1]);
                        let bi = -1, bd = 1e9;

                        m.boxes.forEach(function (b, i) {
                            let d = Math.hypot((b[0] + b[2]) / 2 / m.frame_w - ocx, (b[1] + b[3]) / 2 / m.frame_h - ocy);
                            if (d < bd) { bd = d; bi = i; }
                        });

                        if (bd <= osz * 1.5) {
                            let b = m.boxes[bi];
                            lbl.nb = [b[0] / m.frame_w, b[1] / m.frame_h, b[2] / m.frame_w, b[3] / m.frame_h];
                            items[bi].cls = lbl.cls;
                            items[bi].label = lbl.label;
                        } else {
                            lbl = null;   // bahu dur = bijo vyakti, ID na lagado
                        }
                    }

                    showBoxes(items, m.frame_w, m.frame_h, 900);
                }

                setTimeout(trackLoop, has ? 150 : 500);
            },
            error: function () {
                setTimeout(trackLoop, 1500);
            }
        });
    }
    trackLoop();
    /**/
    function captureMultipleFrames(count, callback) {
        let frames = [];
        let taken = 0;

        let captureTimer = setInterval(function () {
            if (video.videoWidth === 0) return;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0);

            let frame = canvas.toDataURL("image/jpeg").replace(/^data:image\/jpeg;base64,/, "");
            frames.push(frame);
            taken++;

            if (taken >= count) {
                clearInterval(captureTimer);

                // frappe.call({
                //     method: "face_attendance.api.get_average_age_gender",
                //     args: { images: JSON.stringify(frames) },
                //     callback: function (r) {
                //         if (r.message && r.message.success) {
                //             callback(r.message.age, r.message.gender);
                //         }
                //     }
                // });
                frappe.call({
                    method: "face_attendance.api.get_average_age_gender",
                    args: { images: JSON.stringify(frames) },
                    callback: function (r) {
                        if (r.message && r.message.success) {
                            callback(r.message.age, r.message.gender);
                        } else {
                            callback(null, null);
                        }
                    },
                    error: function () {
                        callback(null, null);
                    }
                });
            }
        }, 200);
    }

    setInterval(function () {

        if (isPaused) return;
        if (video.videoWidth === 0) return;

        isPaused = true;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        let base64Image = canvas
            .toDataURL("image/jpeg")
            .replace(/^data:image\/jpeg;base64,/, "");

        frappe.call({
            method: "face_attendance.api.verify_face",
            args: { image: base64Image },
            // callback: function (r) {

            //     if (!r.message) {
            //         isPaused = false;
            //         return;
            //     }

            //     let res = r.message;
            //     let holdTime = 1000;

            //     if (res.success) {
            //         let isOut = res.message.toUpperCase().includes("OUT");
            //         let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";

            //         isPaused = true;
            //         holdTime = 999999;

            //         captureMultipleFrames(5, function (avgAge, avgGender) {
            //             setStatus(
            //                 isOut ? "out" : "in",
            //                 (isOut ? "Checked out — " : "Checked in — ") + empName,
            //                 "Match confidence: " + Math.round(res.score * 100) + "% | Age: " + avgAge + " | Gender: " + avgGender
            //             );
            //             setTimeout(function () {
            //                 isPaused = false;
            //                 setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //             }, 5000);
            //         });
            //     }
            //     else if (res.message && res.message.includes("Already marked")) {
            //         setStatus("warning", "Already marked", "Please wait before scanning again");
            //         holdTime = 3000;
            //     } else if (res.message === "No face detected") {
            //         setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //         holdTime = 700;
            //     }
            //     else if (res.message === "Face Not Recognized") {
            //         setStatus("error", "Face not recognized", "This face isn't registered yet");
            //         holdTime = 2500;
            //     }
            //     else if (res.message && res.message.includes("Multiple faces")) {
            //         setStatus("warning", "Multiple faces detected", "Only one person at a time please");
            //         holdTime = 2000;
            //     } else {
            //         setStatus("warning", res.message, "");
            //         holdTime = 2000;
            //     }

            //     setTimeout(function () {
            //         isPaused = false;
            //         if (holdTime >= 2000) {
            //             setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //         }
            //     }, holdTime);
            // },
            // callback: function (r) {

            //     if (!r.message) {
            //         isPaused = false;
            //         return;
            //     }

            //     let res = r.message;
            //     let holdTime = 1000;
            //     let fw = res.frame_w, fh = res.frame_h;

            //     if (res.success) {
            //         let isOut = res.message.toUpperCase().includes("OUT");
            //         let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";

            //         if (res.box) {
            //             showBoxes([{ box: res.box, cls: isOut ? "fb-out" : "fb-in", label: res.employee }], fw, fh, 9000);
            //         }

            //         captureMultipleFrames(5, function (avgAge, avgGender) {
            //             let ageTxt = avgAge != null ? avgAge : (res.age != null ? res.age : "-");
            //             let genTxt = avgGender || res.gender || "-";

            //             setStatus(
            //                 isOut ? "out" : "in",
            //                 (isOut ? "Checked out — " : "Checked in — ") + empName,
            //                 "Match confidence: " + Math.round(res.score * 100) + "% | Age: " + ageTxt + " | Gender: " + genTxt
            //             );
            //             setTimeout(function () {
            //                 isPaused = false;
            //                 hideBoxes();
            //                 setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //             }, 5000);
            //         });
            //         return;
            //     }
            //     else if (res.message && res.message.includes("Already marked")) {
            //         if (res.box) showBoxes([{ box: res.box, cls: "fb-warn", label: res.employee }], fw, fh, 3100);
            //         setStatus("warning", "Already marked", "Please wait before scanning again");
            //         holdTime = 3000;
            //     } else if (res.message === "No face detected") {
            //         hideBoxes();
            //         setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //         holdTime = 700;
            //     }
            //     else if (res.message === "Face Not Recognized") {
            //         if (res.box) showBoxes([{ box: res.box, cls: "fb-err", label: "Unknown" }], fw, fh, 2600);
            //         setStatus("error", "Face not recognized", "This face isn't registered yet");
            //         holdTime = 2500;
            //     }
            //     else if (res.message && res.message.includes("Multiple faces")) {
            //         if (res.boxes) {
            //             showBoxes(res.boxes.map(function (b) { return { box: b, cls: "fb-warn", label: "" }; }), fw, fh, 2100);
            //         }
            //         setStatus("warning", "Multiple faces detected", "Only one person at a time please");
            //         holdTime = 2000;
            //     } else {
            //         hideBoxes();
            //         setStatus("warning", res.message, "");
            //         holdTime = 2000;
            //     }

            //     setTimeout(function () {
            //         isPaused = false;
            //         if (holdTime >= 2000) {
            //             setStatus("scanning", "Scanning for face...", "Position your face in the frame");
            //         }
            //     }, holdTime);
            // },
                        callback: function (r) {

                if (!r.message) {
                    isPaused = false;
                    return;
                }

                let res = r.message;
                let holdTime = 1000;
                let fw = res.frame_w, fh = res.frame_h;

                if (res.success) {
                    let isOut = res.message.toUpperCase().includes("OUT");
                    let empName = res.message.split(":")[1] ? res.message.split(":")[1].trim() : "";
                    let cls = isOut ? "fb-out" : "fb-in";

                    if (res.box) {
                        showBoxes([{ box: res.box, cls: cls, label: res.employee }], fw, fh, 9000);
                        labelFace(res.box, fw, fh, cls, res.employee, 20000);
                    }

                    captureMultipleFrames(5, function (avgAge, avgGender) {
                        let ageTxt = avgAge != null ? avgAge : (res.age != null ? res.age : "-");
                        let genTxt = avgGender || res.gender || "-";

                        setStatus(
                            isOut ? "out" : "in",
                            (isOut ? "Checked out — " : "Checked in — ") + empName,
                            "Match confidence: " + Math.round(res.score * 100) + "% | Age: " + ageTxt + " | Gender: " + genTxt
                        );
                        setTimeout(function () {
                            isPaused = false;
                            clearLabel();
                            hideBoxes();
                            setStatus("scanning", "Scanning for face...", "Position your face in the frame");
                        }, 5000);
                    });
                    return;
                }
                else if (res.message && res.message.includes("Already marked")) {
                    if (res.box) {
                        showBoxes([{ box: res.box, cls: "fb-warn", label: res.employee }], fw, fh, 3100);
                        labelFace(res.box, fw, fh, "fb-warn", res.employee, 3000);
                    }
                    setStatus("warning", "Already marked", "Please wait before scanning again");
                    holdTime = 3000;
                } else if (res.message === "No face detected") {
                    setStatus("scanning", "Scanning for face...", "Position your face in the frame");
                    holdTime = 700;
                }
                else if (res.message === "Face Not Recognized") {
                    if (res.box) {
                        showBoxes([{ box: res.box, cls: "fb-err", label: "Unknown" }], fw, fh, 2600);
                        labelFace(res.box, fw, fh, "fb-err", "Unknown", 2500);
                    }
                    setStatus("error", "Face not recognized", "This face isn't registered yet");
                    holdTime = 2500;
                }
                else if (res.message && res.message.includes("Multiple faces")) {
                    if (res.boxes) {
                        showBoxes(res.boxes.map(function (b) { return { box: b, cls: "fb-warn", label: "" }; }), fw, fh, 2100);
                    }
                    setStatus("warning", "Multiple faces detected", "Only one person at a time please");
                    holdTime = 2000;
                } else {
                    setStatus("warning", res.message, "");
                    holdTime = 2000;
                }

                setTimeout(function () {
                    isPaused = false;
                    if (holdTime >= 2000) {
                        setStatus("scanning", "Scanning for face...", "Position your face in the frame");
                    }
                }, holdTime);
            },
            error: function () {
                isPaused = false;
            }
        });

    }, 1200);

};