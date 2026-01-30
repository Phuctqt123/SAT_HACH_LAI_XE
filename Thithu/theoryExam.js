// theoryExam.js

import {
  randomExamA1A,
  randomExamB1,
  randomExamB,
  randomExamC,
  randomExamC1,
  randomExamD1_D2_D_BE_C1E_CE_D1E,
  buildQuestionMap,
  LIET_QUESTIONS,      
  A1A_POOLS,
  B1_POOLS
} from './examrandom.js';

// Biến toàn cục để lưu hạng hiện tại (có thể thay đổi động từ UI)
let currentLicenseType = "B";
window.currentLicenseType = currentLicenseType;

/**
 * Hàm tải và tạo đề thi theo hạng bằng lái
 * @param {string} licenseType - Mã hạng bằng (A1, A, B1, B, C1, C, D, E, ...)
 */
async function loadQuestions(licenseType = "B") {
  window.currentLicenseType = currentLicenseType; 
  currentLicenseType = licenseType;

  try {
    let examIds = []; // mảng ID câu hỏi
    let chapters = null;

    // Load toàn bộ bộ câu hỏi từ JSON (dùng chung cho tất cả hạng)
    const res = await fetch("./questions.json");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    chapters = await res.json();

    // Tạo danh sách ID theo hạng
    if (licenseType === "A1" || licenseType === "A") {
      examIds = randomExamA1A();
    } else if (licenseType === "B1") {
      examIds = randomExamB1();
    } else {
      switch (licenseType) {
        case "B":
        case "B2":
          examIds = randomExamB(chapters);
          break;

        case "C1":
          examIds = randomExamC1(chapters);
          break;
        case "C":
          examIds = randomExamC(chapters);
          break;

        case "D":
        case "D1":
        case "D2":
        case "E":
        case "F":
        case "C1E":
        case "CE":
          examIds = randomExamD1_D2_D_BE_C1E_CE_D1E(chapters); 
          break;
        default:
          console.warn(`Hạng ${licenseType} chưa được hỗ trợ đầy đủ, fallback về hạng B`);
          examIds = randomExamB(chapters);
          currentLicenseType = "B";
      }
    }

    if (examIds.length === 0) {
      throw new Error("Không tạo được danh sách ID câu hỏi");
    }

    // Map ID → object câu hỏi đầy đủ (question, options, ...)
    const qmap = buildQuestionMap(chapters);
    const fullExam = [];

    examIds.forEach(id => {
      let found = null;
      for (const chId in qmap) {
        found = qmap[chId].find(q => q.id === id);
        if (found) break;
      }
      if (found) {
        fullExam.push(found);
      } else {
        console.warn(`Không tìm thấy câu hỏi ID ${id} trong questions.json`);
      }
    });

    if (fullExam.length !== examIds.length) {
      console.warn(`Một số câu hỏi không tìm thấy (${examIds.length} → ${fullExam.length})`);
    }

    // Lưu vào window để UI truy cập
    window.examQuestions = fullExam;

    console.log(`✅ Đã tạo đề thi thành công cho hạng ${currentLicenseType}`);
    console.log(`Số câu: ${fullExam.length}`);

    // Dispatch event để HTML biết đề đã sẵn sàng
    document.dispatchEvent(new CustomEvent('examLoaded', { 
      detail: { 
        type: currentLicenseType, 
        count: fullExam.length 
      } 
    }));

  } catch (err) {
    console.error("❌ Lỗi khi load/tạo đề thi:", err);
    alert("Không thể tải hoặc tạo bộ đề thi. Vui lòng kiểm tra file questions.json và kết nối mạng.");
  }
}

function getLietQuestionIdsByLicense(licenseType) {
  if (licenseType === 'A' || licenseType === 'A1') {
    return A1A_POOLS.liet || [];
  }
  if (licenseType === 'B1') {
    return B1_POOLS.liet || [];
  }
  return LIET_QUESTIONS || [];
}
// 👉 EXPOSE RA GLOBAL CHO HTML / FILE KHÁC
window.getLietQuestionIdsByLicense = getLietQuestionIdsByLicense;

