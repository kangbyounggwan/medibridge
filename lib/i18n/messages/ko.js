// 번역의 기준이 되는 원문. 다른 언어는 이 키 구조를 그대로 따른다.
const ko = {
  language: { title: "언어" },
  exitHint: "한 번 더 누르면 앱이 종료됩니다",

  nav: {
    home: "홈",
    consult: "AI 상담",
    hospitals: "병원",
    emergency: "응급실",
  },

  title: {
    home: "MediBridge",
    chat: "AI 상담",
    hospitalList: "병원 찾기",
    hospitalChat: "병원 상담",
    emergency: "응급실 찾기",
  },

  common: {
    back: "뒤로 가기",
    retry: "다시 시도",
    loadMore: "더 보기",
    loadingMore: "불러오는 중...",
    noticeTitle: "안내사항",
  },

  home: {
    heroA: "한국거주 외국인들을 위한",
    heroHighlight: "AI 병원",
    heroB: "연결 플랫폼",
    subtitle: "AI-based Hospital Linking Platform for Foreigners in Korea",
    consultTitle: "AI 상담 시작하기",
    consultDesc: "증상을 입력하면 AI가 안내해 드려요",
    hospitalTitle: "병원 찾기",
    hospitalDesc: "내 주변 병원 목록",
    emergencyTitle: "응급실",
    emergencyDesc: "지금 갈 수 있는 곳",
    clinicTitle: "병원을 운영하시나요?",
    clinicDesc: "병원 등록하고 월간 리포트 받아보기",
  },

  chat: {
    subtitle: "증상을 입력하시면 AI가 상담을 도와드립니다.",
    disclaimer:
      "정확한 진단을 위해서는 반드시 의료진의 진료를 받으시기 바랍니다.",
    label: "증상을 자세히 설명해주세요",
    placeholder: "예: 어제부터 머리가 아프고 열이 나며, 기침도 심해요...",
    submit: "AI 상담 받기",
    submitting: "상담 중...",
    clear: "초기화",
    errorTitle: "오류",
    emptyError: "증상을 입력해주세요.",
    resultTitle: "AI 상담 결과",
    sourceTitle: "참고 자료",
    warningTitle: "중요한 안내",
    warning1: "이 상담은 참고용이며 의학적 진단을 대체할 수 없습니다.",
    warning2:
      "심각한 증상이거나 응급상황이 의심되면 즉시 119에 신고하거나 응급실을 방문하세요.",
    warning3:
      "정확한 진단과 치료를 위해 반드시 의료진의 진료를 받으시기 바랍니다.",
    nextTitle: "당신의 주변의 병원을 추천해드릴까요?",
    nextLink: "네! 추천해주세요",
  },

  hospitals: {
    symptomsTitle: "상담받은 증상",
    count: "반경 {km}km 내 {count}곳",
    loading: "주변 병원을 찾는 중...",
    locationError: "위치를 확인할 수 없습니다. 위치 권한을 허용해주세요.",
    networkError: "병원 정보를 가져오지 못했습니다. 연결을 확인해주세요.",
    empty: "반경 {km}km 안에 등록된 병원이 없습니다.",
    refind: "다시 찾기",
    notice1: "병원 정보는 실시간으로 변경될 수 있습니다.",
    notice2: "진료 시간 및 예약 가능 여부를 미리 확인하세요.",
    notice3: "응급상황 시에는 119에 신고하세요.",
  },

  emergency: {
    callTitle: "119 전화하기",
    callDesc: "생명이 위급하면 먼저 신고하세요",
    nearby: "가까운 응급실",
    count: "반경 {km}km 내 {count}곳",
    loading: "가까운 응급실을 찾는 중...",
    locationError: "위치를 확인할 수 없습니다. 위치 권한을 허용해주세요.",
    networkError: "응급실 정보를 가져오지 못했습니다. 연결을 확인해주세요.",
    empty: "반경 {km}km 안에 응급의료기관이 없습니다.",
    refind: "다시 찾기",
    pendingHint:
      "승인이 완료되면 자동으로 목록이 표시됩니다. 그전까지는 위의 119 신고를 이용해주세요.",
    notice1: "가용 병상은 실시간으로 달라질 수 있습니다.",
    notice2: "이동 전 응급실에 전화로 확인하는 것이 안전합니다.",
    notice3: "의식이 없거나 출혈이 심하면 이동하지 말고 119에 신고하세요.",
  },

  hospitalChat: {
    loadingHospital: "병원 정보를 불러오는 중입니다...",
    placeholder: "궁금한 점을 입력해주세요...",
    inputLabel: "메시지 입력",
    send: "전송",
    reserve: "네, 예약할게요",
    kakao: "카톡으로 알림받기",
    kakaoDone: "카톡 알림이 설정되었습니다!",
    reserveTitle: "예약 선택",
    datetime: "날짜와 시간을 선택하세요",
    cancel: "취소",
    confirm: "예약 완료",
    greeting: "안녕하세요! {name}입니다.",
    specialties: "저희는 {list} 분야를 전문으로 하고 있습니다.",
    typeIs: "저희는 {type}입니다.",
    doctor: "{doctor}이 진료를 담당하고 있습니다.",
    hours: "진료시간: {hours}",
    symptomNote: 'AI 상담을 통해 "{symptoms}" 증상으로 방문해주시는군요.',
    askAnything: "궁금한 점이 있으시면 언제든 문의해주세요!",
    fallback: "죄송합니다. 해당 질문에 대한 답변은 준비되어 있지 않습니다.",
  },
};

export default ko;
