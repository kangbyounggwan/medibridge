const vi = {
  language: { title: "Ngôn ngữ" },
  exitHint: "Nhấn lần nữa để thoát ứng dụng",

  nav: {
    home: "Trang chủ",
    consult: "Tư vấn AI",
    hospitals: "Phòng khám",
    emergency: "Cấp cứu",
  },

  title: {
    home: "MediBridge",
    chat: "Tư vấn y tế AI",
    hospitalList: "Tìm phòng khám",
    hospitalChat: "Trao đổi với phòng khám",
    emergency: "Tìm phòng cấp cứu",
  },

  common: {
    back: "Quay lại",
    retry: "Thử lại",
    loadMore: "Xem thêm",
    loadingMore: "Đang tải...",
    noticeTitle: "Lưu ý",
  },

  home: {
    heroA: "Dành cho người nước ngoài sống tại Hàn Quốc,",
    heroHighlight: "nền tảng AI",
    heroB: "kết nối bệnh viện",
    subtitle: "AI-based Hospital Linking Platform for Foreigners in Korea",
    consultTitle: "Bắt đầu tư vấn AI",
    consultDesc: "Nhập triệu chứng, AI sẽ hướng dẫn bạn",
    hospitalTitle: "Tìm phòng khám",
    hospitalDesc: "Phòng khám gần bạn",
    emergencyTitle: "Cấp cứu",
    emergencyDesc: "Nơi bạn có thể đến ngay",
    clinicTitle: "Bạn đang điều hành phòng khám?",
    clinicDesc: "Đăng ký và nhận báo cáo hằng tháng",
  },

  chat: {
    subtitle: "Hãy nhập triệu chứng, AI sẽ hỗ trợ tư vấn cho bạn.",
    disclaimer:
      "Để được chẩn đoán chính xác, bạn nhất định phải đến khám tại cơ sở y tế.",
    label: "Vui lòng mô tả chi tiết triệu chứng",
    placeholder:
      "Ví dụ: Từ hôm qua tôi bị đau đầu, sốt và ho nhiều...",
    submit: "Nhận tư vấn AI",
    submitting: "Đang tư vấn...",
    clear: "Xóa",
    errorTitle: "Lỗi",
    emptyError: "Vui lòng nhập triệu chứng.",
    resultTitle: "Kết quả tư vấn AI",
    sourceTitle: "Tài liệu tham khảo",
    warningTitle: "Lưu ý quan trọng",
    warning1:
      "Nội dung tư vấn chỉ mang tính tham khảo và không thay thế chẩn đoán y khoa.",
    warning2:
      "Nếu triệu chứng nghiêm trọng hoặc nghi ngờ cấp cứu, hãy gọi 119 hoặc đến phòng cấp cứu ngay.",
    warning3:
      "Để được chẩn đoán và điều trị chính xác, bạn nhất định phải đến khám tại cơ sở y tế.",
    nextTitle: "Bạn có muốn xem các phòng khám gần đây không?",
    nextLink: "Có, hãy gợi ý cho tôi",
  },

  hospitals: {
    symptomsTitle: "Triệu chứng đã tư vấn",
    count: "{count} nơi trong bán kính {km}km",
    loading: "Đang tìm phòng khám gần đây...",
    locationError:
      "Không thể xác định vị trí. Vui lòng cho phép quyền truy cập vị trí.",
    networkError:
      "Không tải được thông tin phòng khám. Vui lòng kiểm tra kết nối.",
    empty: "Không có phòng khám nào được đăng ký trong bán kính {km}km.",
    refind: "Tìm lại",
    notice1: "Thông tin phòng khám có thể thay đổi bất cứ lúc nào.",
    notice2: "Hãy kiểm tra trước giờ khám và khả năng đặt lịch.",
    notice3: "Trong trường hợp khẩn cấp, hãy gọi 119.",
  },

  emergency: {
    callTitle: "Gọi 119",
    callDesc: "Nếu nguy hiểm đến tính mạng, hãy gọi trước",
    nearby: "Phòng cấp cứu gần đây",
    count: "{count} nơi trong bán kính {km}km",
    loading: "Đang tìm phòng cấp cứu gần đây...",
    locationError:
      "Không thể xác định vị trí. Vui lòng cho phép quyền truy cập vị trí.",
    networkError:
      "Không tải được thông tin phòng cấp cứu. Vui lòng kiểm tra kết nối.",
    empty: "Không có cơ sở cấp cứu nào trong bán kính {km}km.",
    refind: "Tìm lại",
    pendingHint:
      "Danh sách sẽ hiển thị tự động khi được phê duyệt. Trong thời gian đó, vui lòng dùng nút gọi 119 ở trên.",
    notice1: "Số giường trống thay đổi theo thời gian thực.",
    notice2: "Nên gọi điện xác nhận với phòng cấp cứu trước khi di chuyển.",
    notice3:
      "Nếu người bệnh bất tỉnh hoặc chảy máu nhiều, đừng di chuyển — hãy gọi 119.",
  },

  hospitalChat: {
    loadingHospital: "Đang tải thông tin phòng khám...",
    placeholder: "Nhập câu hỏi của bạn...",
    inputLabel: "Nhập tin nhắn",
    send: "Gửi",
    reserve: "Vâng, tôi muốn đặt lịch",
    kakao: "Nhận thông báo qua KakaoTalk",
    kakaoDone: "Đã thiết lập thông báo KakaoTalk.",
    reserveTitle: "Chọn lịch hẹn",
    datetime: "Chọn ngày và giờ",
    cancel: "Hủy",
    confirm: "Hoàn tất đặt lịch",
    greeting: "Xin chào, đây là {name}.",
    specialties: "Chúng tôi chuyên về {list}.",
    typeIs: "Chúng tôi là {type}.",
    doctor: "{doctor} phụ trách khám chữa bệnh.",
    hours: "Giờ khám: {hours}",
    symptomNote:
      'Chúng tôi thấy bạn đến khám với triệu chứng "{symptoms}" từ tư vấn AI.',
    askAnything: "Nếu có thắc mắc, hãy hỏi chúng tôi bất cứ lúc nào!",
    fallback: "Xin lỗi, chúng tôi chưa có câu trả lời cho câu hỏi này.",
  },
};

export default vi;
