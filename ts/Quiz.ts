import data from '../data.json';

import { QuizView } from './QuizView';

export interface QuizData {
  title: string;
  icon: string;
  questions: Question[];
}

export interface Question {
  question: string;
  answer: string;
  options: string[];
}

export class Quiz {
  private data: QuizData[] = [];
  private quizView: QuizView;
  private selectedSubjectIndex = 0;
  private currentQuestionIndex = 0;
  private currentScore = 0;

  constructor(private quizElement: Element) {
    this.fetchData();
    this.quizView = new QuizView(quizElement);
    this.quizView.renderStartMenu(this.data, this.onSubjectClicked);
  }

  private fetchData(): void {
    this.data = data.quizzes;
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

  selectSubject(subject: number): void {   
    this.selectedSubjectIndex = subject;
    this.currentQuestionIndex = 0;
    this.currentScore = 0;

    this.quizView.renderSubjectHeader(this.getSelectedSubject().title);
    this.NextQuestion();
  }

  private NextQuestion(): void {
    this.quizView.renderQuestionText(this.getCurrentQuestion().question, this.currentQuestionIndex, this.getNumQuestions(), this.onProgressBarTimeout);
    this.quizView.renderAnswers(this.getCurrentQuestion().options, this.onSubmitAnswer);
  }

  private validateAnswers(answer: string, timeout: boolean = false): void {

    if (!timeout && !answer) {
        this.quizView.renderAnswerReminder();
        return;
    }
    
    const validAnswer = this.getValidAnswer(this.getCurrentQuestion());

    this.quizView.renderValidatedOptions(answer, validAnswer);
  }

  private handleNextQuestion(): void {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.getNumQuestions()) {
      this.NextQuestion();
    } else {
      this.quizView.renderQuizCompleted(this.getSelectedSubject().title, this.currentScore, this.getNumQuestions(), this.onClickPlayAgain);
    }
  }

  private onProgressBarTimeout = (): void => {
    this.validateAnswers('', true);
    this.quizView.renderNextQuestionBtn(this.onClickNextQuestion);
  }

  private onSubjectClicked = (e: Event) => {
    const clickedEl = e.target as HTMLElement;
    const clickedButton = clickedEl.closest('button');

    if (clickedButton && clickedButton.dataset.subject) {
      this.selectSubject(Number(clickedButton.dataset.subject));
    }
  }

  private onClickNextQuestion = (e: Event): void => {
    e.preventDefault();
    this.handleNextQuestion();
  }

  private onSubmitAnswer = (e: SubmitEvent): void => {
    e.preventDefault();

    const { answer } = Object.fromEntries(
      new FormData(e.target as HTMLFormElement)
    );

    this.validateAnswers(answer as string);
    if (!answer) return;

    if (answer === this.getValidAnswer(this.getCurrentQuestion())) {
      this.currentScore++;
    }
    
    this.quizView.progressBar?.stop();

    this.quizView.renderNextQuestionBtn(this.onClickNextQuestion);
  }

  private onClickPlayAgain = (): void => {
    this.quizView.renderStartMenu(this.data, this.onSubjectClicked);
  }
}
