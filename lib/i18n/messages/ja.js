const ja = {
  language: { title: "言語" },
  exitHint: "もう一度押すとアプリを終了します",

  nav: {
    home: "ホーム",
    consult: "AI相談",
    hospitals: "病院",
    emergency: "救急",
  },

  title: {
    home: "MediBridge",
    chat: "AI医療相談",
    hospitalList: "病院を探す",
    hospitalChat: "病院相談",
    emergency: "救急外来を探す",
  },

  common: {
    back: "戻る",
    retry: "再試行",
    loadMore: "もっと見る",
    loadingMore: "読み込み中...",
    noticeTitle: "ご案内",
  },

  home: {
    heroA: "韓国在住の外国人のための",
    heroHighlight: "AI病院",
    heroB: "連携プラットフォーム",
    subtitle: "AI-based Hospital Linking Platform for Foreigners in Korea",
    consultTitle: "AI相談をはじめる",
    consultDesc: "症状を入力するとAIがご案内します",
    hospitalTitle: "病院を探す",
    hospitalDesc: "近くの病院一覧",
    emergencyTitle: "救急外来",
    emergencyDesc: "今すぐ行ける場所",
    clinicTitle: "病院を運営されていますか？",
    clinicDesc: "病院を登録して月次レポートを受け取る",
  },

  chat: {
    subtitle: "症状を入力していただくとAIが相談をお手伝いします。",
    disclaimer: "正確な診断のためには、必ず医療機関を受診してください。",
    label: "症状を詳しく教えてください",
    placeholder: "例：昨日から頭が痛く熱があり、咳もひどいです...",
    submit: "AI相談を受ける",
    submitting: "相談中...",
    clear: "クリア",
    errorTitle: "エラー",
    emptyError: "症状を入力してください。",
    resultTitle: "AI相談の結果",
    sourceTitle: "参考資料",
    warningTitle: "重要なご案内",
    warning1: "この相談は参考用であり、医学的診断に代わるものではありません。",
    warning2:
      "症状が重い場合や緊急の疑いがある場合は、すぐに119へ通報するか救急外来を受診してください。",
    warning3: "正確な診断と治療のために、必ず医療機関を受診してください。",
    nextTitle: "お近くの病院をご案内しましょうか？",
    nextLink: "はい、お願いします",
  },

  hospitals: {
    symptomsTitle: "相談した症状",
    count: "半径{km}km以内に{count}件",
    loading: "近くの病院を探しています...",
    locationError: "位置情報を取得できません。位置情報の許可をお願いします。",
    networkError: "病院情報を取得できませんでした。通信環境をご確認ください。",
    empty: "半径{km}km以内に登録された病院がありません。",
    refind: "再検索",
    notice1: "病院情報はリアルタイムで変更される場合があります。",
    notice2: "診療時間と予約の可否を事前にご確認ください。",
    notice3: "緊急時は119に通報してください。",
  },

  emergency: {
    callTitle: "119に電話する",
    callDesc: "命に関わる場合はまず通報してください",
    nearby: "近くの救急外来",
    count: "半径{km}km以内に{count}件",
    loading: "近くの救急外来を探しています...",
    locationError: "位置情報を取得できません。位置情報の許可をお願いします。",
    networkError:
      "救急外来の情報を取得できませんでした。通信環境をご確認ください。",
    empty: "半径{km}km以内に救急医療機関がありません。",
    refind: "再検索",
    pendingHint:
      "承認が完了すると自動的に一覧が表示されます。それまでは上の119通報をご利用ください。",
    notice1: "利用可能な病床はリアルタイムで変わります。",
    notice2: "移動前に救急外来へ電話で確認すると安心です。",
    notice3:
      "意識がない、出血がひどい場合は動かさず119に通報してください。",
  },

  hospitalChat: {
    loadingHospital: "病院情報を読み込んでいます...",
    placeholder: "ご質問を入力してください...",
    inputLabel: "メッセージ入力",
    send: "送信",
    reserve: "はい、予約します",
    kakao: "KakaoTalkで通知を受け取る",
    kakaoDone: "KakaoTalkの通知を設定しました。",
    reserveTitle: "予約の選択",
    datetime: "日付と時間を選択してください",
    cancel: "キャンセル",
    confirm: "予約を確定",
    greeting: "こんにちは、{name}です。",
    specialties: "当院は{list}の分野を専門としています。",
    typeIs: "当院は{type}です。",
    doctor: "{doctor}が診療を担当しています。",
    hours: "診療時間：{hours}",
    symptomNote: "AI相談で「{symptoms}」の症状でお越しですね。",
    askAnything: "ご不明な点がありましたら、いつでもお問い合わせください。",
    fallback: "申し訳ありません。そのご質問への回答はご用意がありません。",
  },
};

export default ja;
