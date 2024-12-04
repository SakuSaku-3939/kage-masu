const recoveryTime = 10;
const stoneData = {
  max: 5,
  recovery: 100
};

const sandwichData = {
  max: 31,
  recovery: 10
};

const burgerData = {
  max: 30,
  recovery: 30
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const updateCurrentTime = () => {
  const currentTime = document.getElementById("currentTime");
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

const ensureNumericValue = (input) => {
  const value = input.value;
  console.log(value);
  if (isNaN(value) || value.trim() === "") {
    return 0;
  }

  return Number(value);
}

const startCalculation = () => {
  const taeget = ensureNumericValue(document.getElementById('targetStamina'));
  const current = ensureNumericValue(document.getElementById('currentStamina'));
  const stone = ensureNumericValue(document.getElementById('selectStone'));
  const sandwic = ensureNumericValue(document.getElementById('selectSandwich'));
  const burger = ensureNumericValue(document.getElementById('selectBurger'));
  const other = ensureNumericValue(document.getElementById('otherRecovery'));
  const currentTime = document.getElementById('currentTime').value
  const notice = document.getElementById('notice');

  let staminaOffset = taeget - (
    (stone * stoneData.recovery) +
    (sandwic * sandwichData.recovery) +
    (burger * burgerData.recovery) +
    other
  );

  if (staminaOffset > 150) {
    notice.innerHTML = `スタミナの調整値が150より上になるため<span> ${staminaOffset - 150} </span>調整してください。`;
    return;
  }

  const diff = staminaOffset - current;
  if (diff < 0) {
    notice.innerHTML = `目的のスタミナを<span> ${Math.abs(diff)} </span>超過しています。`;
    return;
  }

  const timeOffset = diff * recoveryTime;
  const currentDate = new Date(currentTime);
  currentDate.setMinutes(currentDate.getMinutes() + timeOffset);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  
  notice.innerHTML = `<span> ${timeOffset}分後</span><b>(${year}/${month}/${day} ${hours}:${minutes})</b> の <span> ${current + diff } </span>の時にスタミナの回復をしてください。`;
}

const checkInputValue = (input) => {
  const max = parseInt(input.max, 10);
  if (parseInt(input.value, 10) > max) {
    input.value = max;
  }
}

(window.onload = () => {
  const selectStone = document.getElementById('selectStone');
  const selectSandwich = document.getElementById('selectSandwich');
  const selectBurger = document.getElementById('selectBurger');
  const setupSelectData = (selectElement, data) => {
    for (let i = 1; i <= data.max; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      selectElement.appendChild(option);
    }
  }
  setupSelectData(selectStone, stoneData);
  setupSelectData(selectSandwich, sandwichData);
  setupSelectData(selectBurger, burgerData);

  updateCurrentTime();
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value.length > 1 && this.value.startsWith('0')) {
        this.value = this.value.replace(/^0+/, '');
      }
    });
  });
});