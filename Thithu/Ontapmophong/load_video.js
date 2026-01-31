let randomQuestions = [];
let currentQuestionIndex = 0;
let totalDuration = 0;
/* ================= BIẾN TOÀN CỤC ================= */
const video = document.getElementById("videoPlayer");
const progress = document.getElementById("timeline-progress");
const timeline = document.getElementById("timeline-wrapper");
const skipBtn = document.getElementById("skipBtn");
const nextBtn = document.getElementById("nextBtn");
const retryBtn = document.getElementById("retryBtn");
const gridContainer = document.getElementById("gridQuestions");
const examArea = document.getElementById("examArea");
const footerMarker = document.getElementById("footerMarker");

let flagPlaced = false;
let flagTime = null;
let isReviewed = false;
let currentQuestionNumber = 1; // Mặc định câu 1

/* ================= KHỞI TẠO DANH SÁCH 120 CÂU ================= */


/* ================= HÀM CHỌN CÂU CỤ THỂ ================= */
function jumpToQuestion(number) {
    currentQuestionNumber = number;
    
    // Highlight nút đang chọn
    document.querySelectorAll('.q-item').forEach(el => el.classList.remove('active'));
    const currentBtn = document.getElementById('q-btn-' + number);
    if (currentBtn) currentBtn.classList.add('active');
    
    resetUI();
    
    // 1. Tự động cuộn lên trên cùng của trang khi bắt đầu câu mới
    window.scrollTo({ top: 150, behavior: 'smooth' });

    if (typeof loadVideo === "function") {
        loadVideo(number);
        video.pause();
        video.currentTime = 0;
        
        setTimeout(() => {
            video.load();
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.log("Play blocked:", error));
            }
        }, 50);
    }
}

/* ================= TÍNH ĐIỂM ================= */
function calculateScore(dangerousTimes, currentTimeMs) {
    if (!dangerousTimes) return 0;
    const t1 = parseFloat(dangerousTimes.time1) * 1000;
    const t2 = parseFloat(dangerousTimes.time2) * 1000;
    
    if (currentTimeMs < t1 || currentTimeMs > t2) return 0;

    const interval = (t2 - t1) / 5;
    const diff = currentTimeMs - t1;

    if (diff <= interval) return 5;
    if (diff <= 2 * interval) return 4;
    if (diff <= 3 * interval) return 3;
    if (diff <= 4 * interval) return 2;
    return 1;
}

/* ================= ĐIỀU KHIỂN VIDEO ================= */
video.addEventListener("timeupdate", () => {
    if (!video.duration || isReviewed) return;
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.width = percent + "%";
});

/* ================= HIỂN THỊ PHỔ ĐIỂM ================= */
function showReview() {
    if (isReviewed || !video.duration) return;
    isReviewed = true;
    
    video.pause();
    progress.classList.add('review-mode');
    progress.style.width = (video.currentTime / video.duration) * 100 + "%";

    const qKey = currentQuestionNumber;

    if (typeof tinhhuong !== 'undefined' && tinhhuong[qKey]) {
        const t1 = parseFloat(tinhhuong[qKey].time1);
        const t2 = parseFloat(tinhhuong[qKey].time2);
        const d = video.duration;

        for (let i = 0; i < 5; i++) {
            const z = document.createElement("div");
            z.className = "zone s" + (5 - i);
            const startPercent = (t1 + (t2 - t1) / 5 * i) / d * 100;
            const widthPercent = ((t2 - t1) / 5) / d * 100;
            z.style.left = startPercent + "%";
            z.style.width = widthPercent + "%";
            timeline.appendChild(z);
        }
    }

    skipBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    
    // Khi xem kết quả cũng cuộn xuống dưới cùng để thấy phổ điểm và nút bấm
    footerMarker.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

/* ================= SỰ KIỆN ================= */
document.addEventListener("keydown", e => {
    if (e.code !== "Space" || flagPlaced || video.paused || video.ended || isReviewed) return;
    e.preventDefault(); 

    flagPlaced = true;
    flagTime = video.currentTime;

    const percent = (flagTime / video.duration) * 100;
    const flag = document.createElement("div");
    flag.className = "flag";
    
    flag.style.left = percent + "%";
    timeline.appendChild(flag);

    skipBtn.style.display = "inline-block";

    const qKey = currentQuestionNumber;
    
    if (typeof tinhhuong !== 'undefined') {
        const score = calculateScore(tinhhuong[qKey], flagTime * 1000);
        document.getElementById("score").innerText = "Điểm: " + score;
    }

    // 2. Sau khi ấn Space xong, tự động cuộn xuống dưới cùng để lộ điểm và các nút
    footerMarker.scrollIntoView({ behavior: 'smooth', block: 'end' });
});
document.getElementById("tapDangerBtn")
    .addEventListener("click", () => {
        document.dispatchEvent(
            new KeyboardEvent("keydown", { code: "Space" })
        );
    });

skipBtn.onclick = showReview;
video.addEventListener("ended", showReview);

retryBtn.onclick = () => {
    jumpToQuestion(currentQuestionNumber);
};

nextBtn.onclick = () => {
    if (currentQuestionNumber < 120) {
        jumpToQuestion(currentQuestionNumber + 1);
    } else {
        alert("Bạn đã hoàn thành 120 câu hỏi!");
    }
};

/* ================= RESET UI ================= */
function resetUI() {
    flagPlaced = false;
    flagTime = null;
    isReviewed = false;
    skipBtn.style.display = "none";
    nextBtn.style.display = "none";
    document.getElementById("score").innerText = "Điểm: -";
    progress.style.width = "0%";
    progress.classList.remove('review-mode');
    const extras = timeline.querySelectorAll('.flag, .zone');
    extras.forEach(el => el.remove());
}

window.onload = () => {
    jumpToQuestion(1);
};
// Load video theo số câu
function loadVideo(questionNumber) {
    const videoPlayer = document.getElementById("videoPlayer");
    const questionSpan = document.getElementById("questionNumber");

    videoPlayer.src = `video_mo_phong/${questionNumber}.webm`;
    videoPlayer.currentTime = 0;
    videoPlayer.load();

    questionSpan.innerText = questionNumber;
}

// Random câu hỏi
function getRandomQuestions() {
    randomQuestions = [
        Math.floor(Math.random() * (15 - 1 + 1)) + 1,
        Math.floor(Math.random() * (29 - 16 + 1)) + 16,
        Math.floor(Math.random() * (43 - 30 + 1)) + 30,
        Math.floor(Math.random() * (54 - 44 + 1)) + 44,
        Math.floor(Math.random() * (63 - 55 + 1)) + 55,
        Math.floor(Math.random() * (73 - 64 + 1)) + 64,
        Math.floor(Math.random() * (81 - 74 + 1)) + 74,
        Math.floor(Math.random() * (90 - 82 + 1)) + 82,
        Math.floor(Math.random() * (105 - 91 + 1)) + 91,
        Math.floor(Math.random() * (120 - 106 + 1)) + 106
    ];

    totalDuration = randomQuestions.reduce((sum, q) => {
        return sum + parseFloat(tinhhuong[q].ttime) * 1000;
    }, 0);

    currentQuestionIndex = 0;
    loadCurrentQuestion();
}

// Load câu hiện tại
function loadCurrentQuestion() {
    if (currentQuestionIndex >= randomQuestions.length) {
        alert("Đã hoàn thành bài thi!");
        return;
    }

    const questionNumber = randomQuestions[currentQuestionIndex];
    loadVideo(questionNumber);
}

// Sang câu tiếp theo
function nextQuestion() {
    currentQuestionIndex++;
    loadCurrentQuestion();
}
