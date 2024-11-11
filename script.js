/* 1. 선택자와 변수 정의 부분 */
const intervalInput = document.getElementById("interval");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const startWorkInput = document.getElementById("startWork");
const endWorkInput = document.getElementById("endWork");
const lunchStartInput = document.getElementById("lunchStart");
const lunchEndInput = document.getElementById("lunchEnd");
const nextAlertDisplay = document.getElementById("nextAlert");
const countdownDisplay = document.getElementById("countdown");
const alertModal = document.getElementById("alertModal");

let timer, countdownTimer;

/* 2. 함수 정의 부분 */
// 알림 시작
function startReminder() {
  const interval = parseInt(intervalInput.value) * 60 * 1000;
  if (isNaN(interval) || interval <= 0) {
    alert("유효한 시간을 입력해 주세요!");
    return;
  }

  localStorage.setItem("interval", intervalInput.value); // 설정된 시간 저장
  scheduleNextAlert(interval);

  // 주기적으로 알림 설정
  timer = setInterval(() => {
    const now = new Date();
    const startWork = parseTime(startWorkInput.value);
    const endWork = parseTime(endWorkInput.value);
    const lunchStart = parseTime(lunchStartInput.value);
    const lunchEnd = parseTime(lunchEndInput.value);

    if (
      now >= startWork &&
      now <= endWork &&
      (now < lunchStart || now > lunchEnd)
    ) {
      showAlertModal();
      new Notification("🚶‍♀️ 잠시 자리에서 자세를 고쳐앉고 리프레쉬 해줍시다!");
    }

    scheduleNextAlert(interval);
  }, interval);

  startBtn.disabled = true;
  stopBtn.disabled = false;
}

// 알림 중지
function stopReminder() {
  clearInterval(timer);
  clearInterval(countdownTimer);
  startBtn.disabled = false;
  stopBtn.disabled = true;
  nextAlertDisplay.textContent = "다음 알림 시각: --:--";
  countdownDisplay.textContent = "남은 시간: --:--";
}

// 모달 표시 함수
function showAlertModal() {
  alertModal.classList.remove("hidden");
  setTimeout(() => {
    alertModal.classList.add("hidden");
  }, 3000);
}

// 다음 알림 시각 설정
function scheduleNextAlert(interval) {
  const now = new Date();
  const nextAlert = new Date(now.getTime() + interval);

  nextAlertDisplay.textContent = `다음 알림 시각: ${nextAlert.toLocaleTimeString()}`;
  startCountdown(interval);
}

// 카운트다운 표시 업데이트
function startCountdown(interval) {
  clearInterval(countdownTimer);
  const endTime = Date.now() + interval;

  countdownTimer = setInterval(() => {
    const remainingTime = endTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      countdownDisplay.textContent = "남은 시간: 00:00";
    } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      countdownDisplay.textContent = `남은 시간: ${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }, 1000);
}

// 시간 파싱 함수 (HH:MM 형식)
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return time;
}

/* 3-1. DOMContentLoaded 이벤트 발생 시 실행되는 함수 */
function setupEventListeners() {
  startBtn.addEventListener("click", () => {
    if (Notification.permission === "granted") {
      startReminder();
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          startReminder();
        } else {
          alert("알림 권한이 필요합니다!");
        }
      });
    }
  });

  stopBtn.addEventListener("click", stopReminder);

  // 저장된 알림 간격 불러오기
  if (localStorage.getItem("interval")) {
    intervalInput.value = localStorage.getItem("interval");
  }
}

/* 3-2. DOMContentLoaded 이벤트 핸들링 (간결하게) */
document.addEventListener("DOMContentLoaded", setupEventListeners);
