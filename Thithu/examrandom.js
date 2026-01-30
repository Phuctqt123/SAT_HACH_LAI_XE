/* ======================================================
   examrandom.js
   Tạo đề thi ngẫu nhiên sát hạch GPLX (áp dụng từ 01/06/2025)
   - Hạng A1/A, B1: chỉ bốc trong Phụ lục 1 & 2 (danh sách chỉ định)
   - Hạng B/B2, C, D,...: bốc từ toàn bộ chương (questions.json) + 1 câu liệt riêng
====================================================== */

/* ================== UTILITY FUNCTIONS ================== */

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom(arr, n) {
  if (arr.length === 0 || n <= 0) return [];
  if (arr.length < n) {
    console.warn(`Không đủ câu: ${arr.length}/${n}`);
    return shuffle(arr);
  }
  return shuffle(arr).slice(0, n);
}

/* ================== DANH SÁCH CÂU ĐIỂM LIỆT (60 câu chung cho hạng ô tô) ================== */
const LIET_QUESTIONS = [
  19,20,21,22,23,24,25,26,27,28,
  30,32,34,35,47,48,52,53,55,58,
  63,64,65,66,67,68,70,71,72,73,
  74,85,86,87,88,89,90,91,92,93,
  97,98,102,117,163,165,167,197,198,206,
  215,226,234,245,246,252,253,254,255,260
];

/* ================== PHỤ LỤC 1 & 2 (dành riêng cho A1/A, B1) ================== */

const A1A_POOLS = {
  rules: [1,2,3,4,5,6,7,8,9,10,11,12,13,29,31,32,33,34,35,36,37,38,39,40,41,43,44,45,46,49,51,54,56,57,59,66,67,69,73,74,75,76,77,80,81,87,88,90,91,92,93,94,96,97,98,99,100,102,103,107,109,110,111,119,123,124,125,126,137,138,140,141,142,145,146,151,155,163,167,178],
  culture: [182,185,187,189,191,192,193,194,195,200],
  tech: [206,215,219,232,233,240,241,242,254,255,257,258,259,260,261],
  signals: [303,304,305,306,307,313,314,315,317,318,322,323,324,325,326,329,330,335,345,346,347,348,349,350,351,354,360,362,364,366,367,368,369,370,371,372,373,374,375,376,377,380,381,382,386,387,389,390,391,393,394,395,397,398,400,401,411,412,413,415,419,422,427,430,431,432,433,434,435,437,438,439,440,441,442,445,450,451,452,454,455,457,458,459,460,461,474,475,476,478],
  sahinh: [486,487,490,492,495,499,500,503,504,505,507,508,509,517,520,525,527,528,529,538,539,540,543,548,553,556,559,560,562,565,567,568,583,592,600],
  liet: [19,20,21,22,24,26,27,28,30,47,48,52,53,63,64,65,68,70,71,72]
};

const B1_POOLS = {
  rules: [1,2,3,4,5,6,7,8,9,10,11,12,13,19,20,21,22,24,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,43,44,45,46,47,48,49,51,52,53,54,55,56,57,59,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,80,81,82,87,88,89,90,91,92,93,94,96,97,98,99,100,102,103,107,108,109,110,111,119,123,124,125,126,137,138,139,140,141,142,145,146,151,155,157,162,163,165,166,167,178],
  culture: [182,185,187,189,191,192,193,194,195,200],
  tech: [206,215,219,232,233,240,241,242,254,255,257,258,259,260,261,266,285],
  signals: [303,304,305,306,307,313,314,315,317,318,322,323,324,325,326,329,330,332,333,334,335,344,345,346,347,348,349,350,351,354,355,360,361,362,364,366,367,368,369,370,371,372,373,374,375,376,377,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,400,401,402,405,406,407,408,409,410,411,412,413,415,416,418,419,420,421,422,423,424,425,426,427,430,431,432,433,434,435,436,437,438,439,440,441,442,443,445,446,450,451,452,454,455,456,457,458,459,460,461,474,475,476,477,478,479,480,481,482,483,485],
  sahinh: [486,487,490,492,495,499,500,503,504,505,507,508,509,517,520,525,527,528,529,538,539,540,543,548,553,556,559,560,562,565,567,568,583,592,600],
  liet: [19,20,21,22,24,26,27,28,30,47,48,52,53,63,64,65,68,70,71,72,73,74,87,89,90,91,92,215,254,255]
};

