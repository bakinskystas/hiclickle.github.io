let coins = parseFloat(localStorage.getItem('coins')) || 0;
let autoClickerCount = parseInt(localStorage.getItem('autoClickerCount')) || 0;
let autoClickerRate = parseFloat(localStorage.getItem('autoClickerRate')) || 0.1;
let clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.1;
let lastBonusTime = parseInt(localStorage.getItem('lastBonusTime')) || 0;
const bonusCooldown = 3600000; // 1 час в миллисекундах
let lastCodeTime = parseInt(localStorage.getItem('lastCodeTime')) || 0;
const codeCooldown = 86400000; // 24 часа в миллисекундах
let lastOnlineTime = parseInt(localStorage.getItem('lastOnlineTime')) || Date.now();
const maxOfflineEarningsTime = 3 * 3600000; // 3 часа в миллисекундах
let isResetting = false;

document.getElementById('clicker').addEventListener('click', () => {
    coins += clickValue;
    updateCoins();
});

document.getElementById('shop').addEventListener('click', () => {
    document.getElementById('shopModal').style.display = 'flex';
});

document.getElementById('reset').addEventListener('click', () => {
    if (!isResetting) {
        isResetting = true;
        resetGame();
    }
});

document.getElementById('gifts').addEventListener('click', () => {
    document.getElementById('giftsModal').style.display = 'flex';
});

document.getElementById('claimBonus').addEventListener('click', claimBonus);

document.getElementById('codeSubmit').addEventListener('click', submitCode);

document.getElementById('closeOfflineEarnings').addEventListener('click', closeOfflineEarningsModal);

document.getElementById('closeResetWarning').addEventListener('click', closeResetWarningModal);

function closeGiftsModal() {
    const modal = document.getElementById('giftsModalContent');
    modal.classList.add('slideOut');
    setTimeout(() => {
        modal.classList.remove('slideOut');
        document.getElementById('giftsModal').style.display = 'none';
    }, 500);
}

function closeShopModal() {
    const modal = document.getElementById('shopModalContent');
    modal.classList.add('slideOut');
    setTimeout(() => {
        modal.classList.remove('slideOut');
        document.getElementById('shopModal').style.display = 'none';
    }, 500);
}

function closeOfflineEarningsModal() {
    const modal = document.getElementById('offlineEarningsModalContent');
    modal.classList.add('slideOut');
    setTimeout(() => {
        modal.classList.remove('slideOut');
        document.getElementById('offlineEarningsModal').style.display = 'none';
    }, 500);
}

function closeResetWarningModal() {
    const modal = document.getElementById('resetWarningModalContent');
    modal.classList.add('slideOut');
    setTimeout(() => {
        modal.classList.remove('slideOut');
        document.getElementById('resetWarningModal').style.display = 'none';
    }, 500);
}

function claimBonus() {
    const now = Date.now();
    if (now - lastBonusTime >= bonusCooldown) {
        coins += 0.2;
        lastBonusTime = now;
        updateCoins();
        saveGame();
    }
}

function submitCode() {
    const now = Date.now();
    const codeInput = document.getElementById('codeInput').value;
    if (codeInput === 'bclick' && now - lastCodeTime >= codeCooldown) {
        coins += 0.5;
        lastCodeTime = now;
        updateCoins();
        saveGame();
    }
}

function buyAutoClicker() {
    if (coins >= 500) {
        coins -= 500;
        autoClickerCount++;
        updateCoins();
        saveGame();
    }
}

function upgradeAutoClicker() {
    if (coins >= 250) {
        coins -= 250;
        autoClickerRate += 0.1;
        updateCoins();
        saveGame();
    }
}

function increaseClickValue() {
    if (coins >= 100) {
        coins -= 100;
        clickValue += 0.1;
        updateCoins();
        saveGame();
    }
}

function doubleAutoClickerEfficiency() {
    if (coins >= 5000) {
        coins -= 5000;
        autoClickerRate *= 2;
        updateCoins();
        saveGame();
    }
}

function updateCoins() {
    document.getElementById('coins').textContent = coins.toFixed(1);
    localStorage.setItem('coins', coins.toFixed(1));
}

function updateBonusButton() {
    const now = Date.now();
    const bonusButton = document.getElementById('claimBonus');
    const timeUntilBonus = bonusCooldown - (now - lastBonusTime);
    if (timeUntilBonus <= 0) {
        bonusButton.disabled = false;
        document.getElementById('bonusTimer').textContent = '00:00:00';
    } else {
        bonusButton.disabled = true;
        const hours = Math.floor((timeUntilBonus % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilBonus % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilBonus % (1000 * 60)) / 1000);
        document.getElementById('bonusTimer').textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
}

function updateCodeButton() {
    const now = Date.now();
    const codeButton = document.getElementById('codeSubmit');
    const timeUntilCode = codeCooldown - (now - lastCodeTime);
    if (timeUntilCode <= 0) {
        codeButton.disabled = false;
        document.getElementById('codeTimer').textContent = '00:00:00';
    } else {
        codeButton.disabled = true;
        const hours = Math.floor((timeUntilCode % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntilCode % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeUntilCode % (1000 * 60)) / 1000);
        document.getElementById('codeTimer').textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

function autoClick() {
    coins += autoClickerCount * autoClickerRate;
    updateCoins();
}

function saveGame() {
    localStorage.setItem('coins', coins.toFixed(1));
    localStorage.setItem('autoClickerCount', autoClickerCount);
    localStorage.setItem('autoClickerRate', autoClickerRate);
    localStorage.setItem('clickValue', clickValue);
    localStorage.setItem('lastBonusTime', lastBonusTime);
    localStorage.setItem('lastCodeTime', lastCodeTime);
    localStorage.setItem('lastOnlineTime', Date.now());
}

function resetGame() {
    let resetInterval = setInterval(() => {
        if (coins > 0) {
            coins -= clickValue;
            updateCoins();
        } else {
            clearInterval(resetInterval);
            isResetting = false;
            coins = 0;
            autoClickerCount = 0;
            autoClickerRate = 0.1;
            clickValue = 0.1;
            lastBonusTime = 0;
            lastCodeTime = 0;
            lastOnlineTime = Date.now();
            updateCoins();
            saveGame();
        }
    }, 50);
}

document.addEventListener('click', (event) => {
    if (isResetting && event.target.id !== 'closeResetWarning') {
        document.getElementById('resetWarningModal').style.display = 'flex';
    }
});

function calculateOfflineEarnings() {
    const now = Date.now();
    const timeOffline = now - lastOnlineTime;
    let offlineEarnings = 0;

    if (timeOffline <= maxOfflineEarningsTime) {
        offlineEarnings = (timeOffline / 1000) * autoClickerCount * autoClickerRate;
    } else {
        offlineEarnings = (maxOfflineEarningsTime / 1000) * autoClickerCount * autoClickerRate;
    }

    if (offlineEarnings > 0) {
        coins += offlineEarnings;
        updateCoins();
        document.getElementById('offlineEarningsMessage').textContent = `Вы заработали ${offlineEarnings.toFixed(1)} монет, пока были оффлайн.`;
        document.getElementById('offlineEarningsModal').style.display = 'flex';
    }

    lastOnlineTime = now;
    saveGame();
}

setInterval(autoClick, 1000);
setInterval(updateBonusButton, 1000);
setInterval(updateCodeButton, 1000);

updateBonusButton();
updateCodeButton();
calculateOfflineEarnings();
