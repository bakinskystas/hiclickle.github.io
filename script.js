let count = 0;
let pointsPerClick = 1;
let autoClickerInterval = null;
const autoClickerDuration = 300; // Duration in seconds

const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const shopItems = document.querySelectorAll('.shop-item');
const dialog = document.getElementById('dialog');
const themeButtons = document.querySelectorAll('.theme-toggle button, .theme-bottom button');

const upgrades = {
    1: { cost: 10, increment: 1, purchased: false },
    2: { cost: 50, increment: 5, purchased: false },
    3: { cost: 100, increment: 10, purchased: false },
    autoclicker: { cost: 500, purchased: false }
};

function loadSavedData() {
    const savedCount = localStorage.getItem('count');
    const savedPointsPerClick = localStorage.getItem('pointsPerClick');
    const savedUpgrades = localStorage.getItem('upgrades');
    const savedTheme = localStorage.getItem('theme');

    if (savedCount) count = parseInt(savedCount, 10);
    if (savedPointsPerClick) pointsPerClick = parseInt(savedPointsPerClick, 10);
    if (savedUpgrades) Object.assign(upgrades, JSON.parse(savedUpgrades));
    document.body.className = savedTheme || 'light-theme';

    updateCounter();
}

function saveData() {
    localStorage.setItem('count', count);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function updateCounter() {
    counterElement.textContent = count;
}

function showDialog(message) {
    dialog.textContent = message;
    dialog.style.display = 'block';
    setTimeout(() => dialog.style.display = 'none', 2000);
}

clickButton.addEventListener('click', () => {
    count += pointsPerClick;
    updateCounter();
    saveData();
});

shopItems.forEach(item => {
    item.addEventListener('click', () => {
        const upgrade = item.dataset.upgrade;
        if (upgrades[upgrade].purchased) {
            showDialog(`You have already purchased ${upgrade}!`);
            return;
        }
        if (count >= upgrades[upgrade].cost) {
            count -= upgrades[upgrade].cost;
            upgrades[upgrade].purchased = true;
            if (upgrade !== 'autoclicker') {
                pointsPerClick += upgrades[upgrade].increment;
            } else {
                startAutoClicker();
            }
            updateCounter();
            saveData();
        } else {
            showDialog(`Not enough points for ${upgrade}!`);
        }
    });
});

function startAutoClicker() {
    if (autoClickerInterval) clearInterval(autoClickerInterval);
    let autoClickerTimeLeft = autoClickerDuration;
    autoClickerInterval = setInterval(() => {
        if (autoClickerTimeLeft > 0) {
            count += pointsPerClick;
            updateCounter();
            saveData();
            autoClickerTimeLeft--;
        } else {
            clearInterval(autoClickerInterval);
        }
    }, 1000); // Add points every second
}

function changeTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

themeButtons.forEach(button => {
    button.addEventListener('click', () => changeTheme(button.dataset.theme));
});

window.addEventListener('load', loadSavedData);