/* ================== HÀM TẠO ĐỀ TỪ POOL (dành cho A1/A, B1) ================== */

function generateFromPool(pools, config) {
  let exam = [];

  exam.push(...pickRandom(pools.rules,   config.rules));
  exam.push(...pickRandom(pools.culture, config.culture));
  exam.push(...pickRandom(pools.tech,    config.tech));
  exam.push(...pickRandom(pools.signals, config.signals));
  exam.push(...pickRandom(pools.sahinh,  config.sahinh));

  if (config.liet === 1 && pools.liet.length > 0) {
    exam.push(...pickRandom(pools.liet, 1));
  }

  return shuffle(exam);
}

function randomExamA1A() {
  return generateFromPool(A1A_POOLS, {
    rules:   8,
    culture: 1,
    tech:    1,
    signals: 8,
    sahinh:  6,
    liet:    1   // Tổng 25
  });
}

function randomExamB1() {
  return generateFromPool(B1_POOLS, {
    rules:   8,
    culture: 1,
    tech:    1,
    signals: 8,
    sahinh:  6,
    liet:    1   // Tổng 25
  });
}

/* ================== HÀM TẠO ĐỀ TỪ CHAPTERS ================== */

const CHAPTER = {
  RULES: "I",
  CULTURE: "II",
  TECH_DRIVING: "III",
  STRUCTURE: "IV",
  SIGNALS: "V",
  SITUATIONS: "VI"
};

function buildQuestionMap(chapters) {
  const map = {};
  chapters.forEach(ch => {
    map[ch.id] = ch.questions || [];
  });
  return map;
}

function generateExamFromChapters(chapters, config, lietIds = LIET_QUESTIONS) {
  const qmap = buildQuestionMap(chapters);
  let exam = [];

  Object.entries(config.normal).forEach(([chId, count]) => {
    let source = qmap[chId] || [];
    source = source.filter(q => !lietIds.includes(q.id));
    exam.push(...pickRandom(source.map(q => q.id), count));
  });

  if (config.liet === 1 && lietIds.length > 0) {
    exam.push(...pickRandom(lietIds, 1));
  }

  return shuffle(exam);
}

function randomExamB(chapters) {
  return generateExamFromChapters(chapters, {
    normal: {
      [CHAPTER.RULES]: 8,
      [CHAPTER.CULTURE]: 1,
      [CHAPTER.TECH_DRIVING]: 1,
      [CHAPTER.STRUCTURE]: 1,
      [CHAPTER.SIGNALS]: 9,
      [CHAPTER.SITUATIONS]: 9
    },
    liet: 1
  }); // Tổng 30
}

function randomExamC1(chapters) {
  return generateExamFromChapters(chapters, {
    normal: {
      [CHAPTER.RULES]: 10,
      [CHAPTER.CULTURE]: 1,
      [CHAPTER.TECH_DRIVING]: 2,
      [CHAPTER.STRUCTURE]: 1,
      [CHAPTER.SIGNALS]: 10,
      [CHAPTER.SITUATIONS]: 10
    },
    liet: 1
  }); // Tổng 35
}

function randomExamC(chapters) {
  return generateExamFromChapters(chapters, {
    normal: {
      [CHAPTER.RULES]: 10,
      [CHAPTER.CULTURE]: 1,
      [CHAPTER.TECH_DRIVING]: 2,
      [CHAPTER.STRUCTURE]: 1,
      [CHAPTER.SIGNALS]: 14,
      [CHAPTER.SITUATIONS]: 11
    },
    liet: 1
  }); // 40
}

function randomExamD1_D2_D_BE_C1E_CE_D1E(chapters) {
  return generateExamFromChapters(chapters, {
    normal: {
      [CHAPTER.RULES]: 10,
      [CHAPTER.CULTURE]: 1,
      [CHAPTER.TECH_DRIVING]: 2,
      [CHAPTER.STRUCTURE]: 1,
      [CHAPTER.SIGNALS]: 16,
      [CHAPTER.SITUATIONS]: 14
    },
    liet: 1
  }); // Tổng 45
}

/* ================== EXPORT ================== */

export {
  randomExamA1A,
  randomExamB1,
  randomExamB,
  randomExamC,
  randomExamC1,
  randomExamD1_D2_D_BE_C1E_CE_D1E,
  buildQuestionMap,   // Export để dùng trong theoryExam.js
  LIET_QUESTIONS,      // Nếu cần dùng riêng
  A1A_POOLS,
  B1_POOLS
};