// Hàm public để UI gọi khi người dùng thay đổi hạng
window.reloadExam = function(newLicenseType) {
  currentLicenseType = newLicenseType;
  window.currentLicenseType = currentLicenseType;
  console.log(`Reload đề thi cho hạng mới: ${newLicenseType}`);
  loadQuestions(newLicenseType);
};



/**
 * Reload đề thi chỉ cho một chương cụ thể (dùng cho chế độ Ôn tập)
 * @param {string} licenseType - hạng bằng (A1, B, C, ...)
 * @param {number} chapterNum - số chương (1 → Chương I, 2 → Chương II, ...)
 */
window.reloadExamWithChapter = async function(licenseType, chapterNum) {
  currentLicenseType = licenseType;
  window.currentLicenseType = licenseType;

  try {
    // Load toàn bộ chapters từ JSON (giống loadQuestions)
    const res = await fetch("./questions.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const chapters = await res.json();

    let selectedQuestions = [];

    if (licenseType === "A1" || licenseType === "A") {
      // Đặc biệt cho A1/A: dùng A1A_POOLS
      const pools = A1A_POOLS;

      // Mapping chương → pool
      const chapterToPool = {
        1: [...pools.rules, ...pools.liet],     // Chương I: Quy định chung + điểm liệt
        2: pools.culture,
        3: pools.tech,
        4: pools.signals,
        5: pools.sahinh
      };

      const pool = chapterToPool[chapterNum] || [];
      if (pool.length === 0) {
        throw new Error(`Chương ${chapterNum} không có câu hỏi cho hạng A/A1`);
      }

      // Lấy đầy đủ object câu hỏi từ pool ID
      const qmap = buildQuestionMap(chapters);
      selectedQuestions = pool
        .map(id => {
          for (const chId in qmap) {
            const found = qmap[chId].find(q => q.id === id);
            if (found) return found;
          }
          return null;
        })
        .filter(Boolean); // loại bỏ null nếu ID không tồn tại

    } else {
      // Với hạng B, C, D,... : filter theo chapter.id
      const chapterKeyMap = {
        1: "I",   // RULES
        2: "II",  // CULTURE
        3: "III", // TECH_DRIVING
        4: "IV",  // STRUCTURE
        5: "V",   // SIGNALS
        6: "VI"   // SITUATIONS
      };

      const targetChapterId = chapterKeyMap[chapterNum];
      if (!targetChapterId) {
        throw new Error(`Chương ${chapterNum} không hợp lệ cho hạng ${licenseType}`);
      }

      // Tìm chapter có id tương ứng
      const targetChapter = chapters.find(ch => ch.id === targetChapterId);
      if (!targetChapter || !targetChapter.questions) {
        throw new Error(`Không tìm thấy chương ${targetChapterId} trong questions.json`);
      }

      // Lấy tất cả câu hỏi của chương (bốc hết, không random)
      selectedQuestions = targetChapter.questions;

      // Nếu muốn loại điểm liệt ra khỏi ôn tập (tuỳ chọn)
      // selectedQuestions = selectedQuestions.filter(q => !LIET_QUESTIONS.includes(q.id));
    }

    if (selectedQuestions.length === 0) {
      throw new Error(`Không có câu hỏi nào cho chương ${chapterNum}`);
    }

    // Lưu vào window.examQuestions
    window.examQuestions = selectedQuestions;

    console.log(`✅ Ôn tập chương ${chapterNum} - ${licenseType}: ${selectedQuestions.length} câu`);

    // Dispatch event để UI biết
    document.dispatchEvent(new CustomEvent('examLoaded', { 
      detail: { 
        type: 'ontap', 
        license: licenseType,
        chapter: chapterNum,
        count: selectedQuestions.length 
      } 
    }));

  } catch (err) {
    console.error("❌ Lỗi reloadExamWithChapter:", err);
    alert(`Không thể tải câu hỏi chương ${chapterNum}. Lỗi: ${err.message}`);
  }
};

// Load đề mặc định khi trang mở
loadQuestions(currentLicenseType);