let count = parseFloat(localStorage.getItem('count')) || 0;
let clickValue = parseFloat(localStorage.getItem('clickValue')) || 0.1;
let autoClickerIntervalTime = 1000;
let autoClickerCoinsPerClick = 1;
let upgrades = JSON.parse(localStorage.getItem('upgrades')) || {
    '1': { cost: 50, value: 0.1, purchased: false },
    '2': { cost: 100, value: 0.5, purchased: false },
    '3': { cost: 150, value: 1, purchased: false },
    'autoclicker': { cost: 500, purchased: false },
    'autoclicker-speed': { baseCost: 100, effect: 1, count: 0, purchased: false },
    'autoclicker-coins': { baseCost: 150, effect: 2, count: 0, purchased: false }
};

const counter = document.getElementById('counter');
const updateCounter = () => {
    counter.textContent = count.toFixed(1);
};

const saveData = () => {
    localStorage.setItem('count', count);
    localStorage.setItem('clickValue', clickValue);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
};

const clickButton = document.getElementById('clickButton');
clickButton.addEventListener('click', () => {
    count += clickValue;
    updateCounter();
    saveData();
});

document.getElementById('shopButton').addEventListener('click', () => {
    document.querySelector('.shop').style.display = 'flex';
});

document.getElementById('closeShopButton').addEventListener('click', () => {
    document.querySelector('.shop').style.display = 'none';
});

const showDialog = (message) => {
    const dialog = document.getElementById('dialog');
    dialog.textContent = message;
    dialog.style.display = 'block';
    setTimeout(() => dialog.style.display = 'none', 3000);
};

const purchaseUpgrade = upgradeId => {
    const upgrade = upgrades[upgradeId];
    if (count >= upgrade.cost && !upgrade.purchased) {
        count -= upgrade.cost;
        if (upgradeId === 'autoclicker') {
            activateAutoClicker();
        } else {
            clickValue += upgrade.value;
        }
        upgrade.purchased = true;
        updateCounter();
        saveData();
        showDialog(`Успешно приобрели ${upgradeId}`);
    } else if (upgrade.purchased) {
        showDialog('Вы уже приобрели это улучшение!');
    } else {
        showDialog('Недостаточно очков для улучшения');
    }
};

document.querySelectorAll('.shop-item[data-upgrade]').forEach(item => {
    item.addEventListener('click', () => {
        const upgradeId = item.dataset.upgrade;
        purchaseUpgrade(upgradeId);
    });
});

const activateAutoClicker = () => {
    setInterval(() => {
        count += autoClickerCoinsPerClick;
        updateCounter();
        saveData();
    }, autoClickerIntervalTime);
};

const upgradeAutoClicker = upgrade => {
    if (upgrades[upgrade].purchased) {
        showDialog(`Вы уже приобрели ${upgrade}`);
        return;
    }

    const upgradeData = {
        'autoclicker-speed': { cost: upgrades[upgrade].baseCost * Math.pow(2, upgrades[upgrade].count), effect: 1 },
        'autoclicker-coins': { cost: upgrades[upgrade].baseCost * Math.pow(2, upgrades[upgrade].count), effect: 2 }
    };

    if (count >= upgradeData[upgrade].cost) {
        count -= upgradeData[upgrade].cost;
        upgrades[upgrade].purchased = true;
        upgrades[upgrade].count++;

        if (upgrade === 'autoclicker-speed') {
            autoClickerIntervalTime -= upgradeData[upgrade].effect * 1000;
            restartAutoClicker();
        } else if (upgrade === 'autoclicker-coins') {
            autoClickerCoinsPerClick += upgradeData[upgrade].effect;
        }

        updateCounter();
        saveData();
    } else {
        showDialog(`Недостаточно очков для ${upgrade} улучшения`);
    }
};

const restartAutoClicker = () => {
    clearInterval(autoClickerInterval);
    autoClickerInterval = setInterval(() => {
        count += autoClickerCoinsPerClick;
        updateCounter();
        saveData();
    }, autoClickerIntervalTime);
};

document.querySelectorAll('.shop-item[data-upgrade^="autoclicker"]').forEach(item => {
    item.addEventListener('click', () => {
        const upgrade = item.dataset.upgrade;
        upgradeAutoClicker(upgrade);
    });
});

document.querySelectorAll('.theme-toggle button, .theme-bottom button').forEach(button => {
    button.addEventListener('click', () => {
        document.body.className = button.getAttribute('data-theme');
    });
});

const resetGame = () => {
    if (confirm('Вы точно хотите всё сбросить?')) {
        localStorage.clear();
        window.location.reload();
    }
};

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame);

const showBonusButton = () => {
    const bonusButton = document.getElementById('bonusButton');
    bonusButton.style.display = 'block';

    bonusButton.addEventListener('click', () => {
        count += 0.2;
        updateCounter();
        saveData();
        bonusButton.style.display = 'none';
        setTimeout(showBonusButton, 3600000); // Показать кнопку снова через час
    });
};

setTimeout(showBonusButton, 3600000); // Показать кнопку через час после загрузки страницы

updateCounter();
