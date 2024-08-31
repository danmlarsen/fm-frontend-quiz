import { ProgressBar } from './ProgressBar';
import { Toggle } from './Toggle';

const progressBar = document.querySelector('.progress-bar');
if (progressBar) {
  const slider = new ProgressBar(progressBar, 10000);
  slider.start();
}

const toggleWrapper = document.querySelector('.quiz__theme');
if (toggleWrapper) {
  const toggle = new Toggle(toggleWrapper);
}
