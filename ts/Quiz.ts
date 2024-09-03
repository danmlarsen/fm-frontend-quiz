import iconCorrect from '../assets/images/icon-correct.svg';
import iconIncorrect from '../assets/images/icon-incorrect.svg';

import iconHtml from '../assets/images/icon-html.svg';
import iconCss from '../assets/images/icon-css.svg';
import iconJs from '../assets/images/icon-js.svg';
import iconAccessibility from '../assets/images/icon-accessibility.svg';

import { ProgressBar } from './ProgressBar';

import data from '../data.json';

interface QuizData {
  title: string;
  icon: string;
  questions: Question[];
}

interface Question {
  question: string;
  answer: string;
  options: string[];
}

const numToLabel = function (index: number): string {
  switch (index) {
    default:
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
  }
};

const getIcon = function (str: string): any {
  str = str.toLowerCase();

  if (str === 'html') return iconHtml;
  if (str === 'css') return iconCss;
  if (str === 'javascript') return iconJs;
  if (str === 'accessibility') return iconAccessibility;
};

const escapeHtml = function (str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot')
    .replaceAll("'", '&#039;');
};

export class Quiz {
  private data: QuizData[] = [];
  private questionsContainerElement: HTMLElement;
  private answersContainerElement: HTMLElement;
  private subjectHeaderElement: HTMLElement;
  private selectedSubjectIndex = 0;
  private currentQuestionIndex = 0;
  private currentScore = 0;
  private progressBar: ProgressBar | null = null;

  constructor(private quizElement: Element) {
    this.questionsContainerElement = quizElement.querySelector<HTMLElement>(
      '.quiz__wrapper--questions'
    )!;
    this.answersContainerElement = quizElement.querySelector<HTMLElement>(
      '.quiz__wrapper--answers'
    )!;
    this.subjectHeaderElement = quizElement.querySelector<HTMLElement>('.quiz__subject-header')!;   

    this.fetchData();

    this.renderStartMenu();
  }

  private fetchData(): void {
    this.data = data.quizzes;
  }

  startQuiz(subject: number): void {
    this.selectedSubjectIndex = subject;
    this.currentQuestionIndex = 0;
    this.currentScore = 0;
    this.progressBar = null;

    this.renderSubjectHeader();
    this.renderQuestion();
  }

  private onClickPlayAgain(): void {
    this.renderStartMenu();
  }

  getSelectedSubject(): QuizData {
    return this.data[this.selectedSubjectIndex];
  }

  getCurrentQuestion(): Question {
    return this.getSelectedSubject().questions[this.currentQuestionIndex];
  }

  getNumQuestions(quizData: QuizData = this.getSelectedSubject()): number {
    return quizData.questions.length;
  }

  getValidAnswer(question: Question): string {
    return question.answer;
  }

  renderSubjectHeader(): void {
    const title = this.getSelectedSubject().title;

    this.subjectHeaderElement.innerHTML = `
        <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
            <img src="${getIcon(title)}" alt="${title} icon" class="item__icon" />
        </div>
        <h3 class="item__title">${title}</h3>
    `;
  }

  renderQuestion(): void {
    this.renderQuestionText(this.getSelectedSubject());
    this.renderAnswers(this.getCurrentQuestion().options);
  }

  private handleProgressbarTimeout(): void {
    this.validateAnswer('', true);
    this.renderNextQuestionBtn();
  }

  renderQuestionText(selectedSubject: QuizData): void {
    const totalQuestions = this.getNumQuestions(selectedSubject);
    const questionText = this.getCurrentQuestion().question;

    this.questionsContainerElement.innerHTML = `
            <div class="quiz__question">
                <p class="quiz__question-number">Question ${
                  this.currentQuestionIndex + 1
                } of ${totalQuestions}</p>
                <h2 class="quiz__question-text">${escapeHtml(questionText)}</h2>
                <div class="progress-bar"></div>
            </div>
        `;

    const progressBarElement =
      this.questionsContainerElement.querySelector('.progress-bar');
    if (progressBarElement) {
      this.progressBar = new ProgressBar(
        progressBarElement,
        5000,
        this.handleProgressbarTimeout.bind(this)
      );
      this.progressBar.start();
    }
  }

  private validateAnswer(answer: string, timeout: boolean = false): void {

    if (!timeout && !answer) {
        const answersElement = this.answersContainerElement.querySelector('.quiz__answers')!;

        if (!answersElement.querySelector('.quiz__invalid-answer')) {
            const markup = `
            <div class="quiz__invalid-answer">
                <img class="quiz__answer-icon" src="${iconIncorrect}" alt="Incorrect answer icon" />
                <p>Please select an answer<p>
            </div>
            `
            answersElement.insertAdjacentHTML('beforeend', markup);
        }

        return;
    }

    this.answersContainerElement.querySelector('.quiz__invalid-answer')?.remove();
    
    const validAnswer = this.getValidAnswer(this.getCurrentQuestion());

    const options =
      this.answersContainerElement.querySelectorAll<HTMLInputElement>(
        '.quiz__answer-radio'
      );
    options.forEach((element) => {
      element.checked = false;
      element.disabled = true;

      const labelElement = element.closest('.quiz__answer')!;
      const labelContentElement = labelElement.querySelector('.item')!;

      if (answer === validAnswer && element.value === answer) {
        labelElement?.classList.add('quiz__answer--correct');
      }

      if (answer !== validAnswer && element.value === answer) {
        labelElement?.classList.add('quiz__answer--incorrect');
        labelContentElement?.insertAdjacentHTML(
          'beforeend',
          `<img class="quiz__answer-icon" src="${iconIncorrect}" alt="Incorrect answer icon" />`
        );
      }

      if (element.value === validAnswer) {
        labelContentElement?.insertAdjacentHTML(
          'beforeend',
          `<img class="quiz__answer-icon" src="${iconCorrect}" alt="Correct answer icon" />`
        );
      }
    });
  }

