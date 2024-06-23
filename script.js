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

        // Основная логика игры
        let coins = parseFloat(localStorage.getItem('coins')) || 0;
        let autoClickerCount = parseInt(localStorage.getItem('autoClickerCount')) || 0;
        let autoClickerRate = parseFloat(localStorage.getItem('autoClickerRate')) || 0.1;
        let clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.1;
        let lastBonusTime = parseInt(localStorage.getItem('lastBonusTime')) || 0;
        let lastCodeTime = parseInt(localStorage.getItem('lastCodeTime')) || 0;
        let lastOnlineTime = parseInt(localStorage.getItem('lastOnlineTime')) || Date.now();
        let isResetting = false;

        const bonusCooldown = 60 * 60 * 1000;
        const codeCooldown = 24 * 60 * 60 * 1000;
        const maxOfflineEarningsTime = 3 * 60 * 60 * 1000;

        document.getElementById('clicker').addEventListener('click', () => {
            coins += clickValue;
            updateCoins();
        });

        document.getElementById('shop').addEventListener('click', () => {
            document.getElementById('shopModal').style.display = 'flex';
        });

        document.getElementById('reset').addEventListener('click', () => {
            resetGame();
        });

        document.getElementById('gifts').addEventListener('click', () => {
            document.getElementById('giftsModal').style.display = 'flex';
        });

        document.getElementById('claimBonus').addEventListener('click', claimBonus);
        document.getElementById('codeSubmit').addEventListener('click', submitCode);
        document.getElementById('closeOfflineEarnings').addEventListener('click', closeOfflineEarningsModal);

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
            if (coins >= 10) {
                coins -= 10;
                autoClickerCount++;
                updateCoins();
                saveGame();
            }
        }

        function upgradeAutoClicker() {
            if (coins >= 20) {
                coins -= 20;
                autoClickerRate += 0.1;
                updateCoins();
                saveGame();
            }
        }

        function increaseClickValue() {
            if (coins >= 15) {
                coins -= 15;
                clickValue += 0.1;
                updateCoins();
                saveGame();
            }
        }

        function doubleAutoClickerEfficiency() {
            if (coins >= 30) {
                coins -= 30;
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
                bonusButton.textContent = 'Получить бонус';
            } else {
                bonusButton.disabled = true;
                const minutes = Math.floor(timeUntilBonus / (60 * 1000));
                const seconds = Math.floor((timeUntilBonus % (60 * 1000)) / 1000);
                bonusButton.textContent = `Бонус через ${minutes} мин ${seconds} сек`;
            }
        }

        function updateCodeButton() {
            const now = Date.now();
            const codeButton = document.getElementById('codeSubmit');
            const timeUntilCode = codeCooldown - (now - lastCodeTime);

            if (timeUntilCode <= 0) {
                codeButton.disabled = false;
                codeButton.textContent = 'Активировать';
            } else {
                codeButton.disabled = true;
                const hours = Math.floor(timeUntilCode / (60 * 60 * 1000));
                const minutes = Math.floor((timeUntilCode % (60 * 60 * 1000)) / (60 * 1000));
                codeButton.textContent = `Код через ${hours} ч ${minutes} мин`;
            }
        }

        function calculateOfflineEarnings() {
            const now = Date.now();
            const offlineTime = Math.min(now - lastOnlineTime, maxOfflineEarningsTime);
            const offlineEarnings = (offlineTime / 1000) * autoClickerRate * autoClickerCount;
            return offlineEarnings;
        }

        function resetGame() {
            coins = 0;
            autoClickerCount = 0;
            autoClickerRate = 0.1;
            clickValue = 0.1;
            lastBonusTime = 0;
            lastCodeTime = 0;
            isResetting = false;
            updateCoins();
            saveGame();
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

        function loadGame() {
            coins = parseFloat(localStorage.getItem('coins')) || 0;
            autoClickerCount = parseInt(localStorage.getItem('autoClickerCount')) || 0;
            autoClickerRate = parseFloat(localStorage.getItem('autoClickerRate')) || 0.1;
            clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.1;
            lastBonusTime = parseInt(localStorage.getItem('lastBonusTime')) || 0;
            lastCodeTime = parseInt(localStorage.getItem('lastCodeTime')) || 0;
            lastOnlineTime = parseInt(localStorage.getItem('lastOnlineTime')) || Date.now();

            const offlineEarnings = calculateOfflineEarnings();
            if (offlineEarnings > 0) {
                coins += offlineEarnings;
                document.getElementById('offlineEarnings').textContent = `Ваш автокликер заработал ${offlineEarnings.toFixed(1)} монет пока вы были оффлайн!`;
                document.getElementById('offlineEarningsModal').style.display = 'flex';
            }

            updateCoins();
            updateBonusButton();
            updateCodeButton();
        }

        loadGame();
        setInterval(() => {
            coins += autoClickerCount * autoClickerRate;
            updateCoins();
            saveGame();
        }, 1000);

        setInterval(updateBonusButton, 1000);
        setInterval(updateCodeButton, 1000);
