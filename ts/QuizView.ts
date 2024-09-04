import iconCorrect from '../assets/images/icon-correct.svg';
import iconIncorrect from '../assets/images/icon-incorrect.svg';

import { ProgressBar } from './ProgressBar';
import { QuizData } from './Quiz';
import { numToLabel, getIcon, escapeHtml } from './Utility';

export class QuizView {
    private questionsContainerElement: HTMLElement;
    private answersContainerElement: HTMLElement;
    private subjectHeaderElement: HTMLElement;
    progressBar: ProgressBar | null = null;

    constructor(rootElement: Element) {
        this.questionsContainerElement = rootElement.querySelector<HTMLElement>('.quiz__wrapper--questions')!;
        this.answersContainerElement = rootElement.querySelector<HTMLElement>('.quiz__wrapper--answers')!;
        this.subjectHeaderElement = rootElement.querySelector<HTMLElement>('.quiz__subject-header')!;
    }

    renderStartMenu(data: QuizData[], onSubjectClick: (e: Event) => void): void {
        this.subjectHeaderElement.innerHTML = '&nbsp;';
        this.renderTitle();
        this.renderSubjects(data, onSubjectClick);
    }

    renderTitle(): void {
        this.questionsContainerElement.innerHTML = `
                <div class="quiz__welcome">
                    <h1 class="heading-primary u-mb-xl">Welcome to the <strong>Frontend Quiz!</strong></h1>
                    <p>Pick a subject to get started.</p>
                </div>
            `;
    }

    renderSubjectHeader(title: string): void {
        this.subjectHeaderElement.innerHTML = `
            <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
                <img src="${getIcon(title)}" alt="${title} icon" class="item__icon" />
            </div>
            <h2 class="item__title">${title}</h2>
        `;
    }

    renderSubjectButton({ title }: QuizData, index: number): string {
        return `
                <button class="quiz__subject-btn item" data-subject="${index}">
                        <span class="item__icon-box item__icon-box--${title.toLowerCase()}">
                            <img src="${getIcon(title)}" alt="${title} icon" class="item__icon" />
                        </span>
                        <span class="item__title">${title}</span>
                </button>
            `;
    }

    renderSubjects(data: QuizData[], onSubjectClick: (e: Event) => void): void {
        const buttons = data.map(this.renderSubjectButton).join('');

        this.answersContainerElement.innerHTML = `
                <div class="quiz__subjects">
                    ${buttons}
                </div>
            `;

        this.answersContainerElement.querySelector('.quiz__subjects')!.addEventListener('click', onSubjectClick);
    }

    renderQuestionText(questionText: string, questionIndex: number, totalQuestions: number, onProgressBarTimeout: () => void): void {
        this.questionsContainerElement.innerHTML = `
                <div class="quiz__question fade-in">
                    <p class="quiz__question-number">Question ${questionIndex + 1} of ${totalQuestions}</p>
                    <h2 class="quiz__question-text">${escapeHtml(questionText)}</h2>
                    <div class="progress-bar"></div>
                </div>
            `;

        const progressBarElement = this.questionsContainerElement.querySelector('.progress-bar');
        if (progressBarElement) {
            this.progressBar = new ProgressBar(progressBarElement, onProgressBarTimeout);
            this.progressBar.start();
        }
    }

    renderAnswers(answers: string[], onSubmitAnswer: (e: SubmitEvent) => void): void {
        const answersMarkup = answers.map(this.renderAnswer).join('');

        this.answersContainerElement.innerHTML = `
                <form class="quiz__answers-form" action="#" method="post" novalidate>
                    <fieldset role="radiogroup" class="quiz__answers fade-in">
                        ${answersMarkup}
                        <button class="btn quiz__answer-btn">Submit Answer</button>
                    </fieldset>
                </form>
            `;

        const formElement = this.answersContainerElement.querySelector<HTMLFormElement>('.quiz__answers-form')!;
        formElement.addEventListener('submit', onSubmitAnswer);
    }

