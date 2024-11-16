// 변수 정의
// const startBtn = document.getElementById("startBtn");
// const stopBtn = document.getElementById("stopBtn");
const countdown = document.getElementById("countdown");
let currentTime = "";
// 언어 설정 함수
function changeLanguage(language) {
  // UI 텍스트 변경 (기존의 lang.js 내용)
  if (language === "en") {
    mainTitle.textContent = "Work Health Notificationer";
    description.textContent =
      "It is a website that notifies you so that you can change your posture at every certain time you work.";
    postureTip.textContent =
      "Correct your posture often, refresh, and work healthier!";
    workTimeInfo.textContent =
      "Notifications will start at the start of the work time.";
    offHoursInfo.textContent =
      "There are no notifications during off-hours and lunchtime.";
    intervalLabel.textContent = "Notification interval (minutes):";
    startWorkLabel.textContent = "Start of work hours:";
    endWorkLabel.textContent = "End of work hours:";
    lunchStartLabel.textContent = "Start of lunch time:";
    lunchEndLabel.textContent = "End of lunch time:";
    alertText.textContent = "Let's sit down and refresh for a while!";
    countdown.textContent = "Time of next notification: --:--";
    startBtn.textContent = "Start Notification";
    stopBtn.textContent = "Stop Notifications";
    currentTime = "Current time";
  } else if (language === "ko") {
    mainTitle.textContent = "일건강 시간 알리미";
    description.textContent =
      "이 웹사이트는 정해진 시간마다 자세를 바꿀 수 있도록 알림을 보냅니다.";
    postureTip.textContent =
      "자세를 자주 교정하고, 휴식을 취하며 건강하게 작업하세요!";
    workTimeInfo.textContent = "근무 시간 시작 시 알림이 시작됩니다.";
    offHoursInfo.textContent = "비근무 시간 및 점심시간에는 알림이 없습니다.";
    intervalLabel.textContent = "알림 간격 (분):";
    startWorkLabel.textContent = "근무 시작 시간:";
    endWorkLabel.textContent = "근무 종료 시간:";
    lunchStartLabel.textContent = "점심 시간 시작:";
    lunchEndLabel.textContent = "점심 시간 종료:";
    alertText.textContent = "잠시 앉아서 휴식을 취하세요!";
    countdown.textContent = "다음 알림 시간: --:--";
    startBtn.textContent = "알림 시작";
    stopBtn.textContent = "알림 중지";
    currentTime = "현재 시간";
  }

  // 로컬 스토리지에 저장
  localStorage.setItem("language", language);
}

// 로컬 스토리지에서 언어 설정 확인
const savedLanguage = localStorage.getItem("language");
if (savedLanguage) {
  changeLanguage(savedLanguage);
} else {
  changeLanguage("en"); // 기본 언어는 영어로 설정
}

// 언어 버튼 클릭 이벤트 리스너
langEnBtn.addEventListener("click", () => changeLanguage("en"));
langKoBtn.addEventListener("click", () => changeLanguage("ko"));
