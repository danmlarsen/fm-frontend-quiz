export class ProgressBar {
  private timer: number = 0;
  private remainingDuration: number = 30000;
  private intervalTime: number;
  private progressBarElement: HTMLElement;

  constructor(
    private parent: Element,
    private totalDuration: number = 30000,
    private finishedCallback: () => void = () => null
  ) {
    this.intervalTime = 10;
    this.progressBarElement = document.createElement('div');

    this.renderProgressBar();
  }

  start(): void {
    this.remainingDuration = this.totalDuration;
    this.timer = setInterval(this.handleInterval.bind(this), this.intervalTime);
  }

  stop(): void {
    clearInterval(this.timer);
    this.finishedCallback();
  }

  calcRemainingPercent(): number {
    return (this.remainingDuration / this.totalDuration) * 100;
  }

  private updateProgressBarWidth(): void {
    this.progressBarElement.style.width =
      this.calcRemainingPercent().toString() + '%';
  }

  private renderProgressBar(): void {
    this.parent.innerHTML = '';
    this.parent.append(this.progressBarElement);
  }

  private handleInterval(): void {
    this.remainingDuration -= this.intervalTime;
    this.updateProgressBarWidth();

    if (this.remainingDuration <= 0) {
      this.stop();
    }
  }
}
