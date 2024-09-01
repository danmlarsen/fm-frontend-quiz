import iconCorrect from '../assets/images/icon-correct.svg';
import iconIncorrect from '../assets/images/icon-incorrect.svg';

import iconHtml from '../assets/images/icon-html.svg';
import iconCss from '../assets/images/icon-css.svg';
import iconJs from '../assets/images/icon-js.svg';
import iconAccessibility from '../assets/images/icon-accessibility.svg'

import { ProgressBar } from './ProgressBar';

import data from '../data.json';

interface QuizData {
    title: string,
    icon: string,
    questions: Question[]
}

interface Question {
    question: string
    answer: string,
    options: string[]
}

const NumToLabel = function(index:number): string {
    switch(index) {
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
}

export class Quiz {
    
    private data: QuizData[] = [];
    private questionsContainerElement: HTMLElement;
    private answersContainerElement: HTMLElement;
    private quizHeader: HTMLElement;
    private selectedSubjectIndex = 0;
    private currentQuestion = 0;
    private progressBar: ProgressBar | null = null;


    constructor(
        private quizElement: Element
    ) {
        this.questionsContainerElement = quizElement.querySelector('.quiz__wrapper--questions') as HTMLElement;
        this.answersContainerElement = quizElement.querySelector('.quiz__wrapper--answers') as HTMLElement;
        this.quizHeader = quizElement.querySelector('.quiz__header .item') as HTMLElement;

        this.fetchData();

        this.renderStartMenu();
    }

    private fetchData(): void {
        this.data = data.quizzes;
        console.log(data);  
    }

    startQuiz(subject: number): void {
        this.selectedSubjectIndex = subject;
        this.currentQuestion = 0;

        const titleTextElement = this.quizHeader.querySelector('.item__title');
        if (titleTextElement) {
            titleTextElement.textContent = this.data[this.selectedSubjectIndex].title;
        }

        this.renderQuestion();
    }

    renderQuestion(): void {
        const selectedSubject = this.data[this.selectedSubjectIndex];
        const answers = selectedSubject.questions[this.currentQuestion].options

        this.renderQuestionText(selectedSubject);
        this.renderAnswers(answers);
    }

    renderQuestionText(selectedSubject: QuizData): void {
        const totalQuestions = selectedSubject.questions.length
        const questionText = selectedSubject.questions[this.currentQuestion].question;

        this.questionsContainerElement.innerHTML = `
            <div class="quiz__question">
                <p class="quiz__question-number">Question ${this.currentQuestion + 1} of ${totalQuestions}</p>
                <h2 class="quiz__question-text">${questionText}</h2>
                <div class="progress-bar"></div>
            </div>
        `;

        const progressBarElement = this.questionsContainerElement.querySelector('.progress-bar');
        if (progressBarElement) {
            this.progressBar = new ProgressBar(progressBarElement);
            this.progressBar.start();
        }
    }

    private onSubmitAnswer(e: SubmitEvent): void {
        e.preventDefault();

        const validAnswer = this.data[this.selectedSubjectIndex].questions[this.currentQuestion].answer;

        const {answer} = Object.fromEntries(new FormData(e.target as HTMLFormElement));

        console.log(e.target);
        console.log(answer);
        
        this.progressBar?.stop();

        const options = this.answersContainerElement.querySelectorAll('.quiz__answer-radio');
        options.forEach((element) => {  

            (element as HTMLInputElement).checked = false;
            (element as HTMLInputElement).disabled = true;

            const labelElement = element.closest('.quiz__answer');

            if (answer === validAnswer && (element as HTMLInputElement).value === answer) {
                labelElement?.classList.add('quiz__answer--correct');
            }

            if (answer !== validAnswer && (element as HTMLInputElement).value === answer) {
                labelElement?.classList.add('quiz__answer--incorrect');
                labelElement?.insertAdjacentHTML('beforeend', `<img class="quiz__answer-icon" src="${iconIncorrect}" alt="Incorrect answer icon" />`)
            }

            if ((element as HTMLInputElement).value === validAnswer) {
                labelElement?.insertAdjacentHTML('beforeend', `<img class="quiz__answer-icon" src="${iconCorrect}" alt="Correct answer icon" />`)
            }
        });

        const answerBtn = this.answersContainerElement.querySelector('.quiz__answer-btn') as HTMLInputElement;
        if (answerBtn) {
            answerBtn.textContent = 'Next Question';
            answerBtn.blur();
        }

        // this.currentQuestion++;
        // this.renderQuestion();

    }

    renderAnswers(answers: string[]): void {
        const answersMarkup = answers.map(this.renderAnswer).join('');

        this.answersContainerElement.innerHTML = `
            <form class="quiz__answers-form" action="#" method="post">
                <div class="quiz__answers">
                    ${answersMarkup}
                    <button class="btn quiz__answer-btn">Submit Answer</button>
                </div>
            </form>
        `;

        const formElement = this.answersContainerElement.querySelector('.quiz__answers-form') as HTMLFormElement;
        formElement.addEventListener('submit', this.onSubmitAnswer.bind(this));

    }

    renderAnswer(answer: string, index: number): string {
        return `
        <label for="answer-${index+1}" class="quiz__answer">
            <input class="quiz__answer-radio" type="radio" name="answer" id="answer-${index+1}" value="${answer}" required />
            <div class="item">
                <div class="item__icon-box">${NumToLabel(index)}</div>
                <h3 class="item__title">${answer}</h3>
            </div>
        </label>
    `
    }

    private renderStartMenu(): void {
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

    private renderSubjectButton({title}: QuizData, index: number): string { 

        let icon = '';
        if (title === 'HTML') icon = iconHtml; 
        if (title === 'CSS') icon = iconCss; 
        if (title === 'JavaScript') icon = iconJs; 
        if (title === 'Accessibility') icon = iconAccessibility; 
        
        return `
            <button class="quiz__subject-btn" data-subject="${index}">
                <div class="item">
                    <div class="item__icon-box item__icon-box--${title.toLowerCase()}">
                        <img src="${icon}" alt="${title} icon" class="item__icon" />
                    </div>
                    <h3 class="item__title">${title}</h3>
                </div>
            </button>
        `
    } 

    private renderSubjects(): void {

        const buttons = this.data.map(this.renderSubjectButton).join('');

        const markup = `
            <div class="quiz__subjects">
                ${buttons}
            </div>
        `;

        this.answersContainerElement.innerHTML = markup;

        this.answersContainerElement.addEventListener('click', e => {
            const clickedEl = e.target as HTMLElement;
            const clickedButton = clickedEl.closest('button');

            if (clickedButton && clickedButton.dataset.subject) {
                this.startQuiz(Number(clickedButton.dataset.subject));
            }
        })
    }
}