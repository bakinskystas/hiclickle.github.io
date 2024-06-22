let count = 0;
let pointsPerClick = 1;
let autoClickerInterval = null;
const autoClickerDuration = 300; // Duration in seconds

const counterElement = document.getElementById('counter');
const clickButton = document.getElementById('clickButton');
const upgrade1 = document.getElementById('upgrade1');
const upgrade2 = document.getElementById('upgrade2');
const upgrade3 = document.getElementById('upgrade3');
const autoclicker = document.getElementById('autoclicker');
const dialog = document.getElementById('dialog');
const darkThemeButton = document.getElementById('darkThemeButton');
const lightThemeButton = document.getElementById('lightThemeButton');
const yellowThemeButton = document.getElementById('yellowThemeButton');

// Flags to track purchased upgrades
let upgrade1Purchased = false;
let upgrade2Purchased = false;
let upgrade3Purchased = false;
let autoclickerPurchased = false;

// Load saved data
function loadSavedData() {
    const savedCount = localStorage.getItem('count');
    if (savedCount !== null) {
        count = parseInt(savedCount, 10);
    }

    const savedPointsPerClick = localStorage.getItem('pointsPerClick');
    if (savedPointsPerClick !== null) {
        pointsPerClick = parseInt(savedPointsPerClick, 10);
    }

    const savedUpgrades = localStorage.getItem('upgrades');
    if (savedUpgrades !== null) {
        const upgrades = JSON.parse(savedUpgrades);
        upgrade1Purchased = upgrades.upgrade1;
        upgrade2Purchased = upgrades.upgrade2;
        upgrade3Purchased = upgrades.upgrade3;
        autoclickerPurchased = upgrades.autoclicker;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== null) {
        document.body.className = savedTheme;
    } else {
        document.body.className = 'light-theme';
    }

    updateCounter();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('count', count);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    const upgrades = {
        upgrade1: upgrade1Purchased,
        upgrade2: upgrade2Purchased,
        upgrade3: upgrade3Purchased,
        autoclicker: autoclickerPurchased,
    };
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

// Update the counter display
function updateCounter() {
    counterElement.textContent = count;
}

// Show dialog
function showDialog(message) {
    dialog.textContent = message;
    dialog.style.display = 'block';
    setTimeout(() => {
        dialog.style.display = 'none';
    }, 2000);
}

// Click button event
clickButton.addEventListener('click', () => {
    count += pointsPerClick;
    updateCounter();
    saveData();
});

// Upgrade 1 event
upgrade1.addEventListener('click', () => {
    if (upgrade1Purchased) {
        showDialog('You have already purchased Upgrade 1!');
        return;
    }
    if (count >= 10) {
        count -= 10;
        pointsPerClick += 1;
        upgrade1Purchased = true;
        updateCounter();
        saveData();
    } else {
        showDialog('Not enough points for Upgrade 1!');
    }
});

// Upgrade 2 event
upgrade2.addEventListener('click', () => {
    if (upgrade2Purchased) {
        showDialog('You have already purchased Upgrade 2!');
        return;
    }
    if (count >= 50) {
        count -= 50;
        pointsPerClick += 5;
        upgrade2Purchased = true;
        updateCounter();
        saveData();
    } else {
        showDialog('Not enough points for Upgrade 2!');
    }
});

// Upgrade 3 event
upgrade3.addEventListener('click', () => {
    if (upgrade3Purchased) {
        showDialog('You have already purchased Upgrade 3!');
        return;
    }
    if (count >= 100) {
        count -= 100;
        pointsPerClick += 10;
        upgrade3Purchased = true;
        updateCounter();
        saveData();
    } else {
        showDialog('Not enough points for Upgrade 3!');
    }
});

// Autoclicker event
autoclicker.addEventListener('click', () => {
    if (autoclickerPurchased) {
        showDialog('You have already purchased the Autoclicker!');
        return;
    }
    if (count >= 500) {
        count -= 500;
        autoclickerPurchased = true;
        updateCounter();
        saveData();
        startAutoClicker();
    } else {
        showDialog('Not enough points for Autoclicker!');
    }
});

// Start auto clicker
function startAutoClicker() {
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
    }
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

// Change theme
function changeTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
}

// Theme buttons event listeners
darkThemeButton.addEventListener('click', () => changeTheme('dark-theme'));
lightThemeButton.addEventListener('click', () => changeTheme('light-theme'));
yellowThemeButton.addEventListener('click', () => changeTheme('yellow-theme'));

// Load saved data when the page loads
window.addEventListener('load', loadSavedData);