    renderAnswer(answer: string, index: number): string {
        return `
            <label for="answer-${index + 1}" class="quiz__answer">
                <input class="quiz__answer-radio" type="radio" name="answer" id="answer-${index + 1}" value="${answer}" aria-labelledby="answer-${index + 1}-title" />
                <div class="item">
                    <div class="item__icon-box">${numToLabel(index)}</div>
                    <h2 class="item__title" id="answer-${index + 1}-title">${escapeHtml(answer)}</h2>
                </div>
            </label>
        `;
    }

    renderQuizCompleted(title: string, currentScore: number, numQuestions: number, onPlayAgain: () => void): void {
        this.questionsContainerElement.innerHTML = `
            <div class="quiz__completed-title fade-in">
                <h1 class="heading-primary">Quiz completed<br /><strong>You scored...</strong></h1>
            </div>
        `;

        this.answersContainerElement.innerHTML = `
            <div class="fade-in-delayed">
                <div class="quiz__completed-stats u-mb-lg ">
                    <div class="item">
                        <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
                            <img src="${getIcon(title)}" alt="${title} icon" class="item__icon" />
                        </div>
                        <h2 class="item__title">${title}</h2>
                    </div>

                    <h2 class="quiz__score">${currentScore}</h2>
                    <p>out of ${numQuestions}</p>
                </div>
                <button class="btn">Play Again</button>
            </div>
        `;

        this.answersContainerElement.querySelector<HTMLInputElement>('.btn')!.addEventListener('click', onPlayAgain);
    }

    renderNextQuestionBtn(onClickNextQuestion: (e: Event) => void): void {
        this.answersContainerElement.querySelector<HTMLInputElement>('.quiz__answer-btn')?.remove();
        const nextQuestionBtn = document.createElement('button');
        nextQuestionBtn.classList.add('btn');
        nextQuestionBtn.classList.add('fade-in');
        nextQuestionBtn.textContent = 'Next Question';
        nextQuestionBtn.addEventListener('click', onClickNextQuestion);

        document.querySelector<HTMLElement>('.quiz__answers')!.append(nextQuestionBtn);
    }

    renderAnswerReminder(): void {
        const answersElement = this.answersContainerElement.querySelector('.quiz__answers')!;

        if (!answersElement.querySelector('.quiz__invalid-answer')) {
            const markup = `
            <div class="quiz__invalid-answer fade-in">
                <img class="quiz__answer-icon" src="${iconIncorrect}" alt="Incorrect answer icon" />
                <p>Please select an answer<p>
            </div>
            `;
            answersElement.insertAdjacentHTML('beforeend', markup);
        }
    }

    renderValidatedOptions(answer: string, correctAnswer: string): void {
        this.answersContainerElement.querySelector('.quiz__invalid-answer')?.remove();

        const options = this.answersContainerElement.querySelectorAll<HTMLInputElement>('.quiz__answer-radio');
        options.forEach(element => {
            element.checked = false;
            element.disabled = true;

            const labelElement = element.closest('.quiz__answer')!;
            const labelContentElement = labelElement.querySelector('.item')!;

            if (answer === correctAnswer && element.value === answer) {
                labelElement?.classList.add('quiz__answer--correct');
            }

            if (answer !== correctAnswer && element.value === answer) {
                labelElement?.classList.add('quiz__answer--incorrect');
                this.renderInvalidIcon(labelContentElement);
            }

            if (element.value === correctAnswer) {
                this.renderValidIcon(labelContentElement);
            }
        });
    }

    renderInvalidIcon(parent: Element): void {
        parent.insertAdjacentHTML('beforeend', `<img class="quiz__answer-icon fade-in-right" src="${iconIncorrect}" alt="Incorrect answer icon" />`);
    }

    renderValidIcon(parent: Element): void {
        parent?.insertAdjacentHTML('beforeend', `<img class="quiz__answer-icon fade-in-right" src="${iconCorrect}" alt="Correct answer icon" />`);
    }
}
