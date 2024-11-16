/* 1. 선택자와 변수 정의 부분 */
const intervalInput = document.getElementById("interval");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const startWorkInput = document.getElementById("startWork");
const endWorkInput = document.getElementById("endWork");
const lunchStartInput = document.getElementById("lunchStart");
const lunchEndInput = document.getElementById("lunchEnd");
const countdownDisplay = document.getElementById("countdown");

// 현재 시각 표시 요소 생성 및 DOM에 추가
const currentTimeDisplay = document.createElement("p");
currentTimeDisplay.classList.add("text-sm", "text-gray-700", "mb-2");
countdownDisplay.insertAdjacentElement("beforebegin", currentTimeDisplay); // "남은 시간" 위에 현재 시각 표시

let timer, countdownTimer, currentTimeTimer;

/* 2. 함수 정의 부분 */

// 근무 시간과 점심 시간 검사 함수
function isWithinWorkHours(now) {
  const startWork = parseTime(startWorkInput.value);
  const endWork = parseTime(endWorkInput.value);
  const lunchStart = parseTime(lunchStartInput.value);
  const lunchEnd = parseTime(lunchEndInput.value);

  return (
    now >= startWork && now < endWork && (now < lunchStart || now >= lunchEnd)
  );
}

// 알림 시작 함수에서 Notification 생성 코드 수정
function startReminder() {
  const intervalMinutes = parseInt(intervalInput.value); // 입력된 간격 (분) 가져오기
  const interval = intervalMinutes * 60 * 1000; // 밀리초 단위로 변환
  const now = new Date();

  // 근무 시간 외일 때 알림 시작 못하게 하기
  if (!isWithinWorkHours(now)) {
    alert("It's not work hours. Reminder cannot be started.");
    return;
  }

  // 알림 시작
  scheduleNextAlert(interval);
  timer = setInterval(() => {
    const current = new Date();
    if (isWithinWorkHours(current)) {
      showAlertModal();

      // 알림 생성 (페이지 링크, 이미지, 소리 재생 포함)
      const notification = new Notification(
        "🚶‍♀️ Take a break and stretch your posture!",
        {
          body: "Come back to the page to stop the reminder.",
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827340.png", // 무료 벨 아이콘
        }
      );

      // 알림 클릭 시 현재 페이지로 이동
      notification.onclick = function () {
        window.open("https://work-alarmi.vercel.app/", "_blank");
      };

      // 알림 발생 시 소리 재생
      const audio = new Audio("./relax-message-tone.mp3"); // 소리 파일 URL
      audio.play();

      scheduleNextAlert(interval);
    }
  }, interval);

  startBtn.disabled = true;
  stopBtn.disabled = false;
  updateCurrentTime(); // 현재 시각 업데이트 시작
}

// 알림 중지 함수
function stopReminder() {
  console.log("stopReminder called");
  clearInterval(timer);
  clearInterval(countdownTimer);
  clearInterval(currentTimeTimer); // 현재 시각 업데이트 중지
  startBtn.disabled = false;
  stopBtn.disabled = true;
  countdownDisplay.textContent = "Time until next reminder: --:--";
}

// 모달 표시 함수
function showAlertModal() {
  alertModal.classList.remove("hidden");
  setTimeout(() => {
    alertModal.classList.add("hidden");
  }, 3000);
}

// 남은 시간 표시 및 카운트다운 업데이트 함수
function scheduleNextAlert(interval) {
  const now = new Date();
  startCountdown(interval);
}

// 카운트다운 표시 업데이트 함수
function startCountdown(interval) {
  clearInterval(countdownTimer);
  const endTime = Date.now() + interval;

  countdownTimer = setInterval(() => {
    const remainingTime = endTime - Date.now();
    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      countdownDisplay.textContent = "Time until next reminder: 00:00";
    } else {
      const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      countdownDisplay.textContent = `Time until next reminder: ${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }, 1000);
}

// 현재 시각 실시간 업데이트 함수
function updateCurrentTime() {
  clearInterval(currentTimeTimer);
  currentTimeTimer = setInterval(() => {
    const now = new Date();
    currentTimeDisplay.textContent = `${currentTime}: ${now.toLocaleTimeString()}`;
  }, 1000);
}

// 시간 파싱 함수 (HH:MM 형식)
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const time = new Date();
  time.setHours(hours, minutes, 0, 0);
  return time;
}

// 로컬 스토리지에 저장하는 함수
function saveSettingsToLocalStorage() {
  localStorage.setItem("interval", intervalInput.value);
  localStorage.setItem("startWork", startWorkInput.value);
  localStorage.setItem("endWork", endWorkInput.value);
  localStorage.setItem("lunchStart", lunchStartInput.value);
  localStorage.setItem("lunchEnd", lunchEndInput.value);
}

// 로컬 스토리지에서 설정값 불러오기
function loadSettingsFromLocalStorage() {
  if (localStorage.getItem("interval")) {
    intervalInput.value = localStorage.getItem("interval");
  }
  if (localStorage.getItem("startWork")) {
    startWorkInput.value = localStorage.getItem("startWork");
  }
  if (localStorage.getItem("endWork")) {
    endWorkInput.value = localStorage.getItem("endWork");
  }
  if (localStorage.getItem("lunchStart")) {
    lunchStartInput.value = localStorage.getItem("lunchStart");
  }
  if (localStorage.getItem("lunchEnd")) {
    lunchEndInput.value = localStorage.getItem("lunchEnd");
  }
}

/* 3-1. DOMContentLoaded 이벤트 발생 시 실행되는 함수 */
function setupEventListeners() {
  console.log("Event listeners set up");

  // 시작 버튼 이벤트 설정
  startBtn.addEventListener("click", () => {
    if (Notification.permission === "granted") {
      startReminder();
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          startReminder();
        } else {
          alert("Notification permission is required!");
        }
      });
    }
  });

  // 알림 중지 버튼에 이벤트 추가
  if (stopBtn) {
    stopBtn.addEventListener("click", stopReminder);
    console.log("Stop button event added");
  } else {
    console.error("Stop button not found");
  }

  // 로컬 스토리지에서 설정값 불러오기
  loadSettingsFromLocalStorage();

  // 항상 현재 시각을 표시하기 위해 현재 시각 업데이트 함수 호출
  updateCurrentTime();
}

/* 3-2. DOMContentLoaded 이벤트 핸들링 (간결하게) */
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
});

// 페이지에서 값이 변경될 때마다 로컬 스토리지에 저장
startWorkInput.addEventListener("change", saveSettingsToLocalStorage);
endWorkInput.addEventListener("change", saveSettingsToLocalStorage);
lunchStartInput.addEventListener("change", saveSettingsToLocalStorage);
lunchEndInput.addEventListener("change", saveSettingsToLocalStorage);
intervalInput.addEventListener("change", saveSettingsToLocalStorage);