  private renderQuizCompleted(): void {
    const title = this.getSelectedSubject().title;

    this.questionsContainerElement.innerHTML = `
            <div class="quiz__completed-title">
                <h1 class="heading-primary">Quiz completed<br /><strong>You scored...</strong></h1>
            </div>
        `;

    this.answersContainerElement.innerHTML = `
            <div>
                <div class="quiz__completed-stats u-mb-lg">
                    <div class="item">
                        <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
                            <img src="${getIcon(
                              title
                            )}" alt="${title} icon" class="item__icon" />
                        </div>
                        <h3 class="item__title">${title}</h3>
                    </div>

                    <h2 class="quiz__score">${this.currentScore}</h2>
                    <p>out of ${this.getNumQuestions()}</p>
                </div>
                <button class="btn">Play Again</button>
            </div>
        `;

    this.answersContainerElement
      .querySelector<HTMLInputElement>('.btn')!
      .addEventListener('click', this.onClickPlayAgain.bind(this));
  }

  private renderNextQuestionBtn(): void {
      this.answersContainerElement.querySelector<HTMLInputElement>('.quiz__answer-btn')?.remove();
      const nextQuestionBtn = document.createElement('button');
      nextQuestionBtn.classList.add('btn');
      nextQuestionBtn.textContent = 'Next Question';
      nextQuestionBtn.addEventListener('click', this.onClickNextQuestion.bind(this));

      document.querySelector<HTMLElement>('.quiz__answers')!.append(nextQuestionBtn);
  }

  private handleNextQuestion(): void {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.getNumQuestions()) {
      this.renderQuestion();
    } else {
      this.renderQuizCompleted();
    }
  }

  private onClickNextQuestion(e: Event): void {
    e.preventDefault();
    this.handleNextQuestion();
  }

  private onSubmitAnswer(e: SubmitEvent): void {
    e.preventDefault();

    const { answer } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );

    this.validateAnswer(answer as string);
    if (!answer) return;

    if (answer === this.getValidAnswer(this.getCurrentQuestion())) {
      this.currentScore++;
    }
    
    this.progressBar?.stop();

    this.renderNextQuestionBtn();
  }

  renderAnswers(answers: string[]): void {
    const answersMarkup = answers.map(this.renderAnswer).join('');

    this.answersContainerElement.innerHTML = `
            <form class="quiz__answers-form" action="#" method="post" novalidate>
                <div class="quiz__answers">
                    ${answersMarkup}
                    <button class="btn quiz__answer-btn">Submit Answer</button>
                </div>
            </form>
        `;

    const formElement =
      this.answersContainerElement.querySelector<HTMLFormElement>(
        '.quiz__answers-form'
      )!;
    formElement.addEventListener('submit', this.onSubmitAnswer.bind(this));
  }

  renderAnswer(answer: string, index: number): string {
    return `
        <label for="answer-${index + 1}" class="quiz__answer">
            <input class="quiz__answer-radio" type="radio" name="answer" id="answer-${
              index + 1
            }" value="${answer}" required />
            <div class="item">
                <div class="item__icon-box">${numToLabel(index)}</div>
                <h3 class="item__title">${escapeHtml(answer)}</h3>
            </div>
        </label>
    `;
  }

  private renderStartMenu(): void {   
    this.subjectHeaderElement.innerHTML = '&nbsp;';
    this.renderTitle();
    this.renderSubjects();
  }

  private renderTitle(): void {
    const markup = `
            <div class="quiz__welcome">
                <h1 class="heading-primary u-mb-sm">Welcome to the <strong>Frontend Quiz!</strong></h1>
                <p>Pick a subject to get started.</p>
            </div>
        `;

    this.questionsContainerElement.innerHTML = markup;
  }

  private renderSubjectButton({ title }: QuizData, index: number): string {
    return `
            <button class="quiz__subject-btn" data-subject="${index}">
                <div class="item">
                    <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
                        <img src="${getIcon(
                          title
                        )}" alt="${title} icon" class="item__icon" />
                    </div>
                    <h3 class="item__title">${title}</h3>
                </div>
            </button>
        `;
  }

  private renderSubjects(): void {
    const buttons = this.data.map(this.renderSubjectButton).join('');

    const markup = `
            <div class="quiz__subjects">
                ${buttons}
            </div>
        `;

    this.answersContainerElement.innerHTML = markup;

    this.answersContainerElement
      .querySelector('.quiz__subjects')!
      .addEventListener(
        'click',
        (e) => {
          const clickedEl = e.target as HTMLElement;
          const clickedButton = clickedEl.closest('button');

          if (clickedButton && clickedButton.dataset.subject) {
            this.startQuiz(Number(clickedButton.dataset.subject));
          }
        },
        { once: true }
      );
  }
}
