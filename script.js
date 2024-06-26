document.addEventListener("DOMContentLoaded", () => {
    let loadProgress = 0;
    const loadingBar = document.getElementById('loadingBar');
    const splashScreen = document.getElementById('splashScreen');
    const timeElement = document.getElementById('time');

    function updateLoadingScreen() {
        loadProgress += 1;
        loadingBar.style.width = loadProgress + '%';
        if (loadProgress >= 100) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
                document.getElementById('gameContent').style.display = 'block';
            }, 500);
        }
    }

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateLoadingScreen, 300);
    setInterval(updateTime, 1000);
    // Initial Variables
    let coins = parseFloat(localStorage.getItem("coins")) || 0;
    let coinsPerClick = 0.08;
    let autoclickerCost = parseFloat(localStorage.getItem("autoclickerCost")) || 500;
    let autoclickerCount = parseInt(localStorage.getItem("autoclickerCount")) || 0;
    let autoclickerIncome = parseFloat(localStorage.getItem("autoclickerIncome")) || 0.1;
    let autoclickerUpgradeCost = parseFloat(localStorage.getItem("autoclickerUpgradeCost")) || 250;
    let upgrade1Cost = parseFloat(localStorage.getItem("upgrade1Cost")) || 50;
    let upgrade2Cost = parseFloat(localStorage.getItem("upgrade2Cost")) || 150;
    let bonusCooldown = 3600; // 1 hour in seconds
    let codeCooldown = 86400; // 24 hours in seconds
    let lastBonusTime = parseInt(localStorage.getItem("lastBonusTime")) || 0;
    let lastCodeTime = parseInt(localStorage.getItem("lastCodeTime")) || 0;
    let offlineEarnings = 0;

    // HTML Elements
    const mainGame = document.getElementById("mainGame");
    const store = document.getElementById("store");
    const gifts = document.getElementById("gifts");
    const stats = document.getElementById("stats");
    const offlineEarningsScreen = document.getElementById("offlineEarnings");
    const coinCounter = document.getElementById("coinCounter");
    const clickButton = document.getElementById("clickButton");
    const storeButton = document.getElementById("storeButton");
    const giftButton = document.getElementById("giftButton");
    const statsButton = document.getElementById("statsButton");
    const bonusButton = document.getElementById("bonusButton");
    const codeButton = document.getElementById("codeButton");
    const codeInput = document.getElementById("codeInput");
    const bonusTimer = document.getElementById("bonusTimer");
    const bonusTime = document.getElementById("bonusTime");
    const codeTimer = document.getElementById("codeTimer");
    const codeTime = document.getElementById("codeTime");
    const offlineCoins = document.getElementById("offlineCoins");
    const resetButton = document.getElementById("resetButton");
    const clickIncome = document.getElementById("clickIncome");
    const autoclickerIncomeText = document.getElementById("autoclickerIncome");

    const buyAutoclicker = document.getElementById("buyAutoclicker");
    const upgradeAutoclicker = document.getElementById("upgradeAutoclicker");
    const buyUpgrade1 = document.getElementById("buyUpgrade1");
    const buyUpgrade2 = document.getElementById("buyUpgrade2");

    const closeStore = document.getElementById("closeStore");
    const closeGifts = document.getElementById("closeGifts");
    const closeStats = document.getElementById("closeStats");
    const closeOfflineEarnings = document.getElementById("closeOfflineEarnings");

    // Functions
    function updateCoinCounter() {
        coinCounter.textContent = coins.toFixed(2);
    }

    function saveData() {
        localStorage.setItem("coins", coins);
        localStorage.setItem("autoclickerCost", autoclickerCost);
        localStorage.setItem("autoclickerCount", autoclickerCount);
        localStorage.setItem("autoclickerIncome", autoclickerIncome);
        localStorage.setItem("autoclickerUpgradeCost", autoclickerUpgradeCost);
        localStorage.setItem("upgrade1Cost", upgrade1Cost);
        localStorage.setItem("upgrade2Cost", upgrade2Cost);
    }

    function resetData() {
        coins = 0;
        coinsPerClick = 0.08;
        autoclickerCost = 500;
        autoclickerCount = 0;
        autoclickerIncome = 0.1;
        autoclickerUpgradeCost = 250;
        upgrade1Cost = 50;
        upgrade2Cost = 150;
        saveData();
        updateCoinCounter();
    }

    function checkOfflineEarnings() {
        let lastOnline = parseInt(localStorage.getItem("lastOnline"));
        if (lastOnline) {
            let offlineTime = Math.min(10800, Math.floor((Date.now() - lastOnline) / 1000)); // max 3 hours
            offlineEarnings = offlineTime * autoclickerCount * autoclickerIncome;
            if (offlineEarnings > 0) {
                offlineCoins.textContent = offlineEarnings.toFixed(1);
                offlineEarningsScreen.style.display = "flex";
                mainGame.style.display = "none";
                coins += offlineEarnings;
                updateCoinCounter();
            }
        }
        localStorage.setItem("lastOnline", Date.now());
    }

    // Event Listeners
    clickButton.addEventListener("click", () => {
        coins += coinsPerClick;
        updateCoinCounter();
        saveData();
    });

    storeButton.addEventListener("click", () => {
        store.style.display = "flex";
    });

    closeStore.addEventListener("click", () => {
        store.style.display = "none";
    });

    giftButton.addEventListener("click", () => {
        gifts.style.display = "flex";
    });

    closeGifts.addEventListener("click", () => {
        gifts.style.display = "none";
    });

    statsButton.addEventListener("click", () => {
        stats.style.display = "flex";
        clickIncome.textContent = coinsPerClick.toFixed(2);
        autoclickerIncomeText.textContent = (autoclickerCount * autoclickerIncome).toFixed(2);
    });

    closeStats.addEventListener("click", () => {
        stats.style.display = "none";
    });

    closeOfflineEarnings.addEventListener("click", () => {
        offlineEarningsScreen.style.display = "none";
        mainGame.style.display = "flex";
    });

    buyAutoclicker.addEventListener("click", () => {
        if (coins >= autoclickerCost) {
            coins -= autoclickerCost;
            autoclickerCount++;
            autoclickerCost *= 1.2;
            updateCoinCounter();
            saveData();
        }
    });

    upgradeAutoclicker.addEventListener("click", () => {
        if (coins >= autoclickerUpgradeCost) {
            coins -= autoclickerUpgradeCost;
            autoclickerIncome += 0.1;
            autoclickerUpgradeCost *= 1.5;
            updateCoinCounter();
            saveData();
        }
    });

    buyUpgrade1.addEventListener("click", () => {
        if (coins >= upgrade1Cost) {
            coins -= upgrade1Cost;
            coinsPerClick += 0.02;
            upgrade1Cost *= 1.3;
            updateCoinCounter();
            saveData();
        }
    });

    buyUpgrade2.addEventListener("click", () => {
        if (coins >= upgrade2Cost) {
            coins -= upgrade2Cost;
            autoclickerIncome += 0.5;
            upgrade2Cost *= 1.7;
            updateCoinCounter();
            saveData();
        }
    });

    bonusButton.addEventListener("click", () => {
        if (Date.now() - lastBonusTime >= bonusCooldown * 1000) {
            coins += 10;
            lastBonusTime = Date.now();
            localStorage.setItem("lastBonusTime", lastBonusTime);
            bonusTimer.classList.remove("hidden");
            bonusButton.disabled = true;
            updateCoinCounter();
            saveData();
        }
    });

    codeButton.addEventListener("click", () => {
        if (codeInput.value === "bonus" && Date.now() - lastCodeTime >= codeCooldown * 1000) {
            coins += 30;
            lastCodeTime = Date.now();
            localStorage.setItem("lastCodeTime", lastCodeTime);
            codeTimer.classList.remove("hidden");
            codeButton.disabled = true;
            updateCoinCounter();
            saveData();
        }
    });

    resetButton.addEventListener("click", () => {
        resetData();
        localStorage.setItem("lastBonusTime", lastBonusTime);
        localStorage.setItem("lastCodeTime", lastCodeTime);
        alert("Все данные сброшены, кроме времени бонуса и кода.");
    });

    setInterval(() => {
        coins += autoclickerCount * autoclickerIncome;
        updateCoinCounter();
        saveData();
    }, 1000);

    setInterval(() => {
        if (Date.now() - lastBonusTime < bonusCooldown * 1000) {
            let timeLeft = Math.ceil(bonusCooldown - (Date.now() - lastBonusTime) / 1000);
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            bonusTime.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        } else {
            bonusTimer.classList.add("hidden");
            bonusButton.disabled = false;
        }

        if (Date.now() - lastCodeTime < codeCooldown * 1000) {
            let timeLeft = Math.ceil(codeCooldown - (Date.now() - lastCodeTime) / 1000);
            let hours = Math.floor(timeLeft / 3600);
            let minutes = Math.floor((timeLeft % 3600) / 60);
            let seconds = timeLeft % 60;
            codeTime.textContent = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        } else {
            codeTimer.classList.add("hidden");
            codeButton.disabled = false;
        }
    }, 1000);

    window.addEventListener("beforeunload", () => {
        localStorage.setItem("lastOnline", Date.now());
    });

    // Initial Load
    checkOfflineEarnings();
    updateCoinCounter();
});
