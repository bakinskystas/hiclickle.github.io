function startCountdown(duration) {
    let timer = duration, minutes, seconds;
    const countdownElement = document.getElementById('countdown');

    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        countdownElement.textContent = "Возвращение через: " + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

window.onload = function () {
    const maintenanceDuration = 60 * 30; // 30 минут
    startCountdown(maintenanceDuration);
};
