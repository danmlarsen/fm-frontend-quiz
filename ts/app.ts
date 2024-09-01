import { Toggle } from './Toggle';
import { Quiz } from './Quiz';

const toggleWrapper = document.querySelector('.quiz__theme');
if (toggleWrapper) {
  const toggle = new Toggle(toggleWrapper);
}

const quizElement = document.querySelector('.quiz');
if (quizElement) {
    const quiz = new Quiz(quizElement);
}
