// Dữ liệu câu hỏi trắc nghiệm lái xe
const quizData = {
    lyThuyet: [
        {
            id: 1,
            question: "Tốc độ tối đa cho phép trên đường nội thành là bao nhiêu?",
            answers: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
            correct: 1
        },
        {
            id: 2,
            question: "Biển báo này có ý nghĩa gì?",
            answers: ["Cấm dừng xe", "Cấm đỗ xe", "Cấm vào", "Cấm quay đầu"],
            correct: 0
        },
        {
            id: 3,
            question: "Khi phanh gấp, bạn nên làm gì?",
            answers: ["Phanh từ từ", "Phanh mạnh ngay lập tức", "Tắt máy rồi phanh", "Không được phanh"],
            correct: 1
        },
        {
            id: 4,
            question: "Khoảng cách an toàn tối thiểu khi đi với tốc độ 50 km/h là?",
            answers: ["10m", "20m", "30m", "40m"],
            correct: 1
        },
        {
            id: 5,
            question: "Biển báo đèn đỏ giao thông có ý nghĩa gì?",
            answers: ["Cảnh báo", "Dừng lại", "Yêu cầu chú ý", "Phía trước có nguy hiểm"],
            correct: 1
        },
        {
            id: 6,
            question: "Khi đi qua khu vực dân cư, tốc độ tối đa là?",
            answers: ["20 km/h", "30 km/h", "40 km/h", "50 km/h"],
            correct: 1
        },
        {
            id: 7,
            question: "Thời gian an toàn để lái xe liên tục không ngừng là bao nhiêu?",
            answers: ["2 giờ", "3 giờ", "4 giờ", "6 giờ"],
            correct: 1
        },
        {
            id: 8,
            question: "Bạn nên làm gì khi gặp phương tiện cấp cứu?",
            answers: ["Vẫn tiếp tục", "Nhường đường ngay lập tức", "Giảm tốc độ từ từ", "Dừng lại và đợi"],
            correct: 1
        },
        {
            id: 9,
            question: "Biển báo này báo hiệu điều gì?",
            answers: ["Đường cong", "Đường gập khúc", "Dốc xuống", "Giao lộ"],
            correct: 1
        },
        {
            id: 10,
            question: "Độ sâu của lốp xe tối thiểu phải là bao nhiêu mm?",
            answers: ["0.8mm", "1.6mm", "2.0mm", "3.0mm"],
            correct: 1
        }
    ],
    moPhong: [
        {
            id: 1,
            question: "Khi khởi động xe máy, bạn nên làm gì trước tiên?",
            answers: ["Bật đèn điều hòa", "Kiểm tra gương chiếu hậu", "Nổ máy ngay", "Chuyển số cao"],
            correct: 1
        },
        {
            id: 2,
            question: "Cách cầm vô lăng đúng nhất là?",
            answers: ["Cầm ở vị trí 2 và 10 giờ", "Cầm ở vị trí 3 và 9 giờ", "Cầm ở vị trí 4 và 8 giờ", "Cầm tùy ý"],
            correct: 0
        },
        {
            id: 3,
            question: "Bạn nên đặt chân nào trên bàn đạp ga?",
            answers: ["Chân trái", "Chân phải", "Cả hai chân", "Không bàn đạp ga"],
            correct: 1
        },
        {
            id: 4,
            question: "Khi vào cua, bạn nên?",
            answers: ["Tăng ga", "Phanh trước khi vào cua", "Phanh trong khi vào cua", "Không cần phanh"],
            correct: 1
        },
        {
            id: 5,
            question: "Chiếu sáng đèn ngoài trước khi đỗ xe là bao lâu?",
            answers: ["Không cần", "10 giây trước", "20 giây trước", "30 giây trước"],
            correct: 1
        },
        {
            id: 6,
            question: "Khi lùi xe, bạn phải?",
            answers: ["Chỉ nhìn gương chiếu hậu", "Quay đầu quan sát", "Dùng camera lùi", "Không cần quan sát"],
            correct: 1
        },
        {
            id: 7,
            question: "Thứ tự lựa chọn bánh lái khi xoay vô lăng là?",
            answers: ["Bao thế nào cũng được", "Luôn quay từ từ", "Quay đến vị trí cần", "Vô lăng không cần quay"],
            correct: 1
        },
        {
            id: 8,
            question: "Trước khi khởi động, bạn nên kiểm tra gì?",
            answers: ["Nước làm mát", "Dầu nhớt", "Áp suất lốp", "Tất cả những điều trên"],
            correct: 3
        },
        {
            id: 9,
            question: "Khoảng cách an toàn khi đỗ xe cạnh vỉa hè là bao nhiêu?",
            answers: ["10cm", "20cm", "30cm", "50cm"],
            correct: 2
        },
        {
            id: 10,
            question: "Cách giữ lốp xe bền lâu nhất là?",
            answers: ["Lái mạnh", "Lái từ từ và ổn định", "Phanh gấp", "Không cần quan tâm"],
            correct: 1
        }
    ]
};
