import { ProgressBar } from "./ProgressBar";

const progressBar = document.querySelector('.progress-bar')
if (progressBar) {
    const slider = new ProgressBar(progressBar, 10000);
    slider.start();
}

const checkbox = document.getElementById('theme-checkbox');

checkbox?.addEventListener('click', function (e) {
    document.body.classList.toggle('dark-mode');
});
