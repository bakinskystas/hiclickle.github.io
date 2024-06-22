let count = 0;
let pointsPerClick = 1;
let autoClickerInterval = null;
const autoClickerDuration = 300; // Duration in seconds

const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const shopButton = document.getElementById('shopButton');
const shopElement = document.querySelector('.shop');
const shopItems = document.querySelectorAll('.shop-item');
const closeShopButton = document.getElementById('closeShopButton');
const dialog = document.getElementById('dialog');
const themeButtons = document.querySelectorAll('.theme-toggle button, .theme-bottom button');
const referralCodeInput = document.getElementById('referralCode');
const applyReferralButton = document.getElementById('applyReferralButton');

const upgrades = {
    1: { cost: 10, increment: 1, purchased: false },
    2: { cost: 50, increment: 5, purchased: false },
    3: { cost: 100, increment: 10, purchased: false },
    autoclicker: { cost: 500, purchased: false }
};

const loadSavedData = () => {
    count = parseInt(localStorage.getItem('count') || '0', 10);
    pointsPerClick = parseInt(localStorage.getItem('pointsPerClick') || '1', 10);
    const savedUpgrades = JSON.parse(localStorage.getItem('upgrades')) || upgrades;
    Object.assign(upgrades, savedUpgrades);
    document.body.className = localStorage.getItem('theme') || 'light-theme';
    updateCounter();
};

const saveData = () => {
    localStorage.setItem('count', count);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
};

const updateCounter = () => {
    counterElement.textContent = count;
};

const showDialog = (message) => {
    dialog.textContent = message;
    dialog.style.display = 'block';
    setTimeout(() => dialog.style.display = 'none', 2000);
};

clickButton.addEventListener('click', () => {
    count += pointsPerClick;
    updateCounter();
    saveData();
});

shopButton.addEventListener('click', () => {
    shopElement.style.display = 'flex';
});

closeShopButton.addEventListener('click', () => {
    shopElement.style.display = 'none';
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

const startAutoClicker = () => {
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
};

const changeTheme = (theme) => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
};

themeButtons.forEach(button => {
    button.addEventListener('click', () => changeTheme(button.dataset.theme));
});

const generateReferralCode = () => {
    return 'ref' + Math.random().toString(36).substr(2, 9);
};

const applyReferralCode = () => {
    const code = referralCodeInput.value.trim();
    if (code === localStorage.getItem('referralCode')) {
        showDialog('You cannot use your own referral code!');
        return;
    }
    if (code && !localStorage.getItem('referralUsed')) {
        count += 5000;
        localStorage.setItem('referralUsed', 'true');
        updateCounter();
        saveData();
        showDialog('Referral code applied! You received 5000 points.');
    } else {
        showDialog('Invalid or already used referral code!');
    }
};

applyReferralButton.addEventListener('click', applyReferralCode);

window.addEventListener('load', () => {
    loadSavedData();
    if (!localStorage.getItem('referralCode')) {
        localStorage.setItem('referralCode', generateReferralCode());
    }
    console.log('Your referral code:', localStorage.getItem('referralCode'));
});
