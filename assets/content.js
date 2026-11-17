// =============================================================
//  NỘI DUNG CÓ THỂ SỬA NHANH – không cần đụng vào code khác
// =============================================================
window.SITE = {
  // ---------- Thông tin liên hệ (TODO: điền) ----------
  lienHe: {
    hoTen: "[Họ tên người phụ trách]",
    chucVu: "[Chức vụ]",
    dienThoai: "[Số điện thoại]",
    email: "[Email]",
    diaChi: "Số 5 Đinh Tiên Hoàng, Phường Sài Gòn, TP. Hồ Chí Minh",
    fanpage: "https://www.facebook.com/TTCTXHTPHCM"
  },

  // ---------- Chỉ tiêu (theo Kế hoạch) ----------
  chiTieu: [
    { so: 1500, hau: "", nhan: "thiếu nhi có hoàn cảnh đặc biệt khó khăn được chăm lo Tết", icon: "be_trai_omqua" },
    { so: 1500, hau: "", nhan: "phần quà, lì xì cho học sinh, sinh viên, người lao động khó khăn", icon: "q_chongqua" },
    { so: 500, hau: "", nhan: "phần quà cho gia đình chính sách, người có công, người cao tuổi, hộ nghèo", icon: "ba_cu" },
    { so: 600, hau: "", nhan: "phần quà cho người vô gia cư, lao động mưu sinh và chiến sĩ biên giới", icon: "bo_doi" },
    { so: 3, hau: "", nhan: "sân chơi xuân cho trẻ em tại các cơ sở bảo trợ xã hội", icon: "c_dacau" },
    { so: 3.5, hau: " tỷ", nhan: "Tổng nguồn lực xã hội dự kiến vận động", icon: "b_cayled" }
  ],

  // ---------- 5 khu ngũ hành (chương trình 04) ----------
  nguHanh: [
    { ten: "Mộc", mau: "#3f9b4a", khu: "Đâm mầm hy vọng – Gieo lộc đón xuân",
      hd: ["Phố Tết gieo mầm xuân: tiểu cảnh mai, đào, cây xanh", "Xuân sáng tạo – Khéo tay đón Tết: lì xì, tò he, vẽ tranh, lồng đèn, cắm hoa", "Đổi rác lấy cây – Xuân xanh", "Lộc vàng trao tay – Triệu nụ cười: photobooth AI Smile Score, LED Digital Tree"] },
    { ten: "Hỏa", mau: "#d9452b", khu: "Thắp lửa yêu thương – Xuân sang rực rỡ",
      hd: ["Sắc xuân tuổi thơ: Vẽ điều ngày xuân, Lắc xuân may mắn, Khai xuân tinh mắt", "Gói bánh trao xuân: bánh chưng, bánh tét làm quà", "Bếp xuân ngân vang – Acoustic bên nồi bánh", "Miền ký ức – Tết trong tim tôi: trò chơi dân gian, âm thanh Tết ba miền"] },
    { ten: "Thổ", mau: "#b07a3a", khu: "Trao vị Tết nhà – Ấm tình đoàn viên",
      hd: ["\"Tết trao – Xuân đoàn viên\": khai mạc, trao 1.000 phần quà", "\"Xuân sẻ chia – Tết đong đầy\": gala, quà và lì xì cho sinh viên, người lao động đón Tết xa quê"] },
    { ten: "Kim", mau: "#d8a928", khu: "Khai xuân đón Tết – Phúc lộc trao tay",
      hd: ["Nét chữ khai xuân – Phú Quý Thọ Khang Ninh", "Chợ Tết yêu thương: gian hàng doanh nghiệp, gian hàng gây quỹ, sản phẩm người khuyết tật", "Quà xuân cho em: tiếp nhận quà cho thiếu nhi vùng sâu, vùng xa"] },
    { ten: "Thủy", mau: "#2e7fc2", khu: "Bình an hội tụ – Lan tỏa hạnh phúc",
      hd: ["Hiến máu tình nguyện", "Tâm an vạn sự an: gian hàng chăm sóc sức khỏe, tủ thuốc y tế", "Dưỡng sinh ngày Tết: trà thảo mộc, massage, ngâm chân"] }
  ],

  // ---------- Hình thức tài trợ ----------
  goi: [
    { ten: "Đơn vị Đồng tổ chức", muc: "Từ 500 triệu đồng", mau: "#e0262d", noiBat: true,
      mo: "Cùng Trung tâm tổ chức toàn bộ chuỗi 07 chương trình chăm lo Tết Đinh Mùi 2027, được ghi danh là Đơn vị đồng tổ chức trên mọi ấn phẩm và hoạt động.",
      ds: ["Ghi danh đồng tổ chức trên kế hoạch, thư mời, backdrop", "Logo vị trí trung tâm tại sân khấu chính", "02 góc check-in thương hiệu tại Phố Tết", "Phát biểu và trao quà tại chương trình"] },
    { ten: "Đơn vị Đồng hành", muc: "Mọi mức đóng góp", mau: "#ffb020",
      mo: "Đồng hành cùng một hoặc nhiều chương trình theo khả năng của đơn vị, quyền lợi tương xứng với nội dung tài trợ.",
      ds: ["Kinh phí, phần quà, lì xì, học bổng, xe đạp", "Hiện vật: nhu yếu phẩm, bánh kẹo, quần áo, đồ dùng học tập, thuốc", "Sản phẩm của đơn vị làm quà tặng", "Thiết kế, thi công góc xuân / gian hàng tại Phố Tết"] }
  ],

  // Ma trận quyền lợi: cột theo thứ tự quyenLoiCot
  quyenLoiCot: ["Quyền lợi", "Đồng tổ chức", "Đồng hành"],
  quyenLoi: [
    ["Ghi danh \"Đơn vị đồng tổ chức\" trên kế hoạch, thư mời, backdrop", "✓", "—"],
    ["Logo trên backdrop sân khấu các chương trình", "Lớn nhất, vị trí trung tâm", "Theo nội dung tài trợ"],
    ["Logo trên pano \"Phố Tết gieo mầm xuân\" (20/01 – 10/02/2027)", "✓", "✓"],
    ["Góc check-in / gian hàng mang nhận diện thương hiệu tại mặt tiền", "02 góc", "Khi đăng ký trang trí góc xuân"],
    ["Gian hàng tại \"Chợ Tết yêu thương\" (23 – 24/01/2027)", "✓", "Theo đăng ký"],
    ["Đại diện lên sân khấu", "Phát biểu và trao quà", "Trao quà"],
    ["Nhận diện trên thiệp \"Lộc Xuân\" của photobooth AI Smile Score", "✓", "—"],
    ["Bài viết cảm ơn trên fanpage Trung tâm", "Bài riêng", "Bài chung"],
    ["Logo trên website hồ sơ và video tổng kết", "✓", "✓"],
    ["Nhận hoa, thư cảm ơn và giấy chứng nhận đồng hành", "✓", "✓"]
  ],

  // ---------- Lộ trình ----------
  loTrinh: [
    { ngay: "Trước 11/11/2026", viec: "Ban hành kế hoạch, xây dựng kế hoạch chi tiết từng chương trình" },
    { ngay: "15/11/2026 – 05/01/2027", viec: "Vận động nguồn lực, tiếp nhận đăng ký, chốt danh sách đối tượng" },
    { ngay: "20 – 21/12/2026", viec: "Chuyến xe tử tế · Cà Mau" },
    { ngay: "08 – 10/01/2027", viec: "Hành trình hoa nhân ái – Xuân biên giới · Đắk Lắk" },
    { ngay: "09 – 17/01/2027", viec: "Sân chơi Sắc màu quanh em · 3 cơ sở bảo trợ" },
    { ngay: "20/01 – 10/02/2027", viec: "Phố Tết gieo mầm xuân tại mặt tiền Trung tâm" },
    { ngay: "23 – 24/01/2027", viec: "Triệu nụ cười – Chào xuân mới · Trung tâm CTXH Thanh niên" },
    { ngay: "30/01/2027", viec: "Tết cho người cao tuổi · TT dưỡng lão Thị Nghè" },
    { ngay: "31/01/2027", viec: "Tri ân thương binh · TT Điều dưỡng Long Đất" },
    { ngay: "01/02/2027", viec: "Tổ ấm ngày xuân · Công viên Tao Đàn" },
    { ngay: "Trước 16/02/2027", viec: "Họp rút kinh nghiệm, báo cáo kết quả và công khai tài trợ" }
  ],

  // ---------- Ảnh các năm ----------
  anh: [
    ["h_yssc_123.jpg", "Tổ ấm ngày xuân · Tao Đàn"], ["h_yssc_181.jpg", "Bữa trưa cho 2.000 trẻ em"],
    ["h_yssc_207.jpg", "Tết cho người cao tuổi"], ["h_yssc_029.jpg", "Xuân yêu thương 2026 · Thị Nghè"],
    ["h_yssc_005.jpg", "Xuân biên giới 2021"], ["h_yssc_136.jpg", "Thăm thương binh Long Đất"],
    ["h_yssc_010.jpg", "Không gian Tết truyền thống"], ["h_yssc_121.jpg", "Lì xì đầu năm cho các em"],
    ["h_yssc_173.jpg", "Niềm vui Tổ ấm ngày xuân"], ["h_yssc_206.jpg", "Gói yêu thương – Tết đong đầy"],
    ["h_hssv_115.jpg", "Xuân này xuân của tình người"], ["h_yssc_151.jpg", "Trao 600 phần quà Tết 2020"],
    ["h_yssc_186.jpg", "Các em sẵn sàng đón xuân"], ["h_yssc_209.jpg", "Sân chơi Sắc màu quanh em"],
    ["h_yssc_125.jpg", "Tổ ấm ngày xuân"], ["h_yssc_047.jpg", "Trao quà Tết"]
  ]
};
