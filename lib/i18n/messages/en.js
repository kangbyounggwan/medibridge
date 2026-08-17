const en = {
  language: { title: "Language" },
  exitHint: "Press back again to exit",

  nav: {
    home: "Home",
    consult: "AI Chat",
    hospitals: "Clinics",
    emergency: "Emergency",
  },

  title: {
    home: "MediBridge",
    chat: "AI Consultation",
    hospitalList: "Find a Clinic",
    hospitalChat: "Clinic Chat",
    emergency: "Emergency Rooms",
  },

  common: {
    back: "Go back",
    retry: "Try again",
    loadMore: "Load more",
    loadingMore: "Loading...",
    noticeTitle: "Please note",
  },

  home: {
    heroA: "For foreign residents in Korea,",
    heroHighlight: "an AI hospital",
    heroB: "connection platform",
    subtitle: "AI-based Hospital Linking Platform for Foreigners in Korea",
    consultTitle: "Start AI consultation",
    consultDesc: "Describe your symptoms and AI will guide you",
    hospitalTitle: "Find a clinic",
    hospitalDesc: "Clinics near you",
    emergencyTitle: "Emergency",
    emergencyDesc: "Where you can go now",
    clinicTitle: "Do you run a clinic?",
    clinicDesc: "Register and get monthly reports",
  },

  chat: {
    subtitle: "Describe your symptoms and AI will help with a consultation.",
    disclaimer:
      "For an accurate diagnosis, you must be seen by a medical professional.",
    label: "Please describe your symptoms in detail",
    placeholder:
      "e.g. Since yesterday I have had a headache, a fever, and a bad cough...",
    submit: "Get AI consultation",
    submitting: "Consulting...",
    clear: "Clear",
    errorTitle: "Error",
    emptyError: "Please enter your symptoms.",
    resultTitle: "AI consultation result",
    sourceTitle: "References",
    warningTitle: "Important notice",
    warning1:
      "This consultation is for reference only and cannot replace a medical diagnosis.",
    warning2:
      "If your symptoms are severe or you suspect an emergency, call 119 or go to an emergency room immediately.",
    warning3:
      "For an accurate diagnosis and treatment, you must be seen by a medical professional.",
    nextTitle: "Would you like clinics near you?",
    nextLink: "Yes, show me",
  },

  hospitals: {
    symptomsTitle: "Symptoms you described",
    count: "{count} within {km}km",
    loading: "Looking for clinics nearby...",
    locationError: "Could not get your location. Please allow location access.",
    networkError: "Could not load clinics. Please check your connection.",
    empty: "No registered clinics within {km}km.",
    refind: "Search again",
    notice1: "Clinic information can change at any time.",
    notice2: "Check opening hours and availability in advance.",
    notice3: "In an emergency, call 119.",
  },

  emergency: {
    callTitle: "Call 119",
    callDesc: "If life is at risk, call first",
    nearby: "Nearby emergency rooms",
    count: "{count} within {km}km",
    loading: "Looking for emergency rooms...",
    locationError: "Could not get your location. Please allow location access.",
    networkError:
      "Could not load emergency rooms. Please check your connection.",
    empty: "No emergency facilities within {km}km.",
    refind: "Search again",
    pendingHint:
      "The list will appear automatically once access is approved. Until then, please use the 119 call above.",
    notice1: "Bed availability changes in real time.",
    notice2: "It is safer to call the emergency room before you travel.",
    notice3:
      "If the person is unconscious or bleeding heavily, do not move them — call 119.",
  },

  hospitalChat: {
    loadingHospital: "Loading clinic information...",
    placeholder: "Type your question...",
    inputLabel: "Message input",
    send: "Send",
    reserve: "Yes, book it",
    kakao: "Get KakaoTalk alerts",
    kakaoDone: "KakaoTalk alerts are set up.",
    reserveTitle: "Choose a time",
    datetime: "Select a date and time",
    cancel: "Cancel",
    confirm: "Confirm booking",
    greeting: "Hello, this is {name}.",
    specialties: "We specialise in {list}.",
    typeIs: "We are a {type}.",
    doctor: "{doctor} is in charge of consultations.",
    hours: "Opening hours: {hours}",
    symptomNote: 'We see you are visiting for "{symptoms}" from your AI consultation.',
    askAnything: "Feel free to ask us anything.",
    fallback: "Sorry, we do not have an answer prepared for that question.",
  },
};

export default en;
